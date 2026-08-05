import path from 'node:path'
import type { CollectionConfig } from 'payload'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { createCollectionRevalidationHooks } from '@/hooks/revalidate-site'

const revalidation = createCollectionRevalidationHooks([
  CACHE_TAGS.home,
  CACHE_TAGS.media,
])

const mediaDirectory = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  labels: { singular: 'Medya Dosyası', plural: 'Medya Kütüphanesi' },
  admin: { group: 'Dosya Yönetimi', useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'], description: 'Site görsellerini, logoları, videoları ve PDF belgelerini yönetin.' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: mediaDirectory,
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
  },
  fields: [
    { name: 'alt', label: 'Görsel açıklaması (alt metin)', type: 'text', localized: true, required: true, admin: { description: 'Erişilebilirlik ve SEO için görseli kısa ve net biçimde tanımlayın. Örnek: TPAC şirket logosu' } },
  ],
}
