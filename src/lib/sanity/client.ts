import { createClient } from 'next-sanity'

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export function isSanityConfigured() {
  return Boolean(sanityProjectId && sanityProjectId !== 'placeholder')
}

export function getSanityClient({ preview = false } = {}) {
  if (!isSanityConfigured()) return null

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: !preview,
    token: preview ? process.env.SANITY_API_READ_TOKEN : undefined,
    perspective: preview ? 'previewDrafts' : 'published',
    stega: false,
  })
}
