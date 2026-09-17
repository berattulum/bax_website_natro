import { FounderClient, founderCopy } from '@/components/corporate/FounderClient'
import { coalesceManagedContent, getManagedGlobal, type ManagedPageDocument } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export default async function FounderPage() {
  const page: ManagedPageDocument = await getManagedGlobal('founder-page').catch(
    (): ManagedPageDocument => ({}),
  )
  return (
    <FounderClient
      content={{
        tr: coalesceManagedContent(page.contentTr, founderCopy.tr, 'eyebrow'),
        en: coalesceManagedContent(page.contentEn, founderCopy.en, 'eyebrow'),
      }}
    />
  )
}
