import type { Metadata } from 'next'
import { connection } from 'next/server'
import { ExpertisePageClient } from '@/components/expertise/ExpertisePageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Expertise | BaX Composites',
  description: 'BaX Composites engineering capabilities from design and analysis to serial production',
}

export default async function ExpertisePage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <ExpertisePageClient locales={{ tr, en }} />
}
