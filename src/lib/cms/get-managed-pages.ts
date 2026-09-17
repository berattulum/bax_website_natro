import { getPayload } from 'payload'
import config from '@payload-config'
import type { CorporateInformationPage, FounderPage, SustainabilityPage } from '@/payload-types'

export function getManagedGlobal(slug: 'founder-page'): Promise<FounderPage>
export function getManagedGlobal(slug: 'corporate-information-page'): Promise<CorporateInformationPage>
export function getManagedGlobal(slug: 'sustainability-page'): Promise<SustainabilityPage>
export async function getManagedGlobal(slug: 'founder-page' | 'corporate-information-page' | 'sustainability-page') {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug, depth: 1, draft: false })
}
