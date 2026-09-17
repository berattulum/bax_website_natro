import ecosystem from '@/content/i18n/ecosystem.json'

export type EcosystemChrome = {
  partnerships: {
    eyebrow: string
    lead: string
    title: string
    description: string
    index: string
    next: string
    nextText: string
    explore: string
  }
  networks: {
    eyebrow: string
    lead: string
    title: string
    description: string
    index: string
    next: string
    nextText: string
    explore: string
  }
}

/** Static copy — edit `src/content/i18n/ecosystem.json`. */
export const ecosystemPageCopy = ecosystem as Record<'tr' | 'en', EcosystemChrome>
