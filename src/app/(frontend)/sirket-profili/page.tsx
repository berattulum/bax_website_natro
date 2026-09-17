import { connection } from 'next/server'
import { CompanyProfileClient } from '@/components/corporate/CompanyProfileClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function CompanyProfilePage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <CompanyProfileClient locales={{ tr, en }} />
}
