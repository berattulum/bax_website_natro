import { connection } from 'next/server'
import { draftMode } from 'next/headers'

import DraftModeControls from '@/components/DraftModeControls'
import SiteClient from '@/components/SiteClient'
import { getHomeData } from '@/lib/cms/get-home-data'
import { getManagedGlobal, coalesceManagedContent } from '@/lib/cms/get-managed-pages'
import { homeNarrativesCopy } from '@/lib/cms/home-narratives-defaults'

export default async function HomePage() {
  await connection()

  const { isEnabled: isDraftMode } = await draftMode()
  const [{ tr, en }, narrativesPage] = await Promise.all([
    getHomeData({ includeDrafts: isDraftMode }),
    getManagedGlobal('home-page').catch(() => null),
  ])

  return (
    <>
      <SiteClient
        locales={{ tr, en }}
        narratives={{
          tr: coalesceManagedContent(narrativesPage?.contentTr, homeNarrativesCopy.tr),
          en: coalesceManagedContent(narrativesPage?.contentEn, homeNarrativesCopy.en),
        }}
      />
      {isDraftMode && <DraftModeControls />}
    </>
  )
}
