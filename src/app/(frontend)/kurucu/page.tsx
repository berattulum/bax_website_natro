import { FounderClient, founderCopy } from '@/components/corporate/FounderClient'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export default async function FounderPage() {
  const page = await getManagedGlobal('founder-page')
  return <FounderClient content={{ tr: (page.contentTr || founderCopy.tr) as typeof founderCopy.tr, en: (page.contentEn || founderCopy.en) as typeof founderCopy.en }} />
}
