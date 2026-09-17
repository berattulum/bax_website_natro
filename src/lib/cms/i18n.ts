import type { SiteLocale } from '@/lib/i18n/site-routes'

import capabilities from '@/content/i18n/capabilities.json'
import companyProfile from '@/content/i18n/company-profile.json'
import contact from '@/content/i18n/contact.json'
import corporateInformation from '@/content/i18n/corporate-information.json'
import ecosystem from '@/content/i18n/ecosystem.json'
import founder from '@/content/i18n/founder.json'
import homeNarratives from '@/content/i18n/home-narratives.json'
import siteContent from '@/content/i18n/site-content.json'
import siteSettings from '@/content/i18n/site-settings.json'
import sustainability from '@/content/i18n/sustainability.json'

export function loadI18n<T>(bundle: Record<SiteLocale, T>, locale: SiteLocale): T {
  return bundle[locale]
}

export const i18n = {
  siteSettings,
  siteContent,
  homeNarratives,
  companyProfile,
  capabilities,
  ecosystem,
  contact,
  founder,
  corporateInformation,
  sustainability,
} as const
