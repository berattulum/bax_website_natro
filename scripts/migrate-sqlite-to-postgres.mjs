import { createHash } from 'node:crypto'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import pg from 'pg'

const { Client } = pg
const apply = process.argv.includes('--apply')
const publish = process.argv.includes('--publish')
const sourceURL = process.env.SQLITE_DATABASE_URL || 'file:./bax.db'
const sourcePath = path.resolve(sourceURL.replace(/^file:/, ''))
const targetURL = process.env.DATABASE_URL

if (!targetURL?.startsWith('postgres')) {
  throw new Error('DATABASE_URL must point to PostgreSQL.')
}
if (!existsSync(sourcePath)) {
  throw new Error(`SQLite source does not exist: ${sourcePath}`)
}

const excludedTables = new Set([
  'payload_migrations',
  'site_settings',
  'site_settings_locales',
  '_site_settings_v',
  '_site_settings_v_locales',
  'users_sessions',
])

const quoteIdentifier = (value) => `"${String(value).replaceAll('"', '""')}"`
const checksum = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16)

async function verifyForeignKeys(client) {
  const constraints = await client.query(`
    SELECT
      constraint_info.conname,
      constraint_info.child_table,
      constraint_info.parent_table,
      array_agg(child_attribute.attname::text ORDER BY key_info.ordinality)::text[] AS child_columns,
      array_agg(parent_attribute.attname::text ORDER BY key_info.ordinality)::text[] AS parent_columns
    FROM (
      SELECT
        constraint_row.oid,
        constraint_row.conname,
        constraint_row.conrelid,
        constraint_row.confrelid,
        constraint_row.conrelid::regclass::text AS child_table,
        constraint_row.confrelid::regclass::text AS parent_table,
        constraint_row.conkey,
        constraint_row.confkey
      FROM pg_constraint constraint_row
      WHERE constraint_row.contype = 'f'
        AND constraint_row.connamespace = 'public'::regnamespace
    ) constraint_info
    CROSS JOIN LATERAL unnest(constraint_info.conkey, constraint_info.confkey)
      WITH ORDINALITY AS key_info(child_attnum, parent_attnum, ordinality)
    JOIN pg_attribute child_attribute
      ON child_attribute.attrelid = constraint_info.conrelid
      AND child_attribute.attnum = key_info.child_attnum
    JOIN pg_attribute parent_attribute
      ON parent_attribute.attrelid = constraint_info.confrelid
      AND parent_attribute.attnum = key_info.parent_attnum
    GROUP BY constraint_info.conname, constraint_info.child_table, constraint_info.parent_table
    ORDER BY constraint_info.child_table, constraint_info.conname
  `)

  for (const constraint of constraints.rows) {
    const childAlias = 'child_row'
    const parentAlias = 'parent_row'
    const join = constraint.child_columns
      .map((column, index) => `${childAlias}.${quoteIdentifier(column)} = ${parentAlias}.${quoteIdentifier(constraint.parent_columns[index])}`)
      .join(' AND ')
    const populated = constraint.child_columns
      .map((column) => `${childAlias}.${quoteIdentifier(column)} IS NOT NULL`)
      .join(' AND ')
    const missing = constraint.parent_columns
      .map((column) => `${parentAlias}.${quoteIdentifier(column)} IS NULL`)
      .join(' AND ')
    const result = await client.query(
      `SELECT count(*)::int AS count
       FROM ${quoteIdentifier(constraint.child_table)} ${childAlias}
       LEFT JOIN ${quoteIdentifier(constraint.parent_table)} ${parentAlias} ON ${join}
       WHERE ${populated} AND ${missing}`,
    )
    if (result.rows[0].count > 0) {
      throw new Error(`${constraint.conname}: ${result.rows[0].count} orphan rows`)
    }
  }

  return constraints.rowCount
}

function targetValue(value, column) {
  if (value === null || value === undefined) return null
  if (column.data_type === 'boolean') return value === true || value === 1 || value === '1'
  if (column.data_type === 'json' || column.data_type === 'jsonb') {
    return typeof value === 'string' ? JSON.parse(value) : value
  }
  if (column.data_type === 'bytea' && value instanceof Uint8Array) return Buffer.from(value)
  return value
}

const sqlite = new DatabaseSync(sourcePath, { readOnly: true })
sqlite.exec('PRAGMA query_only = ON')
const integrity = sqlite.prepare('PRAGMA integrity_check').get().integrity_check
if (integrity !== 'ok') throw new Error(`SQLite integrity check failed: ${integrity}`)

const sourceTables = sqlite
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map(({ name }) => String(name))

const client = new Client({ connectionString: targetURL })
await client.connect()

try {
  const targetTableResult = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
  )
  const targetTables = new Set(targetTableResult.rows.map(({ table_name }) => table_name))
  const tables = sourceTables.filter((name) => targetTables.has(name) && !excludedTables.has(name))
  const plans = []

  for (const table of tables) {
    const sourceColumns = new Set(
      sqlite.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all().map(({ name }) => String(name)),
    )
    const targetColumnsResult = await client.query(
      `SELECT column_name, data_type, udt_name, column_default, is_nullable
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`,
      [table],
    )
    const targetColumns = targetColumnsResult.rows
    const columns = targetColumns.filter(({ column_name }) => sourceColumns.has(column_name))
    const missingRequired = targetColumns.filter(
      ({ column_name, column_default, is_nullable }) =>
        !sourceColumns.has(column_name) && column_default === null && is_nullable === 'NO',
    )

    if (missingRequired.length) {
      throw new Error(`${table}: required target columns missing in SQLite: ${missingRequired.map((c) => c.column_name).join(', ')}`)
    }

    const rows = sqlite.prepare(`SELECT * FROM ${quoteIdentifier(table)}`).all()
    plans.push({ table, columns, rows })
  }

  const mediaFiles = new Set(
    existsSync(path.resolve('media')) ? readdirSync(path.resolve('media'), { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name) : [],
  )
  const mediaRows = sqlite.prepare('SELECT filename FROM media WHERE filename IS NOT NULL').all()
  const missingMedia = mediaRows.map(({ filename }) => String(filename)).filter((filename) => !mediaFiles.has(filename))
  if (missingMedia.length) throw new Error(`Missing media files: ${missingMedia.join(', ')}`)

  console.log(`SQLite integrity: ${integrity}`)
  console.log(`Source: ${sourcePath}`)
  console.log(`Target tables planned: ${plans.length}`)
  console.log(`Media records/files: ${mediaRows.length}/${mediaFiles.size}`)
  console.log(`Publish imported content: ${publish ? 'yes' : 'no'}`)
  for (const plan of plans) {
    console.log(`${plan.table}\t${plan.rows.length}\t${checksum(plan.rows)}`)
  }

  if (!apply) {
    console.log('Dry run complete. Re-run with --apply to perform the transactional import.')
    process.exitCode = 0
  } else {
    await client.query('BEGIN')
    try {
      await client.query("SET LOCAL session_replication_role = 'replica'")
      if (plans.length) {
        await client.query(`TRUNCATE ${plans.map(({ table }) => quoteIdentifier(table)).join(', ')} RESTART IDENTITY CASCADE`)
      }

      for (const { table, columns, rows } of plans) {
        if (!columns.length) continue
        const columnSQL = columns.map(({ column_name }) => quoteIdentifier(column_name)).join(', ')
        const parameterSQL = columns.map((_, index) => `$${index + 1}`).join(', ')
        const insertSQL = `INSERT INTO ${quoteIdentifier(table)} (${columnSQL}) VALUES (${parameterSQL})`

        for (const row of rows) {
          await client.query(insertSQL, columns.map((column) => targetValue(row[column.column_name], column)))
        }
      }

      if (publish) {
        const publishTargets = [
          ['site_content', '_site_content_v'],
          ['expertise_items', '_expertise_items_v'],
          ['partners', '_partners_v'],
          ['memberships', '_memberships_v'],
        ].filter(([table, versionsTable]) => targetTables.has(table) && targetTables.has(versionsTable))

        for (const [table, versionsTable] of publishTargets) {
          await client.query(`UPDATE ${quoteIdentifier(table)} SET _status = 'published'`)
          await client.query(`UPDATE ${quoteIdentifier(versionsTable)} SET version__status = 'published' WHERE latest = true`)
        }
      }

      for (const { table, columns } of plans) {
        for (const column of columns.filter(({ column_default }) => column_default?.startsWith('nextval('))) {
          const sequenceResult = await client.query('SELECT pg_get_serial_sequence($1, $2) AS sequence', [table, column.column_name])
          const sequence = sequenceResult.rows[0]?.sequence
          if (!sequence) continue
          const maximumResult = await client.query(
            `SELECT COALESCE(MAX(${quoteIdentifier(column.column_name)}), 0)::bigint AS maximum FROM ${quoteIdentifier(table)}`,
          )
          const maximum = Number(maximumResult.rows[0].maximum)
          await client.query('SELECT setval($1::regclass, $2, $3)', [sequence, Math.max(maximum, 1), maximum > 0])
        }
      }

      for (const { table, rows } of plans) {
        const result = await client.query(`SELECT count(*)::int AS count FROM ${quoteIdentifier(table)}`)
        if (result.rows[0].count !== rows.length) {
          throw new Error(`${table}: verification failed (${result.rows[0].count} != ${rows.length})`)
        }
      }

      await client.query("SET LOCAL session_replication_role = 'origin'")
      const verifiedForeignKeys = await verifyForeignKeys(client)

      await client.query('COMMIT')
      console.log(`Import committed successfully: ${plans.reduce((total, plan) => total + plan.rows.length, 0)} rows`)
      console.log(`Imported content published: ${publish ? 'yes' : 'no'}`)
      console.log(`Foreign keys verified: ${verifiedForeignKeys}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }
} finally {
  sqlite.close()
  await client.end()
}
