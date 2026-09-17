import type { GlobalConfig } from 'payload'

export const CorporateInformationPage: GlobalConfig = {
  slug: 'corporate-information-page',
  label: 'Kurumsal Bilgiler Sayfası',
  admin: { group: 'Yönetilen Sayfalar' },
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  versions: { drafts: { autosave: { interval: 1000, showSaveDraftButton: true } }, max: 20 },
  fields: [
    { name: 'contentTr', label: 'Türkçe içerik', type: 'json', required: true },
    { name: 'contentEn', label: 'İngilizce içerik', type: 'json', required: true },
    { name: 'records', label: 'Şirket kayıtları', type: 'json', required: true },
    { name: 'offices', label: 'Operasyon noktaları', type: 'json', required: true },
  ],
}
