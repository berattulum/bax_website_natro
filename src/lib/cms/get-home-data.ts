import { unstable_cache } from 'next/cache'

import type { ManagedLocale, SectionKey } from '@/components/ManagedSections'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { DEFAULT_SITE_SETTINGS, normalizeSiteSettings } from '@/lib/cms/site-settings-defaults'
import { getSanityClient, isSanityConfigured } from '@/lib/sanity/client'
import { resolveLogo } from '@/lib/sanity/image'
import { homeBundleQuery } from '@/lib/sanity/queries'

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

type LocaleString = string | { tr?: string; en?: string } | null | undefined

function pickLocale(value: LocaleString, locale: 'tr' | 'en'): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const picked = value[locale]
    return typeof picked === 'string' ? picked : ''
  }
  return ''
}

function parseJson<T>(value: unknown): T | null {
  if (value == null) return null
  if (typeof value === 'object') return value as T
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function buildLocale(
  locale: 'tr' | 'en',
  content: Record<string, unknown> | null,
  settingsDoc: Record<string, unknown> | null,
  expertise: Array<Record<string, unknown>>,
  partners: Array<Record<string, unknown>>,
  memberships: Array<Record<string, unknown>>,
): ManagedLocale {
  const contentSafe = content || {}
  const payloadSettings = parseJson<Record<string, unknown>>(
    (settingsDoc?.payload as { tr?: string; en?: string } | undefined)?.[locale],
  )
  const ui =
    payloadSettings && payloadSettings.navigation && payloadSettings.hero
      ? normalizeSiteSettings(
          {
            navigation: payloadSettings.navigation,
            hero: {
              ...((payloadSettings.hero as Record<string, unknown>) || {}),
              capabilities: (payloadSettings.hero as { capabilities?: string })?.capabilities,
              discuss: (payloadSettings.hero as { discuss?: string })?.discuss,
              slidesLabel: (payloadSettings.hero as { slidesLabel?: string })?.slidesLabel,
              slideLabel: (payloadSettings.hero as { slideLabel?: string })?.slideLabel,
              slide2Eyebrow: (payloadSettings.hero as { secondarySlides?: string[][] })?.secondarySlides?.[0]?.[0],
              slide2Title: (payloadSettings.hero as { secondarySlides?: string[][] })?.secondarySlides?.[0]?.[1],
              slide2Description: (payloadSettings.hero as { secondarySlides?: string[][] })?.secondarySlides?.[0]?.[2],
              slide3Eyebrow: (payloadSettings.hero as { secondarySlides?: string[][] })?.secondarySlides?.[1]?.[0],
              slide3Title: (payloadSettings.hero as { secondarySlides?: string[][] })?.secondarySlides?.[1]?.[1],
              slide3Description: (payloadSettings.hero as { secondarySlides?: string[][] })?.secondarySlides?.[1]?.[2],
            },
            narratives: {
              designEyebrow: (payloadSettings.narratives as string[][])?.[0]?.[0],
              designTitle: (payloadSettings.narratives as string[][])?.[0]?.[1],
              designDescription: (payloadSettings.narratives as string[][])?.[0]?.[2],
              manufacturingEyebrow: (payloadSettings.narratives as string[][])?.[1]?.[0],
              manufacturingTitle: (payloadSettings.narratives as string[][])?.[1]?.[1],
              manufacturingDescription: (payloadSettings.narratives as string[][])?.[1]?.[2],
            },
            process: {
              label: (payloadSettings.process as { label?: string })?.label,
              step1Title: (payloadSettings.process as { steps?: string[][] })?.steps?.[0]?.[0],
              step1Text: (payloadSettings.process as { steps?: string[][] })?.steps?.[0]?.[1],
              step2Title: (payloadSettings.process as { steps?: string[][] })?.steps?.[1]?.[0],
              step2Text: (payloadSettings.process as { steps?: string[][] })?.steps?.[1]?.[1],
              step3Title: (payloadSettings.process as { steps?: string[][] })?.steps?.[2]?.[0],
              step3Text: (payloadSettings.process as { steps?: string[][] })?.steps?.[2]?.[1],
              step4Title: (payloadSettings.process as { steps?: string[][] })?.steps?.[4]?.[0],
              step4Text: (payloadSettings.process as { steps?: string[][] })?.steps?.[4]?.[1],
            },
            sections: payloadSettings.sections,
            directory: payloadSettings.directory,
            form: payloadSettings.form,
            footer: payloadSettings.footer,
          },
          locale,
        )
      : DEFAULT_SITE_SETTINGS[locale]

  const dictionary = Object.fromEntries(
    (
      [
        ['hero1Subtitle', pickLocale(contentSafe.heroEyebrow as LocaleString, locale)],
        ['hero1Title', pickLocale(contentSafe.heroTitle as LocaleString, locale)],
        ['hero1Description', pickLocale(contentSafe.heroDescription as LocaleString, locale)],
        ['aboutTitle', pickLocale(contentSafe.aboutTitle as LocaleString, locale)],
        ['aboutDescription', pickLocale(contentSafe.aboutDescription as LocaleString, locale)],
        ['aboutGoal', pickLocale(contentSafe.aboutGoal as LocaleString, locale)],
        ['visionTitle', pickLocale(contentSafe.visionTitle as LocaleString, locale)],
        ['visionText', pickLocale(contentSafe.visionText as LocaleString, locale)],
        ['missionTitle', pickLocale(contentSafe.missionTitle as LocaleString, locale)],
        ['missionText', pickLocale(contentSafe.missionText as LocaleString, locale)],
        ['valuesTitle', pickLocale(contentSafe.valuesTitle as LocaleString, locale)],
        ['valuesText', pickLocale(contentSafe.valuesText as LocaleString, locale)],
        ['referencesTitle', pickLocale(contentSafe.referencesTitle as LocaleString, locale)],
        ['referencesText', pickLocale(contentSafe.referencesText as LocaleString, locale)],
        ['membershipsTitle', pickLocale(contentSafe.membershipsTitle as LocaleString, locale)],
        ['membershipsText', pickLocale(contentSafe.membershipsText as LocaleString, locale)],
        ['processTitle', pickLocale(contentSafe.processTitle as LocaleString, locale)],
        ['contactTitle', pickLocale(contentSafe.contactTitle as LocaleString, locale)],
        ['contactText', pickLocale(contentSafe.contactText as LocaleString, locale)],
        ['email', pickLocale(contentSafe.email as LocaleString, locale)],
        ['phone', pickLocale(contentSafe.phone as LocaleString, locale)],
        ['headOffice', pickLocale(contentSafe.headOffice as LocaleString, locale)],
        ['branchOffice', pickLocale(contentSafe.branchOffice as LocaleString, locale)],
        ['footerText', pickLocale(contentSafe.footerText as LocaleString, locale)],
      ] as Array<[string, string]>
    ).filter((entry) => entry[1].length > 0),
  )

  const sectionLayout =
    Array.isArray(contentSafe.sectionLayout) && contentSafe.sectionLayout.length > 0
      ? (contentSafe.sectionLayout as Array<{ section?: string; enabled?: boolean }>).map((item) => ({
          section: item.section as SectionKey,
          enabled: item.enabled !== false,
        }))
      : defaultSectionLayout

  return {
    dictionary,
    seo: {
      title: pickLocale(contentSafe.seoTitle as LocaleString, locale),
      description: pickLocale(contentSafe.seoDescription as LocaleString, locale),
    },
    ui,
    sectionLayout,
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

async function queryHomeData(includeDrafts: boolean) {
  if (!isSanityConfigured()) {
    return {
      tr: buildLocale('tr', null, null, [], [], []),
      en: buildLocale('en', null, null, [], [], []),
    }
  }

  const client = getSanityClient({ preview: includeDrafts })
  if (!client) {
    return {
      tr: buildLocale('tr', null, null, [], [], []),
      en: buildLocale('en', null, null, [], [], []),
    }
  }

  const data = await client.fetch<{
    siteContent: Record<string, unknown> | null
    siteSettings: Record<string, unknown> | null
    expertise: Array<Record<string, unknown>>
    partners: Array<Record<string, unknown>>
    memberships: Array<Record<string, unknown>>
  }>(homeBundleQuery)

  return {
    tr: buildLocale('tr', data.siteContent, data.siteSettings, data.expertise || [], data.partners || [], data.memberships || []),
    en: buildLocale('en', data.siteContent, data.siteSettings, data.expertise || [], data.partners || [], data.memberships || []),
  }
}

const getPublishedHomeData = unstable_cache(() => queryHomeData(false), ['bax-home-data-v5'], {
  tags: Object.values(CACHE_TAGS),
  revalidate: 86_400,
})

export async function getHomeData({ includeDrafts = false } = {}) {
  return includeDrafts ? queryHomeData(true) : getPublishedHomeData()
}
