import config from '@payload-config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type CheckResult = {
  name: string
  ok: boolean
  detail?: string
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return String(error)

  const cause =
    'cause' in error && error.cause instanceof Error
      ? ` Cause: ${error.cause.message}`
      : ''

  return `${error.name}: ${error.message}${cause}`
}

export async function GET() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const checks: CheckResult[] = []

  for (const slug of ['site-content', 'site-settings'] as const) {
    for (const draft of [false, true]) {
      try {
        const result = await payload.findGlobal({
          slug,
          draft,
          locale: 'tr',
          overrideAccess: true,
        })

        checks.push({
          name: `${slug}:${draft ? 'draft' : 'published'}`,
          ok: true,
          detail: `id=${String(result.id)} status=${String(result._status)}`,
        })
      } catch (error) {
        checks.push({
          name: `${slug}:${draft ? 'draft' : 'published'}`,
          ok: false,
          detail: safeError(error),
        })
      }
    }

    try {
      const result = await payload.findGlobal({
        slug,
        draft: true,
        locale: 'tr',
        overrideAccess: false,
        user,
      })

      checks.push({
        name: `${slug}:authenticated-access`,
        ok: true,
        detail: `id=${String(result.id)} status=${String(result._status)}`,
      })
    } catch (error) {
      checks.push({
        name: `${slug}:authenticated-access`,
        ok: false,
        detail: safeError(error),
      })
    }

    try {
      const result = await payload.findGlobalVersions({
        slug,
        depth: 0,
        limit: 1,
        locale: 'tr',
        overrideAccess: true,
      })

      checks.push({
        name: `${slug}:versions`,
        ok: true,
        detail: `totalDocs=${result.totalDocs}`,
      })
    } catch (error) {
      checks.push({
        name: `${slug}:versions`,
        ok: false,
        detail: safeError(error),
      })
    }
  }

  for (const collection of [
    'expertise-items',
    'partners',
    'memberships',
  ] as const) {
    try {
      const result = await payload.find({
        collection,
        depth: 0,
        draft: true,
        limit: 1,
        locale: 'tr',
        overrideAccess: true,
      })

      checks.push({
        name: `${collection}:draft-list`,
        ok: true,
        detail: `totalDocs=${result.totalDocs}`,
      })
    } catch (error) {
      checks.push({
        name: `${collection}:draft-list`,
        ok: false,
        detail: safeError(error),
      })
    }

    try {
      const result = await payload.find({
        collection,
        depth: 0,
        draft: true,
        limit: 1,
        locale: 'tr',
        overrideAccess: false,
        user,
      })

      checks.push({
        name: `${collection}:authenticated-access`,
        ok: true,
        detail: `totalDocs=${result.totalDocs}`,
      })
    } catch (error) {
      checks.push({
        name: `${collection}:authenticated-access`,
        ok: false,
        detail: safeError(error),
      })
    }
  }

  return NextResponse.json({
    authenticated: true,
    userCollection: user.collection,
    checks,
  })
}
