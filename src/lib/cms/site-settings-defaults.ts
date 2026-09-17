import siteSettings from '@/content/i18n/site-settings.json'

export type SiteUISettings = {
  navigation: Record<
    | 'home'
    | 'about'
    | 'expertise'
    | 'references'
    | 'memberships'
    | 'contact'
    | 'contactUs'
    | 'mainNavigationLabel'
    | 'mobileMenuLabel'
    | 'languageLabel',
    string
  >
  hero: {
    capabilities: string
    discuss: string
    slidesLabel: string
    slideLabel: string
    secondarySlides: Array<[string, string, string, string]>
  }
  narratives: Array<[string, string, string, string]>
  process: { label: string; steps: Array<[string, string]> }
  sections: Record<
    | 'principlesTitle'
    | 'solutionsLabel'
    | 'solutionsTitle'
    | 'solutionsText'
    | 'defense'
    | 'aviation'
    | 'selectedPartners',
    string
  >
  directory: Record<
    'company' | 'email' | 'phone' | 'web' | 'tellProject' | 'companyName' | 'websiteLabel' | 'websiteUrl',
    string
  >
  form: Record<
    | 'modalTitle'
    | 'modalIntro'
    | 'name'
    | 'company'
    | 'subject'
    | 'message'
    | 'consent'
    | 'send'
    | 'sending'
    | 'received'
    | 'failed'
    | 'closeLabel',
    string
  >
  footer: Record<
    | 'navigation'
    | 'headOffice'
    | 'branchOffice'
    | 'rights'
    | 'copyright'
    | 'legalNavigationLabel'
    | 'privacyLabel'
    | 'cookieLabel'
    | 'applicationLabel'
    | 'privacyUrl'
    | 'cookieUrl'
    | 'applicationUrl',
    string
  >
}

/** Static copy — edit `src/content/i18n/site-settings.json`. */
export const DEFAULT_SITE_SETTINGS = siteSettings as Record<'tr' | 'en', SiteUISettings>
