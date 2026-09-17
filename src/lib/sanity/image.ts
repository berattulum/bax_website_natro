import imageUrlBuilder from '@sanity/image-url'

import { getSanityClient, isSanityConfigured } from './client'

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source || !isSanityConfigured()) return ''
  const client = getSanityClient()
  if (!client) return ''
  try {
    return imageUrlBuilder(client).image(source).auto('format').url()
  } catch {
    return ''
  }
}

export function resolveLogo(item: { logoUrl?: string | null; logo?: unknown } | null | undefined) {
  if (!item) return ''
  if (typeof item.logoUrl === 'string' && item.logoUrl.trim()) return item.logoUrl.trim()
  return urlForImage(item.logo as SanityImageSource | null | undefined)
}
