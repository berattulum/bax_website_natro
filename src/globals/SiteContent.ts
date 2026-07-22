import type { GlobalConfig } from 'payload'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Site İçeriği',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ana Sayfa',
          fields: [
            { name: 'heroEyebrow', label: 'Üst başlık', type: 'text', localized: true },
            { name: 'heroTitle', label: 'Ana başlık', type: 'text', localized: true },
            { name: 'heroDescription', label: 'Açıklama', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Kurumsal',
          fields: [
            { name: 'aboutTitle', label: 'Başlık', type: 'text', localized: true },
            { name: 'aboutDescription', label: 'Açıklama', type: 'textarea', localized: true },
            { name: 'aboutGoal', label: 'Hedef metni', type: 'textarea', localized: true },
            { name: 'visionTitle', label: 'Vizyon başlığı', type: 'text', localized: true },
            { name: 'visionText', label: 'Vizyon metni', type: 'textarea', localized: true },
            { name: 'missionTitle', label: 'Misyon başlığı', type: 'text', localized: true },
            { name: 'missionText', label: 'Misyon metni', type: 'textarea', localized: true },
            { name: 'valuesTitle', label: 'Değerler başlığı', type: 'text', localized: true },
            { name: 'valuesText', label: 'Değerler metni', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Bölüm Başlıkları',
          fields: [
            { name: 'expertiseTitle', label: 'Uzmanlık başlığı', type: 'text', localized: true },
            { name: 'referencesTitle', label: 'Referanslar başlığı', type: 'text', localized: true },
            { name: 'referencesText', label: 'Referanslar açıklaması', type: 'textarea', localized: true },
            { name: 'membershipsTitle', label: 'Üyelikler başlığı', type: 'text', localized: true },
            { name: 'membershipsText', label: 'Üyelikler açıklaması', type: 'textarea', localized: true },
            { name: 'processTitle', label: 'Süreç başlığı', type: 'text', localized: true },
          ],
        },
        {
          label: 'İletişim',
          fields: [
            { name: 'contactTitle', label: 'İletişim başlığı', type: 'text', localized: true },
            { name: 'contactText', label: 'İletişim açıklaması', type: 'textarea', localized: true },
            { name: 'email', label: 'E-posta', type: 'email', defaultValue: 'info@baxcomposites.com' },
            { name: 'phone', label: 'Telefon', type: 'text', defaultValue: '+90 (212) 565 00 08' },
            { name: 'headOffice', label: 'Genel merkez', type: 'textarea', localized: true },
            { name: 'branchOffice', label: 'Şube', type: 'textarea', localized: true },
            { name: 'footerText', label: 'Alt bilgi kısa metni', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', label: 'Sayfa başlığı', type: 'text', localized: true },
            { name: 'seoDescription', label: 'Meta açıklaması', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}
