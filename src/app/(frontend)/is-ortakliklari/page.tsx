import { connection } from 'next/server'

import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function PartnershipsPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <EcosystemPageClient locales={{ tr, en }} kind="partnerships" />
}
