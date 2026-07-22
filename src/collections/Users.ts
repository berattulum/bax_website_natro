import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Panel Kullanıcısı', plural: 'Panel Kullanıcıları' },
  auth: true,
  admin: { group: 'Sistem Yönetimi', useAsTitle: 'email', defaultColumns: ['email', 'role', 'updatedAt'], description: 'Yönetim paneline giriş yapabilecek kullanıcıları yönetin.' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'role',
      label: 'Kullanıcı yetkisi',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Yönetici', value: 'admin' },
        { label: 'Editör', value: 'editor' },
      ],
      admin: { description: 'Yönetici sistem ayarlarını; editör ise site içeriklerini yönetmek için kullanılır.' },
    },
  ],
}
