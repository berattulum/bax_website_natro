import { unstable_cache } from 'next/cache'

import { CACHE_TAGS } from '@/lib/cache/tags'
import { ecosystemPageCopy, type EcosystemChrome } from '@/lib/cms/ecosystem-page-defaults'
import { getSanityClient, isSanityConfigured } from '@/lib/sanity/client'

type LocalePair = { tr?: string; en?: string } | string | null | undefined

type SanityChromeBlock = {
  eyebrow?: LocalePair
  lead?: LocalePair
  title?: LocalePair
  description?: LocalePair
  index?: LocalePair
  next?: LocalePair
  nextText?: LocalePair
  explore?: LocalePair
}

type SanityEcosystemPage = {
  partnerships?: SanityChromeBlock
  networks?: SanityChromeBlock
} | null

function pick(value: LocalePair, locale: 'tr' | 'en', fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value
  if (value && typeof value === 'object') {
    const picked = value[locale]
    if (typeof picked === 'string' && picked.trim()) return picked
  }
  return fallback
}

function mapBlock(block: SanityChromeBlock | undefined, locale: 'tr' | 'en', fallback: EcosystemChrome['partnerships']) {
  return {
    eyebrow: pick(block?.eyebrow, locale, fallback.eyebrow),
    lead: pick(block?.lead, locale, fallback.lead),
    title: pick(block?.title, locale, fallback.title),
    description: pick(block?.description, locale, fallback.description),
    index: pick(block?.index, locale, fallback.index),
    next: pick(block?.next, locale, fallback.next),
    nextText: pick(block?.nextText, locale, fallback.nextText),
    explore: pick(block?.explore, locale, fallback.explore),
  }
}

function mapPage(doc: SanityEcosystemPage): Record<'tr' | 'en', EcosystemChrome> {
  return {
    tr: {
      partnerships: mapBlock(doc?.partnerships, 'tr', ecosystemPageCopy.tr.partnerships),
      networks: mapBlock(doc?.networks, 'tr', ecosystemPageCopy.tr.networks),
    },
    en: {
      partnerships: mapBlock(doc?.partnerships, 'en', ecosystemPageCopy.en.partnerships),
      networks: mapBlock(doc?.networks, 'en', ecosystemPageCopy.en.networks),
    },
  }
}

async function fetchEcosystemPage(includeDrafts: boolean) {
  if (!isSanityConfigured()) return ecosystemPageCopy

  const client = getSanityClient({ preview: includeDrafts })
  if (!client) return ecosystemPageCopy

  const doc = await client.fetch<SanityEcosystemPage>(
    `*[_type == "ecosystemPage" && _id == "ecosystemPage"][0]{ partnerships, networks }`,
  )

  if (!doc?.partnerships && !doc?.networks) return ecosystemPageCopy
  return mapPage(doc)
}

const getPublishedEcosystemPage = unstable_cache(() => fetchEcosystemPage(false), ['bax-ecosystem-page-v1'], {
  tags: [CACHE_TAGS.references, CACHE_TAGS.memberships, CACHE_TAGS.home],
  revalidate: 86_400,
})

export async function getEcosystemPageCopy({ includeDrafts = false } = {}) {
  return includeDrafts ? fetchEcosystemPage(true) : getPublishedEcosystemPage()
}
