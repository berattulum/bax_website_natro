import { connection } from 'next/server'
import { CapabilitiesPageClient } from '@/components/capabilities/CapabilitiesPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function CapabilitiesPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <CapabilitiesPageClient locales={{ tr, en }} />
}
