import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

const globalSlugs = ['site-content', 'site-settings'] as const
const locales = ['tr', 'en'] as const

type GlobalSlug = (typeof globalSlugs)[number]
type Locale = (typeof locales)[number]

async function initializePublishedGlobalVersion({
  locale,
  payload,
  req,
  slug,
}: {
  locale: Locale
  payload: MigrateUpArgs['payload']
  req: MigrateUpArgs['req']
  slug: GlobalSlug
}) {
  const currentGlobal = await payload.findGlobal({
    slug,
    locale,
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })

  const {
    _status: _currentStatus,
    createdAt: _createdAt,
    globalType: _globalType,
    id: _id,
    updatedAt: _updatedAt,
    ...currentData
  } = currentGlobal as unknown as Record<string, unknown>

  await payload.updateGlobal({
    slug,
    locale,
    data: {
      ...currentData,
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
    req,
  })
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of globalSlugs) {
    for (const locale of locales) {
      await initializePublishedGlobalVersion({
        locale,
        payload,
        req,
        slug,
      })
    }
  }
}

// Version snapshots are deliberately preserved on rollback to avoid content loss.
export async function down(_args: MigrateDownArgs): Promise<void> {}
