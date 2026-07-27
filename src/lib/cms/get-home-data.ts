import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { ManagedLocale, SectionKey } from '@/components/ManagedSections'
import { CACHE_TAGS } from '@/lib/cache/tags'

const defaultSectionLayout: ManagedLocale['sectionLayout'] = [
  'about',
  'designNarrative',
  'expertise',
  'manufacturingNarrative',
  'process',
  'principles',
  'solutions',
  'partners',
  'memberships',
  'contact',
].map((section) => ({ section: section as SectionKey, enabled: true }))

function mediaUrl(media: unknown) {
  return typeof media === 'object' &&
    media &&
    'url' in media &&
    typeof media.url === 'string'
    ? media.url
    : ''
}

async function queryHomeData() {
  const payload = await getPayload({ config })

  async function loadLocale(locale: 'tr' | 'en'): Promise<ManagedLocale> {
    const [content, expertise, partners, memberships] = await Promise.all([
      payload.findGlobal({ slug: 'site-content', locale, depth: 0 }),
      payload.find({
        collection: 'expertise-items',
        locale,
        sort: 'order',
        limit: 20,
        depth: 0,
      }),
      payload.find({
        collection: 'partners',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1,
        where: { active: { equals: true } },
      }),
      payload.find({
        collection: 'memberships',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1,
        where: { active: { equals: true } },
      }),
    ])

    const dictionary = Object.fromEntries(
      [
        ['hero1Subtitle', content.heroEyebrow],
        ['hero1Title', content.heroTitle],
        ['hero1Description', content.heroDescription],
        ['aboutTitle', content.aboutTitle],
        ['aboutDescription', content.aboutDescription],
        ['aboutGoal', content.aboutGoal],
        ['visionTitle', content.visionTitle],
        ['visionText', content.visionText],
        ['missionTitle', content.missionTitle],
        ['missionText', content.missionText],
        ['valuesTitle', content.valuesTitle],
        ['valuesText', content.valuesText],
        ['referencesTitle', content.referencesTitle],
        ['referencesText', content.referencesText],
        ['membershipsTitle', content.membershipsTitle],
        ['membershipsText', content.membershipsText],
        ['processTitle', content.processTitle],
        ['contactTitle', content.contactTitle],
        ['contactText', content.contactText],
        ['email', content.email],
        ['phone', content.phone],
        ['headOffice', content.headOffice],
        ['branchOffice', content.branchOffice],
        ['footerText', content.footerText],
      ].filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === 'string' && entry[1].length > 0,
      ),
    )

    return {
      dictionary,
      sectionLayout:
        Array.isArray(content.sectionLayout) && content.sectionLayout.length > 0
          ? content.sectionLayout.map((item) => ({
              section: item.section as SectionKey,
              enabled: item.enabled !== false,
            }))
          : defaultSectionLayout,
      expertise: expertise.docs.map((item) => ({
        order: item.order,
        title: item.title,
        description: item.description,
      })),
      partners: partners.docs.map((item) => ({
        name: item.name,
        caption: item.caption || item.name,
        website: item.website,
        logo: mediaUrl(item.logo),
      })),
      memberships: memberships.docs.map((item) => ({
        name: item.name,
        category: item.category,
        website: item.website,
        logo: mediaUrl(item.logo),
        darkCard: item.darkCard || false,
      })),
    }
  }

  const [tr, en] = await Promise.all([loadLocale('tr'), loadLocale('en')])
  return { tr, en }
}

export const getHomeData = unstable_cache(queryHomeData, ['bax-home-data-v1'], {
  tags: Object.values(CACHE_TAGS),
  revalidate: 86_400,
})
