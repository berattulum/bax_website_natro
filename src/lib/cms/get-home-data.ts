import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { ManagedLocale, SectionKey } from '@/components/ManagedSections'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { normalizeSiteSettings } from '@/lib/cms/site-settings-defaults'

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

const defaultPartners = [
  ['CTC', 'CTC · an Airbus company', 'https://ctc-composites.com/', '/logos/ctc.png'],
  ['CTRM', 'CTRM · DRB-HICOM', 'https://www.ctrm.com.my/', '/logos/ctrm.png'],
  ['Kale', 'Kale', 'https://www.kale.com.tr/', '/logos/kale.png'],
  ['Toray', 'Toray', 'https://www.toray.com/', '/logos/toray.png'],
  ['Ecoplas', 'Ecoplas', 'https://www.ecoplas.com.tr/', '/logos/ecoplas.png'],
  ['FEV', 'FEV', 'https://www.fev.com/', '/logos/fev.png'],
  ['Rimac', 'Rimac Automobili', 'https://www.rimac-automobili.com/', '/logos/rimac.png'],
  ['MAN', 'MAN', 'https://www.man.eu/', '/logos/man.png'],
  ['Lightyear', 'Lightyear', 'https://lightyear.one/', '/logos/lightyear.png'],
  ['LIST Luxembourg', 'LIST Luxembourg', 'https://www.list.lu/', '/logos/list.png'],
  ['9T Labs', '9T Labs', 'https://www.9tlabs.com/', '/logos/9t-labs.png'],
  ['EURO-COMPOSITES', 'EURO-COMPOSITES', 'https://www.euro-composites.com/en/', '/logos/euro-composites.png'],
  ['SPIRAL RTC', 'SPIRAL RTC', 'https://spiralrtc.com/', '/logos/spiral-rtc.png'],
  ['TPRC', 'TPRC', 'https://tprc.nl/', '/logos/tprc.svg'],
  ['TPAC', 'TPAC', 'https://thermoplasticcomposites.nl/', '/logos/tpac.jpg'],
  ['Addcomposites', 'Addcomposites', 'https://www.addcomposites.com/', '/logos/addcomposites.png'],
].map(([name, caption, website, logo]) => ({ name, caption, website, logo }))

const defaultMemberships = [
  ['M-ERA.NET', 'AR-GE AĞI', 'R&D NETWORK', 'https://www.m-era.net/', '/logos/memberships/m-era-net.png', false],
  ['TÜBİTAK', 'ARAŞTIRMA KURUMU', 'RESEARCH INSTITUTION', 'https://tubitak.gov.tr/', '/logos/memberships/tubitak.svg', false],
  ['TOBB', 'MESLEK ÜST KURULUŞU', 'BUSINESS ORGANIZATION', 'https://www.tobb.org.tr/', '/logos/memberships/tobb.jpg', false],
  ['İstanbul Ticaret Odası', 'TİCARET ODASI', 'CHAMBER OF COMMERCE', 'https://www.ito.org.tr/tr', '/logos/memberships/ito.png', false],
  ['KOSGEB', 'KOBİ DESTEK EKOSİSTEMİ', 'SME SUPPORT ECOSYSTEM', 'https://www.kosgeb.gov.tr/', '/logos/memberships/kosgeb.png', false],
  ['Türkiye İhracatçılar Meclisi', 'İHRACAT EKOSİSTEMİ', 'EXPORT ECOSYSTEM', 'https://tim.org.tr/', '/logos/memberships/tim.svg', false],
  ['SSI', 'SEKTÖR BİRLİĞİ', 'SECTOR ASSOCIATION', 'https://www.turksavunmasanayi.gov.tr/', '/logos/memberships/ssi.png', false],
  ['OAİB', 'İHRACATÇI BİRLİĞİ', 'EXPORTERS ASSOCIATION', 'https://oaib.org.tr/', '/logos/memberships/oaib.png', false],
  ['Eureka Network', 'İNOVASYON AĞI', 'INNOVATION NETWORK', 'https://www.eurekanetwork.org/', '/logos/memberships/eureka.svg', false],
].map(([name, categoryTr, categoryEn, website, logo, darkCard]) => ({
  name: name as string,
  categoryTr: categoryTr as string,
  categoryEn: categoryEn as string,
  website: website as string,
  logo: logo as string,
  darkCard: darkCard as boolean,
}))

function mediaUrl(media: unknown) {
  return typeof media === 'object' &&
    media &&
    'url' in media &&
    typeof media.url === 'string'
    ? media.url
    : ''
}

async function queryHomeData(includeDrafts: boolean) {
  const payload = await getPayload({ config })

  async function loadLocale(locale: 'tr' | 'en'): Promise<ManagedLocale> {
    const [content, settings, expertise, partners, memberships] = await Promise.all([
      payload.findGlobal({ slug: 'site-content', locale, depth: 0, draft: includeDrafts }),
      payload.findGlobal({ slug: 'site-settings', locale, depth: 0, draft: includeDrafts }),
      payload.find({
        collection: 'expertise-items',
        locale,
        sort: 'order',
        limit: 20,
        depth: 0,
        draft: includeDrafts,
        where: includeDrafts ? undefined : { _status: { equals: 'published' } },
      }),
      payload.find({
        collection: 'partners',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1,
        draft: includeDrafts,
        where: {
          and: includeDrafts
            ? [{ active: { equals: true } }]
            : [
                { active: { equals: true } },
                { _status: { equals: 'published' } },
              ],
        },
      }),
      payload.find({
        collection: 'memberships',
        locale,
        sort: 'order',
        limit: 100,
        depth: 1,
        draft: includeDrafts,
        where: {
          and: includeDrafts
            ? [{ active: { equals: true } }]
            : [
                { active: { equals: true } },
                { _status: { equals: 'published' } },
              ],
        },
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
      seo: {
        title: typeof content.seoTitle === 'string' ? content.seoTitle : '',
        description: typeof content.seoDescription === 'string' ? content.seoDescription : '',
      },
      ui: normalizeSiteSettings(settings, locale),
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
      partners: partners.docs.length > 0
        ? partners.docs.map((item) => ({
            name: item.name,
            caption: item.caption || item.name,
            website: item.website,
            logo: mediaUrl(item.logo),
          }))
        : defaultPartners,
      memberships: (memberships.docs.length > 0
        ? memberships.docs.map((item) => ({
            name: item.name,
            category: item.category,
            website: item.website,
            logo: mediaUrl(item.logo),
            darkCard: item.darkCard || false,
          }))
        : defaultMemberships.map((item) => ({
            name: item.name,
            category: locale === 'tr' ? item.categoryTr : item.categoryEn,
            website: item.website,
            logo: item.logo,
            darkCard: item.darkCard,
          }))).filter((item) => item.name.trim().toLowerCase() !== 'composites united'),
    }
  }

  const [tr, en] = await Promise.all([loadLocale('tr'), loadLocale('en')])
  return { tr, en }
}

const getPublishedHomeData = unstable_cache(() => queryHomeData(false), ['bax-home-data-v3'], {
  tags: Object.values(CACHE_TAGS),
  revalidate: 86_400,
})

export async function getHomeData({ includeDrafts = false } = {}) {
  // Draft responses are deliberately never stored in Next's shared data cache.
  // Only the public, published response uses tagged ISR.
  return includeDrafts ? queryHomeData(true) : getPublishedHomeData()
}
