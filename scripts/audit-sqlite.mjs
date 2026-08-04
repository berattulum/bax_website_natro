import { DatabaseSync } from 'node:sqlite'

for (const filename of process.argv.slice(2)) {
  const database = new DatabaseSync(filename, { readOnly: true })
  console.log(`DATABASE ${filename}`)

  const tables = database
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all()

  for (const { name } of tables) {
    const quotedName = `"${String(name).replaceAll('"', '""')}"`
    const { count } = database.prepare(`SELECT count(*) AS count FROM ${quotedName}`).get()
    console.log(`${name}\t${count}`)
  }

  database.close()
}
