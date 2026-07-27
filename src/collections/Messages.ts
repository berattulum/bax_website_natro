import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'İletişim Mesajı', plural: 'İletişim Mesajları' },
  admin: { group: 'İletişim Yönetimi', useAsTitle: 'subject', defaultColumns: ['status', 'name', 'company', 'subject', 'createdAt'], description: 'Web sitesindeki proje ve iletişim formundan gelen talepleri takip edin.' },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', label: 'Gönderenin adı soyadı', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'company', label: 'Şirket / kurum', type: 'text', admin: { readOnly: true } },
    { name: 'email', label: 'E-posta adresi', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'phone', label: 'Telefon numarası', type: 'text', admin: { readOnly: true } },
    { name: 'subject', label: 'Talep konusu', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'message', label: 'Gönderilen mesaj', type: 'textarea', required: true, admin: { readOnly: true } },
    { name: 'consent', label: 'KVKK / iletişim onayı verildi', type: 'checkbox', required: true, admin: { readOnly: true, description: 'Bu bilgi form gönderildiği anda kullanıcı tarafından işaretlenmiştir.' } },
    {
      name: 'status',
      label: 'Talep durumu',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Yeni', value: 'new' },
        { label: 'İşlemde', value: 'inProgress' },
        { label: 'Yanıtlandı', value: 'replied' },
        { label: 'Kapatıldı', value: 'closed' },
      ],
      admin: { description: 'Ekip içi takip için talebin güncel durumunu seçin.' },
    },
    { name: 'internalNote', label: 'Ekip içi not', type: 'textarea', admin: { description: 'Bu not yalnızca yönetim panelinde görünür; kullanıcıya gönderilmez.' } },
  ],
}
