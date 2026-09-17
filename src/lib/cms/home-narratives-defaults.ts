import homeNarratives from '@/content/i18n/home-narratives.json'

export type HomeNarratives = {
  loco3Process: Array<{ stage: string; label: string; image: string }>
  capabilityTransition: Array<{ index: string; stage: string; title: string; text: string; image: string }>
  sectorApplications: Array<{
    index: string
    sector: string
    title: string
    text: string
    meta: string
    image: string
  }>
  verificationEvidence: Array<{
    code: string
    type: string
    title: string
    body: string
    facts: string[]
    source: string
    href: string
  }>
  engineeringCards: Array<{
    index: string
    title: string
    text: string
    meta: string
    href: string
    image: string
  }>
  sliderControl: { pause: string; resume: string; region: string }
}

/** Static copy — edit `src/content/i18n/home-narratives.json`. */
export const homeNarrativesCopy = homeNarratives as Record<'tr' | 'en', HomeNarratives>
