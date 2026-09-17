import { unstable_cache } from 'next/cache'

import type { ManagedLocale, SectionKey } from '@/components/ManagedSections'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { i18n } from '@/lib/cms/i18n'
import { DEFAULT_SITE_SETTINGS, type SiteUISettings } from '@/lib/cms/site-settings-defaults'
import { getSanityClient, isSanityConfigured } from '@/lib/sanity/client'
import { resolveLogo } from '@/lib/sanity/image'
import { listsQuery } from '@/lib/sanity/queries'

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

const defaultExpertise = [
  {
    order: 1,
    title: { tr: 'Kompozit Mühendislik', en: 'Composite Engineering' },
    description: {
      tr: 'Yapısal tasarım, malzeme seçimi ve proses mühendisliği',
      en: 'Structural design, material selection and process engineering',
    },
  },
  {
    order: 2,
    title: { tr: 'RTM & Proses', en: 'RTM & Process' },
    description: {
      tr: 'Kontrollü enjeksiyon ve tekrarlanabilir üretim',
      en: 'Controlled injection and repeatable manufacturing',
    },
  },
  {
    order: 3,
    title: { tr: 'Test & Doğrulama', en: 'Test & Verification' },
    description: {
      tr: 'Yapısal test ve ölçülebilir kalite kanıtı',
      en: 'Structural testing and measurable quality evidence',
    },
  },
]

type LocaleString = string | { tr?: string; en?: string } | null | undefined

function pickLocale(value: LocaleString, locale: 'tr' | 'en'): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const picked = value[locale]
    return typeof picked === 'string' ? picked : ''
  }
  return ''
}

function uiFromJson(locale: 'tr' | 'en'): SiteUISettings {
  // JSON already matches SiteUISettings (arrays for hero/narratives/process).
  return (i18n.siteSettings as Record<'tr' | 'en', SiteUISettings>)[locale] || DEFAULT_SITE_SETTINGS[locale]
}

function buildLocale(
  locale: 'tr' | 'en',
  expertise: Array<Record<string, unknown>>,
  partners: Array<Record<string, unknown>>,
  memberships: Array<Record<string, unknown>>,
): ManagedLocale {
  const dictionary = (i18n.siteContent as Record<'tr' | 'en', Record<string, string>>)[locale] || {}
  const ui = uiFromJson(locale) || DEFAULT_SITE_SETTINGS[locale]

  return {
    dictionary,
    seo: {
      title: dictionary.seoTitle || '',
      description: dictionary.seoDescription || '',
    },
    ui,
    sectionLayout: defaultSectionLayout,
    expertise: expertise.map((item) => ({
      order: Number(item.order) || 0,
      title: pickLocale(item.title as LocaleString, locale),
      description: pickLocale(item.description as LocaleString, locale),
    })),
    partners:
      partners.length > 0
        ? partners.map((item) => ({
            name: String(item.name || ''),
            caption: pickLocale(item.caption as LocaleString, locale) || String(item.name || ''),
            website: String(item.website || ''),
            logo: resolveLogo(item as { logoUrl?: string; logo?: unknown }),
          }))
        : defaultPartners,
    memberships: (
      memberships.length > 0
        ? memberships.map((item) => ({
            name: String(item.name || ''),
            category: pickLocale(item.category as LocaleString, locale),
            website: String(item.website || ''),
            logo: resolveLogo(item as { logoUrl?: string; logo?: unknown }),
            darkCard: Boolean(item.darkCard),
          }))
        : defaultMemberships.map((item) => ({
            name: item.name,
            category: locale === 'tr' ? item.categoryTr : item.categoryEn,
            website: item.website,
            logo: item.logo,
            darkCard: item.darkCard,
          }))
    ).filter((item) => item.name.trim().toLowerCase() !== 'composites united'),
  }
}

async function fetchLists(includeDrafts: boolean) {
  if (!isSanityConfigured()) {
    return {
      expertise: defaultExpertise as unknown as Array<Record<string, unknown>>,
      partners: [] as Array<Record<string, unknown>>,
      memberships: [] as Array<Record<string, unknown>>,
    }
  }

  const client = getSanityClient({ preview: includeDrafts })
  if (!client) {
    return {
      expertise: defaultExpertise as unknown as Array<Record<string, unknown>>,
      partners: [] as Array<Record<string, unknown>>,
      memberships: [] as Array<Record<string, unknown>>,
    }
  }

  const data = await client.fetch<{
    expertise: Array<Record<string, unknown>>
    partners: Array<Record<string, unknown>>
    memberships: Array<Record<string, unknown>>
  }>(listsQuery)

  return {
    expertise: data.expertise?.length ? data.expertise : (defaultExpertise as unknown as Array<Record<string, unknown>>),
    partners: data.partners || [],
    memberships: data.memberships || [],
  }
}

async function queryHomeData(includeDrafts: boolean) {
  const lists = await fetchLists(includeDrafts)
  return {
    tr: buildLocale('tr', lists.expertise, lists.partners, lists.memberships),
    en: buildLocale('en', lists.expertise, lists.partners, lists.memberships),
  }
}

const getPublishedHomeData = unstable_cache(() => queryHomeData(false), ['bax-home-data-v6'], {
  tags: Object.values(CACHE_TAGS),
  revalidate: 86_400,
})

export async function getHomeData({ includeDrafts = false } = {}) {
  return includeDrafts ? queryHomeData(true) : getPublishedHomeData()
}
