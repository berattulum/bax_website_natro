import { getSanityClient, isSanityConfigured } from '@/lib/sanity/client'
import { MANAGED_PAGE_MAP, managedPageQuery } from '@/lib/sanity/queries'

export type ManagedPageDocument = {
  contentTr?: unknown
  contentEn?: unknown
  records?: unknown
  offices?: unknown
}

export type ManagedSlug = keyof typeof MANAGED_PAGE_MAP

function isEmptyPlainObject(value: unknown) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  )
}

function parseMaybeJson(value: unknown) {
  if (value == null) return undefined
  if (typeof value === 'object') {
    if (isEmptyPlainObject(value)) return undefined
    return value
  }
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed === '{}' || trimmed === '[]') return undefined
  try {
    const parsed = JSON.parse(trimmed)
    if (isEmptyPlainObject(parsed)) return undefined
    return parsed
  } catch {
    return undefined
  }
}

/** Prefer CMS JSON when it looks complete; otherwise use code defaults. */
export function coalesceManagedContent<T>(raw: unknown, fallback: T, requiredKey?: string): T {
  if (Array.isArray(raw)) {
    return (raw.length > 0 ? raw : fallback) as T
  }
  if (raw && typeof raw === 'object' && Object.keys(raw as object).length > 0) {
    if (requiredKey && !(requiredKey in (raw as object))) return fallback
    return raw as T
  }
  return fallback
}

export async function getManagedGlobal(slug: ManagedSlug): Promise<ManagedPageDocument> {
  if (!isSanityConfigured()) return {}

  const client = getSanityClient()
  if (!client) return {}

  const meta = MANAGED_PAGE_MAP[slug]
  const doc = await client.fetch<{
    contentTr?: unknown
    contentEn?: unknown
    records?: unknown
    offices?: unknown
  } | null>(managedPageQuery, { type: meta.type, id: meta.id })

  if (!doc) return {}

  return {
    contentTr: parseMaybeJson(doc.contentTr),
    contentEn: parseMaybeJson(doc.contentEn),
    records: parseMaybeJson(doc.records),
    offices: parseMaybeJson(doc.offices),
  }
}
