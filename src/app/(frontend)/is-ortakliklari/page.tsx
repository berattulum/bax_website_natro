import { connection } from 'next/server'
import type { Metadata } from 'next'

import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'İş Ortaklıkları | BaX Composites',
  description: 'BaX Composites’in tasarım, malzeme teknolojileri ve ileri üretim alanlarındaki stratejik iş ortaklarını keşfedin.',
}

export default async function PartnershipsPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <EcosystemPageClient locales={{ tr, en }} kind="partnerships" />
}
