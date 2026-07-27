import type { CollectionConfig } from 'payload'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { createCollectionRevalidationHooks } from '@/hooks/revalidate-site'

const revalidation = createCollectionRevalidationHooks([
  CACHE_TAGS.home,
  CACHE_TAGS.expertise,
])

export const ExpertiseItems: CollectionConfig = {
  slug: 'expertise-items',
  versions: {
    drafts: {
      autosave: { interval: 800, showSaveDraftButton: true },
    },
    maxPerDoc: 20,
  },
  hooks: {
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  labels: { singular: 'Uzmanlık', plural: 'Uzmanlıklar' },
  admin: { group: 'İçerik Yönetimi', useAsTitle: 'title', defaultColumns: ['order', 'title', 'updatedAt'], description: 'Sitedeki uzmanlık kartlarını ve görüntülenme sıralarını yönetin.' },
  access: {
    read: ({ req }) =>
      req.user ? true : { _status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    { name: 'order', label: 'Görüntülenme sırası', type: 'number', required: true, min: 1, max: 6, admin: { description: '1 ilk kartı, 6 son kartı gösterir.' } },
    { name: 'title', label: 'Uzmanlık başlığı', type: 'text', localized: true, required: true, admin: { description: 'Türkçe ve İngilizce karşılığını ayrı ayrı girin.' } },
    { name: 'description', label: 'Kısa açıklama', type: 'textarea', localized: true, required: true, maxLength: 300, admin: { description: 'Kart üzerinde görünen kısa açıklama; 1–2 cümle önerilir.' } },
  ],
}
