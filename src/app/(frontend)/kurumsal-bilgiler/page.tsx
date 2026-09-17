import { CorporateInformationClient, corporateInformationCopy, corporateInformationOffices, corporateInformationRecords } from '@/components/corporate/CorporateInformationClient'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export default async function CorporateInformationPage() {
  const page = await getManagedGlobal('corporate-information-page')
  return <CorporateInformationClient content={{ tr: (page.contentTr || corporateInformationCopy.tr) as typeof corporateInformationCopy.tr, en: (page.contentEn || corporateInformationCopy.en) as typeof corporateInformationCopy.en }} records={(page.records || corporateInformationRecords) as Array<[string, string, string]>} offices={(page.offices || corporateInformationOffices) as typeof corporateInformationOffices} />
}
