import {
  CorporateInformationClient,
  corporateInformationCopy,
  corporateInformationOffices,
  corporateInformationRecords,
} from '@/components/corporate/CorporateInformationClient'
import { coalesceManagedContent, getManagedGlobal } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export default async function CorporateInformationPage() {
  const page = await getManagedGlobal('corporate-information-page').catch(() => ({}))
  return (
    <CorporateInformationClient
      content={{
        tr: coalesceManagedContent(page.contentTr, corporateInformationCopy.tr, 'eyebrow'),
        en: coalesceManagedContent(page.contentEn, corporateInformationCopy.en, 'eyebrow'),
      }}
      records={coalesceManagedContent(page.records, corporateInformationRecords) as Array<[string, string, string]>}
      offices={coalesceManagedContent(page.offices, corporateInformationOffices)}
    />
  )
}
