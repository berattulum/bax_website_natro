import type { CollectionConfig } from 'payload'

export const Memberships: CollectionConfig = {
  slug: 'memberships',
  labels: { singular: 'Üyelik', plural: 'Üyelikler' },
  admin: { useAsTitle: 'name', defaultColumns: ['order', 'name', 'category', 'active'] },
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
    { name: 'category', label: 'Kategori', type: 'text', localized: true, required: true },
    { name: 'website', label: 'Web sitesi', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'darkCard', label: 'Koyu kart', type: 'checkbox', defaultValue: false },
    { name: 'active', label: 'Yayında', type: 'checkbox', defaultValue: true },
  ],
}
