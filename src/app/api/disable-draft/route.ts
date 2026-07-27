import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export async function GET(request: Request) {
  const draft = await draftMode()

  // The signed Next.js Draft Mode cookie is the authorization boundary here.
  // Disabling only removes that cookie from the current browser and cannot
  // expose draft content or change CMS data.
  if (draft.isEnabled) draft.disable()

  const url = new URL(request.url)
  const response = NextResponse.redirect(
    new URL(safeRedirectPath(url.searchParams.get('redirect')), url.origin),
  )
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  return response
}
