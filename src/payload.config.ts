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
import { SiteSettings } from './globals/SiteSettings.ts'
import { FounderPage } from './globals/FounderPage.ts'
import { CorporateInformationPage } from './globals/CorporateInformationPage.ts'
import { SustainabilityPage } from './globals/SustainabilityPage.ts'
import { ExpertiseItems } from './collections/ExpertiseItems.ts'
import { Memberships } from './collections/Memberships.ts'
import { Partners } from './collections/Partners.ts'
import { migrations } from './migrations/index.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL = process.env.DATABASE_URL || 'file:./bax.db'
const usePostgres = process.env.DATABASE_PROVIDER === 'postgres' || databaseURL.startsWith('postgres://') || databaseURL.startsWith('postgresql://')
const useCloudStorage = Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)
const previewSecret = process.env.PREVIEW_SECRET || ''
const previewURL = `/api/draft?secret=${encodeURIComponent(previewSecret)}&redirect=/`
const payloadSecret = process.env.PAYLOAD_SECRET

if (!payloadSecret && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET must be configured in production.')
}

export default buildConfig({
  i18n: {
    fallbackLanguage: 'tr',
    supportedLanguages: { tr, en },
  },
  admin: {
    user: Users.slug,
    dateFormat: 'dd.MM.yyyy HH:mm',
    livePreview: {
      url: previewURL,
      collections: [ExpertiseItems.slug, Partners.slug, Memberships.slug],
      globals: [SiteContent.slug, SiteSettings.slug],
      openByDefault: false,
      breakpoints: [
        { name: 'mobile', label: 'Mobil', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 1024, height: 768 },
        { name: 'desktop', label: 'Masaüstü', width: 1440, height: 900 },
      ],
    },
    importMap: {
      baseDir: dirname,
    },
    meta: {
      titleSuffix: '— BaX İçerik Yönetimi',
      description: 'BaX Composites kurumsal içerik ve iletişim yönetim paneli',
    },
    components: {
      actions: ['/admin/components/ViewSiteAction', '/admin/components/LogoutAction'],
      graphics: {
        Logo: '/admin/components/BaxLogo',
      },
      views: {
        dashboard: {
          Component: '/admin/product/OverviewView',
        },
        pages: {
          Component: '/admin/product/PagesView',
          path: '/pages',
        },
        library: { Component: '/admin/product/LibraryView', path: '/library' },
        inbox: { Component: '/admin/product/InboxView', path: '/inbox' },
        assets: { Component: '/admin/product/AssetsView', path: '/assets' },
        settings: { Component: '/admin/product/SettingsView', path: '/settings' },
        team: { Component: '/admin/product/TeamView', path: '/team' },
        editor: { Component: '/admin/product/EditorView', path: '/editor/:page' },
      },
    },
  },
  collections: [Users, Media, ExpertiseItems, Partners, Memberships, Messages],
  globals: [SiteContent, SiteSettings, FounderPage, CorporateInformationPage, SustainabilityPage],
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
        prodMigrations: migrations,
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
  secret: payloadSecret || 'development-only-change-before-production',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
