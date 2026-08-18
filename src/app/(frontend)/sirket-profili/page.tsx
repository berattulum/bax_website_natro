import type { Metadata } from 'next'
import { connection } from 'next/server'
import { CompanyProfileClient } from '@/components/corporate/CompanyProfileClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Company Profile | BaX Composites',
  description: 'BaX Composites company profile advanced composite engineering manufacturing approach and aerospace heritage',
  alternates: { canonical: '/sirket-profili' },
}

export default async function CompanyProfilePage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <CompanyProfileClient locales={{ tr, en }} />
}
