import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Referans', plural: 'Referanslar' },
  admin: { useAsTitle: 'name', defaultColumns: ['order', 'name', 'website', 'active'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    { name: 'order', label: 'Sıra', type: 'number', required: true, min: 1 },
    { name: 'name', label: 'Kurum adı', type: 'text', required: true },
    { name: 'caption', label: 'Kart alt yazısı', type: 'text', localized: true },
    { name: 'website', label: 'Web sitesi', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    { name: 'active', label: 'Yayında', type: 'checkbox', defaultValue: true },
  ],
}
