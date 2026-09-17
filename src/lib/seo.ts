import type { Metadata } from 'next'

import { localeFromPath, routeFromPath, type SiteLocale } from '@/lib/i18n/site-routes'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'
const defaultOgImage = '/images/bax-composites-logo-original.png'
const founderOgImage = '/assets/hakki-kizilok.jpeg'

const keywords = {
  en: [
    'BaX Composites',
    'advanced composites',
    'composite engineering',
    'RTM',
    'thermoplastics',
    'aerospace composites',
    'recycled carbon fibre',
    'industrialization',
  ],
  tr: [
    'BaX Composites',
    'ileri kompozit',
    'kompozit mühendisliği',
    'RTM',
    'termoplastik',
    'havacılık kompozitleri',
    'geri dönüştürülmüş karbon elyaf',
    'endüstrileştirme',
  ],
} as const

export function buildRouteMetadata(publicPath: string): Metadata {
  const locale: SiteLocale = localeFromPath(publicPath) || 'en'
  const matched = routeFromPath(publicPath)
  const route = matched?.[1]
  const routeKey = matched?.[0]
  const title = route?.title[locale] || (locale === 'tr'
    ? 'BaX Composites | İleri Kompozit Mühendisliği'
    : 'BaX Composites | Advanced Composite Engineering')
  const description = route?.description[locale] || (locale === 'tr'
    ? 'İleri kompozit mühendisliği, tasarım, doğrulama ve endüstrileştirme çözümleri.'
    : 'Advanced composite engineering, design, verification and industrialization solutions.')
  const canonical = publicPath.startsWith('/') ? publicPath : `/${publicPath}`
  const ogImage = routeKey === 'founder' ? founderOgImage : defaultOgImage
  const languages = route
    ? { en: route.paths.en, tr: route.paths.tr, 'x-default': route.paths.en }
    : { en: '/en', tr: '/tr', 'x-default': '/en' }

  return {
    metadataBase: new URL(siteURL),
    title,
    description,
    keywords: [...keywords[locale]],
    applicationName: 'BaX Composites',
    authors: [{ name: 'BaX Composites', url: siteURL }],
    creator: 'BaX Composites',
    publisher: 'BaX Composites',
    formatDetection: { email: false, address: false, telephone: false },
    icons: { icon: defaultOgImage, apple: defaultOgImage },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: routeKey === 'founder' ? 'profile' : 'website',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? ['en_US'] : ['tr_TR'],
      url: canonical,
      siteName: 'BaX Composites',
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: process.env.ALLOW_INDEXING === 'true',
      follow: process.env.ALLOW_INDEXING === 'true',
      googleBot: {
        index: process.env.ALLOW_INDEXING === 'true',
        follow: process.env.ALLOW_INDEXING === 'true',
      },
    },
    category: 'technology',
  }
}
