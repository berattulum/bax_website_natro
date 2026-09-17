import { connection } from 'next/server'
import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { ecosystemPageCopy } from '@/lib/cms/ecosystem-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export default async function PartnershipsPage() {
  await connection()
  const [{ tr, en }, page] = await Promise.all([
    getHomeData(),
    getManagedGlobal('ecosystem-page').catch(() => null),
  ])
  return (
    <EcosystemPageClient
      locales={{ tr, en }}
      kind="partnerships"
      content={{
        tr: (page?.contentTr || ecosystemPageCopy.tr) as typeof ecosystemPageCopy.tr,
        en: (page?.contentEn || ecosystemPageCopy.en) as typeof ecosystemPageCopy.en,
      }}
    />
  )
}
