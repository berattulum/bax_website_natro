import { connection } from 'next/server'
import { draftMode } from 'next/headers'

import DraftModeControls from '@/components/DraftModeControls'
import SiteClient from '@/components/SiteClient'
import { getHomeData } from '@/lib/cms/get-home-data'
import { i18n } from '@/lib/cms/i18n'
import type { HomeNarratives } from '@/lib/cms/home-narratives-defaults'

export default async function HomePage() {
  await connection()

  const { isEnabled: isDraftMode } = await draftMode()
  const { tr, en } = await getHomeData({ includeDrafts: isDraftMode })
  const narratives = i18n.homeNarratives as Record<'tr' | 'en', HomeNarratives>

  return (
    <>
      <SiteClient locales={{ tr, en }} narratives={narratives} />
      {isDraftMode && <DraftModeControls />}
    </>
  )
}
