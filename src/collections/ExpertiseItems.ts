import type { CollectionConfig } from 'payload'

export const ExpertiseItems: CollectionConfig = {
  slug: 'expertise-items',
  labels: { singular: 'Uzmanlık', plural: 'Uzmanlıklar' },
  admin: { group: 'İçerik Yönetimi', useAsTitle: 'title', defaultColumns: ['order', 'title', 'updatedAt'], description: 'Sitedeki uzmanlık kartlarını ve görüntülenme sıralarını yönetin.' },
  access: {
    read: () => true,
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
