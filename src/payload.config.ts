import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { tr } from '@payloadcms/translations/languages/tr'
import { s3Storage } from '@payloadcms/storage-s3'
import { Media } from './collections/Media.ts'
import { Messages } from './collections/Messages.ts'
import { Users } from './collections/Users.ts'
import { SiteContent } from './globals/SiteContent.ts'
import { ExpertiseItems } from './collections/ExpertiseItems.ts'
import { Memberships } from './collections/Memberships.ts'
import { Partners } from './collections/Partners.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL = process.env.DATABASE_URL || 'file:./bax.db'
const usePostgres = process.env.DATABASE_PROVIDER === 'postgres' || databaseURL.startsWith('postgres://') || databaseURL.startsWith('postgresql://')
const useCloudStorage = Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)

export default buildConfig({
  i18n: {
    fallbackLanguage: 'tr',
    supportedLanguages: { tr, en },
  },
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— BaX İçerik Yönetimi' },
  },
  collections: [Users, Media, ExpertiseItems, Partners, Memberships, Messages],
  globals: [SiteContent],
  localization: {
    locales: [
      { code: 'tr', label: 'Türkçe' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'tr',
    fallback: true,
  },
  db: usePostgres
    ? postgresAdapter({
        pool: { connectionString: databaseURL },
        push: process.env.NODE_ENV !== 'production',
      })
    : sqliteAdapter({ client: { url: databaseURL } }),
  plugins: [
    s3Storage({
      enabled: useCloudStorage,
      collections: { media: { prefix: 'media' } },
      bucket: process.env.S3_BUCKET || 'local-disabled',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: useCloudStorage
          ? {
              accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            }
          : undefined,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'development-only-change-before-production',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
