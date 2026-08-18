import { createHash } from 'node:crypto'
import { chown, copyFile, mkdir, open, readdir, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'

const command = process.argv[2]
const apply = process.argv.includes('--apply')
const sourceDirectory = path.resolve(process.env.MEDIA_SOURCE_DIR || 'media')
const mediaDirectory = path.resolve(process.env.MEDIA_DIR || 'media')
const expectedFiles = process.env.MEDIA_EXPECTED_FILES ? Number(process.env.MEDIA_EXPECTED_FILES) : null
const expectedHash = process.env.MEDIA_EXPECTED_SHA256?.toLowerCase() || null
const ownerUID = process.env.MEDIA_OWNER_UID ? Number(process.env.MEDIA_OWNER_UID) : null
const ownerGID = process.env.MEDIA_OWNER_GID ? Number(process.env.MEDIA_OWNER_GID) : null

const sha256 = async (filename) => {
  const handle = await open(filename, 'r')
  const hash = createHash('sha256')
  try {
    for await (const chunk of handle.readableWebStream()) hash.update(Buffer.from(chunk))
  } finally {
    await handle.close()
  }
  return hash.digest('hex')
}

const listFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, 'en'))) {
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not allowed: ${path.join(directory, entry.name)}`)
    if (!entry.isFile()) continue
    const filename = path.join(directory, entry.name)
    const details = await stat(filename)
    files.push({ name: entry.name, size: details.size, hash: await sha256(filename) })
  }
  return files
}

const inventoryHash = (files) => createHash('sha256')
  .update(files.map((file) => `${file.name}\t${file.size}\t${file.hash}`).join('\n'))
  .digest('hex')

const verifyExpectedInventory = (files, label) => {
  const hash = inventoryHash(files)
  if (expectedFiles !== null && (!Number.isSafeInteger(expectedFiles) || expectedFiles < 0)) {
    throw new Error('MEDIA_EXPECTED_FILES must be a non-negative integer.')
  }
  if (expectedFiles !== null && files.length !== expectedFiles) {
    throw new Error(`${label} file count does not match MEDIA_EXPECTED_FILES (${files.length} != ${expectedFiles}).`)
  }
  if (expectedHash && !/^[a-f0-9]{64}$/.test(expectedHash)) {
    throw new Error('MEDIA_EXPECTED_SHA256 must be a 64-character SHA-256 value.')
  }
  if (expectedHash && hash !== expectedHash) {
    throw new Error(`${label} inventory SHA-256 does not match MEDIA_EXPECTED_SHA256 (${hash} != ${expectedHash}).`)
  }
  return hash
}

async function importMedia() {
  if (sourceDirectory === mediaDirectory) throw new Error('Source and target media directories must be different.')
  if ((ownerUID === null) !== (ownerGID === null)) {
    throw new Error('MEDIA_OWNER_UID and MEDIA_OWNER_GID must be configured together.')
  }
  if (ownerUID !== null && (!Number.isSafeInteger(ownerUID) || ownerUID < 0 || !Number.isSafeInteger(ownerGID) || ownerGID < 0)) {
    throw new Error('MEDIA_OWNER_UID and MEDIA_OWNER_GID must be non-negative integers.')
  }
  await mkdir(mediaDirectory, { recursive: true })
  const sourceFiles = await listFiles(sourceDirectory)
  const sourceHash = verifyExpectedInventory(sourceFiles, 'Source')
  const targetFiles = await listFiles(mediaDirectory)
  const targetByName = new Map(targetFiles.map((file) => [file.name, file]))
  const conflicts = sourceFiles.filter((file) => targetByName.has(file.name) && targetByName.get(file.name).hash !== file.hash)
  const additions = sourceFiles.filter((file) => !targetByName.has(file.name))
  const unchanged = sourceFiles.length - additions.length - conflicts.length

  console.log(`Source: ${sourceDirectory}`)
  console.log(`Target: ${mediaDirectory}`)
  console.log(`Source files: ${sourceFiles.length}`)
  console.log(`Source inventory SHA-256: ${sourceHash}`)
  console.log(`Unchanged: ${unchanged}`)
  console.log(`New files: ${additions.length}`)
  console.log(`Conflicts: ${conflicts.length}`)

  if (conflicts.length) {
    throw new Error(`Import stopped; different content already exists for: ${conflicts.map((file) => file.name).join(', ')}`)
  }
  if (!apply) {
    console.log('Dry run complete. Re-run with --apply to copy new files.')
    return
  }

  for (const file of additions) {
    const source = path.join(sourceDirectory, file.name)
    const target = path.join(mediaDirectory, file.name)
    const temporary = `${target}.bax-import-${process.pid}`
    try {
      await copyFile(source, temporary, 1)
      if (await sha256(temporary) !== file.hash) throw new Error(`Checksum mismatch while copying ${file.name}`)
      await rename(temporary, target)
      if (ownerUID !== null && ownerGID !== null) {
        await chown(target, ownerUID, ownerGID)
      }
    } finally {
      await rm(temporary, { force: true })
    }
  }

  const verifiedFiles = await listFiles(mediaDirectory)
  const verifiedByName = new Map(verifiedFiles.map((file) => [file.name, file]))
  const failed = sourceFiles.filter((file) => verifiedByName.get(file.name)?.hash !== file.hash)
  if (failed.length) throw new Error(`Post-import verification failed: ${failed.map((file) => file.name).join(', ')}`)
  console.log(`Import verified: ${sourceFiles.length} source files are present with matching SHA-256 checksums.`)
}

async function auditMedia() {
  const { default: pg } = await import('pg')
  const databaseURL = process.env.DATABASE_URL
  if (!databaseURL?.startsWith('postgres')) throw new Error('DATABASE_URL must point to PostgreSQL.')

  const files = await listFiles(mediaDirectory)
  const filesByName = new Map(files.map((file) => [file.name, file]))
  const client = new pg.Client({ connectionString: databaseURL })
  await client.connect()
  try {
    const result = await client.query('SELECT filename FROM media WHERE filename IS NOT NULL ORDER BY filename')
    const filenames = result.rows.map(({ filename }) => String(filename))
    const unsafe = filenames.filter((filename) => path.basename(filename) !== filename)
    if (unsafe.length) throw new Error(`Unsafe media filenames in database: ${unsafe.join(', ')}`)
    const missing = filenames.filter((filename) => !filesByName.has(filename))
    const referenced = new Set(filenames)
    const unreferenced = files.filter((file) => !referenced.has(file.name))
    const bytes = files.reduce((total, file) => total + file.size, 0)
    const hash = verifyExpectedInventory(files, 'Volume')

    console.log(`Database media records: ${filenames.length}`)
    console.log(`Volume files: ${files.length}`)
    console.log(`Volume bytes: ${bytes}`)
    console.log(`Missing referenced files: ${missing.length}`)
    console.log(`Unreferenced files retained: ${unreferenced.length}`)
    console.log(`Inventory SHA-256: ${hash}`)
    if (missing.length) throw new Error(`Missing files referenced by PostgreSQL: ${missing.join(', ')}`)
    console.log('Media audit passed: every PostgreSQL media record has a file in persistent storage.')
  } finally {
    await client.end()
  }
}

async function inventoryMedia() {
  const files = await listFiles(sourceDirectory)
  const hash = verifyExpectedInventory(files, 'Source')
  const bytes = files.reduce((total, file) => total + file.size, 0)
  console.log(`Media source: ${sourceDirectory}`)
  console.log(`Media files: ${files.length}`)
  console.log(`Media bytes: ${bytes}`)
  console.log(`Media inventory SHA-256: ${hash}`)
  console.log('Media inventory passed.')
}

if (command === 'import') await importMedia()
else if (command === 'audit') await auditMedia()
else if (command === 'inventory') await inventoryMedia()
else throw new Error('Usage: media-volume.mjs <import|audit|inventory> [--apply]')
