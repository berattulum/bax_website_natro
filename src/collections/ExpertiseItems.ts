import type { CollectionConfig } from 'payload'

export const ExpertiseItems: CollectionConfig = {
  slug: 'expertise-items',
  labels: { singular: 'Uzmanlık', plural: 'Uzmanlıklar' },
  admin: { useAsTitle: 'title', defaultColumns: ['order', 'title', 'updatedAt'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    { name: 'order', label: 'Sıra', type: 'number', required: true, min: 1, max: 6 },
    { name: 'title', label: 'Başlık', type: 'text', localized: true, required: true },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true, required: true },
  ],
}
