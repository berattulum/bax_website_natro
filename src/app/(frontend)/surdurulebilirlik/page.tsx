import { SustainabilityClient, sustainabilityCopy } from '@/components/sustainability/SustainabilityClient'
import { coalesceManagedContent, getManagedGlobal } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export default async function SustainabilityPage() {
  const page = await getManagedGlobal('sustainability-page').catch(() => ({}))
  return (
    <SustainabilityClient
      content={{
        tr: coalesceManagedContent(page.contentTr, sustainabilityCopy.tr, 'heroKicker'),
        en: coalesceManagedContent(page.contentEn, sustainabilityCopy.en, 'heroKicker'),
      }}
    />
  )
}
