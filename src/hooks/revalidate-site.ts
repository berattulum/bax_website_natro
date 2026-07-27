import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from 'payload'

import type { CacheTag } from '@/lib/cache/tags'

async function requestRevalidation(tags: CacheTag[], payload: Payload) {
  const appURL = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL
  const secret = process.env.REVALIDATION_SECRET

  if (!appURL || !secret) {
    payload.logger.warn(
      'APP_URL/NEXT_PUBLIC_SITE_URL veya REVALIDATION_SECRET tanımlı değil; cache temizlenmedi.',
    )
    return
  }

  try {
    const response = await fetch(
      `${appURL.replace(/\/$/, '')}/api/internal/revalidate`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'content-type': 'application/json',
          'x-revalidation-secret': secret,
        },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(5_000),
      },
    )

    if (!response.ok) {
      throw new Error(`Revalidation failed with status ${response.status}`)
    }
  } catch (error) {
    payload.logger.error({
      err: error,
      message: 'Next.js cache revalidation failed',
      tags,
    })
  }
}

export function createCollectionRevalidationHooks(tags: CacheTag[]): {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
} {
  return {
    afterChange: async ({ doc, req }) => {
      await requestRevalidation(tags, req.payload)
      return doc
    },
    afterDelete: async ({ doc, req }) => {
      await requestRevalidation(tags, req.payload)
      return doc
    },
  }
}

export function createGlobalRevalidationHook(tags: CacheTag[]): GlobalAfterChangeHook {
  return async ({ doc, req }) => {
    await requestRevalidation(tags, req.payload)
    return doc
  }
}
