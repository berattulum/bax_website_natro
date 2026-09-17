import sustainability from '@/content/i18n/sustainability.json'

/** Static copy — edit `src/content/i18n/sustainability.json`. */
export const sustainabilityCopy = sustainability as unknown as Record<'tr' | 'en', (typeof sustainability)['tr']>
