import type { CollectionConfig } from 'payload'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { createCollectionRevalidationHooks } from '@/hooks/revalidate-site'

const revalidation = createCollectionRevalidationHooks([
  CACHE_TAGS.home,
  CACHE_TAGS.references,
])

export const Partners: CollectionConfig = {
  slug: 'partners',
  hooks: {
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  labels: { singular: 'İş Ortağı / Referans', plural: 'İş Ortakları ve Referanslar' },
  admin: { group: 'Kurumsal İlişkiler', useAsTitle: 'name', defaultColumns: ['order', 'name', 'logo', 'active'], description: 'Partnerships bölümünde gösterilen şirketleri, logoları ve bağlantıları yönetin.' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    { name: 'order', label: 'Görüntülenme sırası', type: 'number', required: true, min: 1, admin: { description: 'Küçük sayı daha önce görünür.' } },
    { name: 'name', label: 'Şirket / kurum adı', type: 'text', required: true },
    { name: 'caption', label: 'Kartta görünen açıklama', type: 'text', localized: true, admin: { description: 'Boş bırakırsanız kurum adı kullanılır. Gerekirse Türkçe ve İngilizce ayrı yazın.' } },
    { name: 'website', label: 'Kurumsal web sitesi', type: 'text', required: true, admin: { description: 'https:// ile başlayan tam adresi girin. Örnek: https://example.com/' } },
    { name: 'logo', label: 'Kurum logosu', type: 'upload', relationTo: 'media', admin: { description: 'Kartın doğru görünmesi için logo yükleyin. Tercihen şeffaf arka planlı, yatay ve yüksek çözünürlüklü PNG veya SVG kullanın.' } },
    { name: 'active', label: 'Sitede göster', type: 'checkbox', defaultValue: true, admin: { description: 'Kapalı olduğunda kayıt silinmez, yalnızca sitede gizlenir.' } },
  ],
}
