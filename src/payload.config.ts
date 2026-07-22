import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import { Media } from './collections/Media.ts'
import { Messages } from './collections/Messages.ts'
import { Users } from './collections/Users.ts'
import { SiteContent } from './globals/SiteContent.ts'
import { ExpertiseItems } from './collections/ExpertiseItems.ts'
import { Memberships } from './collections/Memberships.ts'
import { Partners } from './collections/Partners.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— BaX Yönetim' },
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
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./bax.db' },
  }),
  secret: process.env.PAYLOAD_SECRET || 'development-only-change-before-production',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
