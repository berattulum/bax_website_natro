import { connection } from 'next/server'
import { CompanyProfileClient } from '@/components/corporate/CompanyProfileClient'
import { companyProfileCopy } from '@/lib/cms/company-profile-defaults'
import { coalesceManagedContent, getManagedGlobal } from '@/lib/cms/get-managed-pages'

export default async function CompanyProfilePage() {
  await connection()
  const page = await getManagedGlobal('company-profile-page').catch(() => null)
  return (
    <CompanyProfileClient
      content={{
        tr: coalesceManagedContent(page?.contentTr, companyProfileCopy.tr),
        en: coalesceManagedContent(page?.contentEn, companyProfileCopy.en),
      }}
    />
  )
}
