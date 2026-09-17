import type { GlobalConfig } from 'payload'

export const SustainabilityPage: GlobalConfig = {
  slug: 'sustainability-page',
  label: 'Sürdürülebilirlik Sayfası',
  admin: { group: 'Yönetilen Sayfalar' },
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  versions: { drafts: { autosave: { interval: 1000, showSaveDraftButton: true } }, max: 20 },
  fields: [
    { name: 'contentTr', label: 'Türkçe içerik', type: 'json', required: true },
    { name: 'contentEn', label: 'İngilizce içerik', type: 'json', required: true },
  ],
}
