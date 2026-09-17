import capabilities from '@/content/i18n/capabilities.json'

export type CapabilitiesPageCopy = {
  labels: Record<string, string>
  stages: Array<[string, string, string]>
  details: string[][]
  outputsList: string[][]
  connections: string[]
  fallback: Array<{ order: number; title: string; description: string }>
  videos: Array<{ src?: string; poster: string }>
  evidence: { machTitle: string; locoTitle: string }
}

/** Static copy — edit `src/content/i18n/capabilities.json`. */
export const capabilitiesPageCopy = capabilities as unknown as Record<'tr' | 'en', CapabilitiesPageCopy>
