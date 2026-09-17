import type { GlobalConfig } from 'payload'

/** Shared JSON-blob managed page global (TR/EN content + drafts). */
export function createManagedPageGlobal(options: {
  slug: string
  label: string
  extraFields?: GlobalConfig['fields']
}): GlobalConfig {
  return {
    slug: options.slug,
    label: options.label,
    admin: { group: 'Yönetilen Sayfalar' },
    access: {
      read: () => true,
      update: ({ req }) => Boolean(req.user),
    },
    versions: { drafts: { autosave: { interval: 1000, showSaveDraftButton: true } }, max: 20 },
    fields: [
      { name: 'contentTr', label: 'Türkçe içerik', type: 'json', required: true },
      { name: 'contentEn', label: 'İngilizce içerik', type: 'json', required: true },
      ...(options.extraFields || []),
    ],
  }
}
