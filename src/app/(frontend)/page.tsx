import { connection } from 'next/server'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'

import DraftModeControls from '@/components/DraftModeControls'
import SiteClient from '@/components/SiteClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getHomeData()
  const title = tr.seo?.title || 'BaX Composites | Geleceği Şekillendiriyoruz'
  const description = tr.seo?.description || 'Havacılık ve otomotiv için ileri kompozit mühendisliği, analiz, kalifikasyon ve endüstrileştirme çözümleri.'

  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      siteName: 'BaX Composites',
      title,
      description,
      url: '/',
      images: [{ url: '/assets/aircraft-hero-poster.webp', width: 1280, height: 720, alt: 'BaX Composites ileri kompozit mühendisliği' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/aircraft-hero-poster.webp'],
    },
  }
}

export default async function HomePage() {
  // Railway's private Postgres hostname only resolves inside a running service,
  // not in the isolated build environment. Defer the first CMS read to request
  // time; getHomeData still persists the result in Next's tagged data cache.
  await connection()

  const { isEnabled: isDraftMode } = await draftMode()
  const { tr, en } = await getHomeData({ includeDrafts: isDraftMode })

  return (
    <>
      <SiteClient locales={{ tr, en }} />
      {isDraftMode && <DraftModeControls />}
    </>
  )
}
