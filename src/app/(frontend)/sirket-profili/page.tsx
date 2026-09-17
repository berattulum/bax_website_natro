import { connection } from 'next/server'
import { CompanyProfileClient } from '@/components/corporate/CompanyProfileClient'
import { companyProfileCopy } from '@/lib/cms/company-profile-defaults'

export default async function CompanyProfilePage() {
  await connection()
  return <CompanyProfileClient content={companyProfileCopy} />
}
