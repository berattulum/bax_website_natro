import { connection } from 'next/server'
import type { Metadata } from 'next'

import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Networks and Memberships | BaX Composites',
  description: 'BaX Composites connections across professional networks industry organisations and international research programmes',
  alternates: { canonical: '/aglar-ve-uyelikler' },
}

export default async function NetworksPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <EcosystemPageClient locales={{ tr, en }} kind="networks" />
}
