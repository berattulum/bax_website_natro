import { connection } from 'next/server'
import { draftMode } from 'next/headers'
import { CapabilitiesPageClient } from '@/components/capabilities/CapabilitiesPageClient'
import { capabilitiesPageCopy } from '@/lib/cms/capabilities-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function CapabilitiesPage() {
  await connection()
  const { isEnabled: isDraftMode } = await draftMode()
  const { tr, en } = await getHomeData({ includeDrafts: isDraftMode })
  return <CapabilitiesPageClient locales={{ tr, en }} content={capabilitiesPageCopy} />
}
