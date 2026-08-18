import { connection } from 'next/server'
import type { Metadata } from 'next'

import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Business Partnerships | BaX Composites',
  description: 'Strategic BaX Composites partnerships across engineering material technologies research and advanced manufacturing',
  alternates: { canonical: '/is-ortakliklari' },
}

export default async function PartnershipsPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <EcosystemPageClient locales={{ tr, en }} kind="partnerships" />
}
