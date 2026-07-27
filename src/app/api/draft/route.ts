import { timingSafeEqual } from 'node:crypto'

import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function secretsMatch(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate)
  const expectedBuffer = Buffer.from(expected)

  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  )
}

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export async function GET(request: Request) {
  const configuredSecret = process.env.PREVIEW_SECRET

  if (!configuredSecret) {
    return NextResponse.json(
      { error: 'Preview is not configured.' },
      { status: 503 },
    )
  }

  const url = new URL(request.url)
  const suppliedSecret = url.searchParams.get('secret') || ''

  if (!secretsMatch(suppliedSecret, configuredSecret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  const response = NextResponse.redirect(
    new URL(safeRedirectPath(url.searchParams.get('redirect')), url.origin),
  )
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  return response
}
