import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

export async function script() {
  const payload = await getPayload({ config })
  for (const slug of ['founder-page', 'corporate-information-page', 'sustainability-page'] as const) {
    const page = await payload.findGlobal({ slug, depth: 0, draft: false })
    process.stdout.write(`${slug}: TR=${Boolean(page.contentTr)} EN=${Boolean(page.contentEn)} STATUS=${page._status}\n`)
  }
}

await script()
