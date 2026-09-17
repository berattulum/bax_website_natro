import companyProfile from '@/content/i18n/company-profile.json'

export type CompanyProfileCopy = {
  badge: string
  title: string
  subtitle: string
  facilityAlt: string
  aerospaceKicker: string
  aerospaceTitle: string
  aerospaceP1: string
  aerospaceP2: string
  sectorsLabel: string
  sectors: Array<{ title: string; image: string; alt: string }>
  principlesKicker: string
  principlesTitle: string
  principlesText: string
  capabilitiesKicker: string
  capabilitiesTitle: string
  capabilitiesText: string
  deliveryKicker: string
  deliveryTitle: string
  deliveryText: string
  stagesLabel: string
  stages: Array<[string, string]>
  foundations: string[]
  landscapeAlt: string
  nextKicker: string
  nextTitle: string
  nextTitleAccent: string
  nextFounder: string
  nextCorporate: string
}

/** Static copy — edit `src/content/i18n/company-profile.json`. */
export const companyProfileCopy = companyProfile as Record<'tr' | 'en', CompanyProfileCopy>
