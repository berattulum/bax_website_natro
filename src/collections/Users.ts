import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Panel Kullanıcısı', plural: 'Panel Kullanıcıları' },
  auth: true,
  admin: { group: 'Sistem Yönetimi', useAsTitle: 'email', defaultColumns: ['email', 'role', 'updatedAt'], description: 'Yönetim paneline giriş yapabilecek kullanıcıları yönetin.' },
  access: {
    read: ({ req }) => req.user?.role === 'admin' ? true : { id: { equals: req.user?.id } },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
    delete: ({ req }) => req.user?.role === 'admin',
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
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: { description: 'Yönetici sistem ayarlarını; editör ise site içeriklerini yönetmek için kullanılır.' },
    },
  ],
}
