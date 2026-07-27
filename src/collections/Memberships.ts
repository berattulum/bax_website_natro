import type { CollectionConfig } from 'payload'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { createCollectionRevalidationHooks } from '@/hooks/revalidate-site'

const revalidation = createCollectionRevalidationHooks([
  CACHE_TAGS.home,
  CACHE_TAGS.memberships,
])

export const Memberships: CollectionConfig = {
  slug: 'memberships',
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
  labels: { singular: 'Üyelik', plural: 'Üyelikler' },
  admin: { group: 'Kurumsal İlişkiler', useAsTitle: 'name', defaultColumns: ['order', 'name', 'category', 'active'], description: 'Üyesi olunan kurumları, ağları ve destek kuruluşlarını yönetin.' },
  access: {
    read: ({ req }) =>
      req.user ? true : { _status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    { name: 'order', label: 'Görüntülenme sırası', type: 'number', required: true, min: 1, admin: { description: 'Küçük sayı daha önce görünür.' } },
    { name: 'name', label: 'Kurum adı', type: 'text', required: true },
    { name: 'category', label: 'Üyelik / kurum türü', type: 'text', localized: true, required: true, admin: { description: 'Örnek: Sektörel Ağ, Araştırma Kurumu veya İhracatçı Birliği.' } },
    { name: 'website', label: 'Kurumsal web sitesi', type: 'text', required: true, admin: { description: 'https:// ile başlayan tam adresi girin.' } },
    { name: 'logo', label: 'Kurum logosu', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Tercihen şeffaf arka planlı PNG veya SVG kullanın.' } },
    { name: 'darkCard', label: 'Koyu renkli kart kullan', type: 'checkbox', defaultValue: false, admin: { description: 'Açık renkli logoların daha rahat okunması için kart arka planını koyulaştırır.' } },
    { name: 'active', label: 'Sitede göster', type: 'checkbox', defaultValue: true, admin: { description: 'Kapalı olduğunda kayıt silinmeden sitede gizlenir.' } },
  ],
}
