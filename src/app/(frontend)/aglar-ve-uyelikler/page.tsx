import { connection } from 'next/server'
import EcosystemPageClient from '@/components/ecosystem/EcosystemPageClient'
import { ecosystemPageCopy } from '@/lib/cms/ecosystem-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'
import { coalesceManagedContent, getManagedGlobal } from '@/lib/cms/get-managed-pages'

export default async function NetworksPage() {
  await connection()
  const [{ tr, en }, page] = await Promise.all([
    getHomeData(),
    getManagedGlobal('ecosystem-page').catch(() => null),
  ])
  return (
    <EcosystemPageClient
      locales={{ tr, en }}
      kind="networks"
      content={{
        tr: coalesceManagedContent(page?.contentTr, ecosystemPageCopy.tr),
        en: coalesceManagedContent(page?.contentEn, ecosystemPageCopy.en),
      }}
    />
  )
}
