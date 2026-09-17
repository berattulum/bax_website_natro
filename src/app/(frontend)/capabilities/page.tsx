import { connection } from 'next/server'
import { CapabilitiesPageClient } from '@/components/capabilities/CapabilitiesPageClient'
import { capabilitiesPageCopy } from '@/lib/cms/capabilities-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export default async function CapabilitiesPage() {
  await connection()
  const [{ tr, en }, page] = await Promise.all([
    getHomeData(),
    getManagedGlobal('capabilities-page').catch(() => null),
  ])
  return (
    <CapabilitiesPageClient
      locales={{ tr, en }}
      content={{
        tr: (page?.contentTr || capabilitiesPageCopy.tr) as typeof capabilitiesPageCopy.tr,
        en: (page?.contentEn || capabilitiesPageCopy.en) as typeof capabilitiesPageCopy.en,
      }}
    />
  )
}
