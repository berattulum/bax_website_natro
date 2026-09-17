import { connection } from 'next/server'
import { CapabilitiesPageClient } from '@/components/capabilities/CapabilitiesPageClient'
import { capabilitiesPageCopy } from '@/lib/cms/capabilities-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'
import { coalesceManagedContent, getManagedGlobal } from '@/lib/cms/get-managed-pages'

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
        tr: coalesceManagedContent(page?.contentTr, capabilitiesPageCopy.tr),
        en: coalesceManagedContent(page?.contentEn, capabilitiesPageCopy.en),
      }}
    />
  )
}
