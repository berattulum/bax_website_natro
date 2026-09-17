import { getPayload } from 'payload'
import config from '@payload-config'

export type ManagedPageDocument = {
  contentTr?: unknown
  contentEn?: unknown
  records?: unknown
  offices?: unknown
  _status?: 'draft' | 'published' | null
}

export type ManagedSlug =
  | 'founder-page'
  | 'corporate-information-page'
  | 'sustainability-page'
  | 'company-profile-page'
  | 'home-page'
  | 'capabilities-page'
  | 'ecosystem-page'
  | 'contact-page'

export async function getManagedGlobal(slug: ManagedSlug): Promise<ManagedPageDocument> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug, depth: 1, draft: false }) as Promise<ManagedPageDocument>
}
