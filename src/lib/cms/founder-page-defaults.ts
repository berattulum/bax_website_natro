import founder from '@/content/i18n/founder.json'

export type FounderPageCopy = {
  eyebrow: string
  role: string
  intro: string
  focusLabel: string
  focusTitle: string
  facts: Array<[string, string]>
  sources: string
  mach: string
  loco: string
  sampe: string
  linkedin: string
}

/** Static copy — edit `src/content/i18n/founder.json`. */
export const founderCopy = founder as unknown as Record<'tr' | 'en', FounderPageCopy>
