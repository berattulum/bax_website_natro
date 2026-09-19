import { connection } from 'next/server'
import { draftMode } from 'next/headers'
import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { getEcosystemPageCopy } from '@/lib/cms/get-ecosystem-page'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function PartnershipsPage() {
  await connection()
  const { isEnabled: isDraftMode } = await draftMode()
  const [{ tr, en }, content] = await Promise.all([
    getHomeData({ includeDrafts: isDraftMode }),
    getEcosystemPageCopy({ includeDrafts: isDraftMode }),
  ])
  return (
    <EcosystemPageClient locales={{ tr, en }} kind="partnerships" content={content} />
  )
}
