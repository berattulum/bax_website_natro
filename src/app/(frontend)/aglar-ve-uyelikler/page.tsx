import { connection } from 'next/server'
import type { Metadata } from 'next'

import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Ağlar ve Üyelikler | BaX Composites',
  description: 'BaX Composites’in sektörel ağlar, meslek kuruluşları, ihracat birlikleri ve uluslararası Ar-Ge programlarındaki bağlantılarını inceleyin.',
}

export default async function NetworksPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <EcosystemPageClient locales={{ tr, en }} kind="networks" />
}
