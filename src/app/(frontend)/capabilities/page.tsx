import type { Metadata } from 'next'
import { connection } from 'next/server'
import { CapabilitiesPageClient } from '@/components/capabilities/CapabilitiesPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Capabilities | BaX Composites',
  description: 'BaX Composites engineering capabilities from design and analysis to serial production',
  alternates: { canonical: '/capabilities' },
}

export default async function CapabilitiesPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <CapabilitiesPageClient locales={{ tr, en }} />
}
