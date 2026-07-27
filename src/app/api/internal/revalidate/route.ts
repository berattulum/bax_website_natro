import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

import { ALLOWED_CACHE_TAGS, type CacheTag } from '@/lib/cache/tags'

export const runtime = 'nodejs'

function secretsMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  )
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_SECRET
  const receivedSecret = request.headers.get('x-revalidation-secret') ?? ''

  if (!expectedSecret || !secretsMatch(receivedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null
  if (!body || !Array.isArray(body.tags)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const tags = [
    ...new Set(
      body.tags.filter(
        (tag): tag is CacheTag =>
          typeof tag === 'string' && ALLOWED_CACHE_TAGS.has(tag),
      ),
    ),
  ]

  if (tags.length === 0) {
    return NextResponse.json({ error: 'No valid cache tags supplied' }, { status: 400 })
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return NextResponse.json({
    revalidated: true,
    tags,
    timestamp: new Date().toISOString(),
  })
}
