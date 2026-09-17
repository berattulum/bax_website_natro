#!/usr/bin/env node
/**
 * One-shot helper: inventory local media/ folder for Cloudflare R2 upload planning.
 * Does not upload — prints a checklist. Use rclone/aws cli/wrangler for the actual sync
 * as documented in docs/vercel-deploy.md.
 *
 * Usage: node scripts/media-r2-inventory.mjs [mediaDir]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const mediaDir = path.resolve(process.argv[2] || 'media')

async function walk(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full, base))
    else if (entry.isFile()) files.push(full)
  }
  return files
}

async function sha256(filePath) {
  const hash = crypto.createHash('sha256')
  const data = await fs.readFile(filePath)
  hash.update(data)
  return hash.digest('hex')
}

const exists = await fs.stat(mediaDir).then(() => true).catch(() => false)
if (!exists) {
  console.error(`Media directory not found: ${mediaDir}`)
  console.error('Place CMS media files under ./media or pass a path argument.')
  process.exit(1)
}

const files = await walk(mediaDir)
let totalBytes = 0
const rows = []
for (const file of files) {
  const stat = await fs.stat(file)
  totalBytes += stat.size
  const rel = path.relative(mediaDir, file).split(path.sep).join('/')
  rows.push({ key: `media/${rel}`, bytes: stat.size, sha256: await sha256(file) })
}

rows.sort((a, b) => a.key.localeCompare(b.key))
console.log(JSON.stringify({
  mediaDir,
  fileCount: rows.length,
  totalBytes,
  totalMiB: Number((totalBytes / (1024 * 1024)).toFixed(2)),
  r2Prefix: 'media/',
  files: rows,
}, null, 2))
console.error(`\nInventory complete: ${rows.length} files, ${(totalBytes / (1024 * 1024)).toFixed(2)} MiB`)
console.error('Upload with: rclone copy ./media r2:BUCKET/media --checksum')
console.error('Or: aws s3 sync ./media s3://BUCKET/media --endpoint-url $S3_ENDPOINT')
