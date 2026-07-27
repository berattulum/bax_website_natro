export const CACHE_TAGS = {
  home: 'bax:home',
  siteContent: 'bax:global-settings',
  siteSettings: 'bax:site-settings',
  expertise: 'bax:expertise',
  references: 'bax:references-list',
  memberships: 'bax:memberships',
  media: 'bax:media',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

export const ALLOWED_CACHE_TAGS = new Set<string>(Object.values(CACHE_TAGS))
