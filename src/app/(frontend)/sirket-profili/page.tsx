import { connection } from 'next/server'
import { CompanyProfileClient } from '@/components/corporate/CompanyProfileClient'
import { companyProfileCopy } from '@/lib/cms/company-profile-defaults'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export default async function CompanyProfilePage() {
  await connection()
  const page = await getManagedGlobal('company-profile-page').catch(() => null)
  return (
    <CompanyProfileClient
      content={{
        tr: (page?.contentTr || companyProfileCopy.tr) as typeof companyProfileCopy.tr,
        en: (page?.contentEn || companyProfileCopy.en) as typeof companyProfileCopy.en,
      }}
    />
  )
}
