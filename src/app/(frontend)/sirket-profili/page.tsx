import type { Metadata } from 'next'
import { connection } from 'next/server'
import { CompanyProfileClient } from '@/components/corporate/CompanyProfileClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Şirket Profili | BaX Composites',
  description: 'BaX Composites’in ileri kompozit mühendisliği, üretim yaklaşımı ve kurumsal profili.',
}

export default async function CompanyProfilePage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <CompanyProfileClient locales={{ tr, en }} />
}
