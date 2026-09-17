import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const slugs = [
  'founder-page',
  'corporate-information-page',
  'sustainability-page',
  'company-profile-page',
  'home-page',
  'capabilities-page',
  'ecosystem-page',
  'contact-page',
] as const

export async function script() {
  const payload = await getPayload({ config })
  let missing = 0
  for (const slug of slugs) {
    const page = await payload.findGlobal({ slug, depth: 0, draft: false })
    const ok = Boolean(page.contentTr) && Boolean(page.contentEn)
    if (!ok) missing += 1
    process.stdout.write(`${slug}: TR=${Boolean(page.contentTr)} EN=${Boolean(page.contentEn)} STATUS=${page._status}\n`)
  }
  if (missing > 0) {
    process.stderr.write(`Eksik yönetilen sayfa içeriği: ${missing}\n`)
    process.exitCode = 1
  }
}

await script()
