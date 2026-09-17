import {
  CorporateInformationClient,
  corporateInformationCopy,
  corporateInformationOffices,
  corporateInformationRecords,
} from '@/components/corporate/CorporateInformationClient'
import { coalesceManagedContent, getManagedGlobal, type ManagedPageDocument } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export default async function CorporateInformationPage() {
  const page: ManagedPageDocument = await getManagedGlobal('corporate-information-page').catch(
    (): ManagedPageDocument => ({}),
  )
  return (
    <CorporateInformationClient
      content={{
        tr: coalesceManagedContent(page.contentTr, corporateInformationCopy.tr, 'eyebrow'),
        en: coalesceManagedContent(page.contentEn, corporateInformationCopy.en, 'eyebrow'),
      }}
      records={coalesceManagedContent(page.records, corporateInformationRecords as unknown as Array<[string, string, string]>)}
      offices={coalesceManagedContent(page.offices, corporateInformationOffices)}
    />
  )
}
