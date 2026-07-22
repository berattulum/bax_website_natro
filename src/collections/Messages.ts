import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'İletişim Mesajı', plural: 'İletişim Mesajları' },
  admin: { useAsTitle: 'subject', defaultColumns: ['name', 'company', 'email', 'subject', 'createdAt'] },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'company', label: 'Şirket', type: 'text' },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'phone', label: 'Telefon', type: 'text' },
    { name: 'subject', label: 'Konu', type: 'text', required: true },
    { name: 'message', label: 'Mesaj', type: 'textarea', required: true },
    { name: 'consent', label: 'KVKK onayı', type: 'checkbox', required: true },
    {
      name: 'status',
      label: 'Durum',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Yeni', value: 'new' },
        { label: 'İşlemde', value: 'inProgress' },
        { label: 'Yanıtlandı', value: 'replied' },
      ],
    },
  ],
}
