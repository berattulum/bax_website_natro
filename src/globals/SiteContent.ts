import type { GlobalConfig } from 'payload'
import { CACHE_TAGS } from '@/lib/cache/tags'
import { createGlobalRevalidationHook } from '@/hooks/revalidate-site'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  versions: {
    drafts: true,
    max: 20,
  },
  hooks: {
    afterChange: [
      createGlobalRevalidationHook([
        CACHE_TAGS.home,
        CACHE_TAGS.siteContent,
      ]),
    ],
  },
  label: 'Site İçeriği',
  admin: {
    group: 'İçerik Yönetimi',
    description: 'Ana sayfadaki sabit metinleri Türkçe ve İngilizce olarak buradan yönetin. Düzenleme yapmadan önce sağ üstten doğru dili seçin.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ana Sayfa',
          fields: [
            { name: 'heroEyebrow', label: 'Açılış üst başlığı', type: 'text', localized: true, admin: { description: 'Ana başlığın üzerinde küçük harflerle görünen kısa ifade.' } },
            { name: 'heroTitle', label: 'Açılış ana başlığı', type: 'text', localized: true, admin: { description: 'Satır sonu vermek için <br> kullanabilirsiniz. Örnek: Tasarımdan <br>Endüstrileştirmeye' } },
            { name: 'heroDescription', label: 'Açılış açıklaması', type: 'textarea', localized: true, admin: { description: 'Başlığın altında görünen, tercihen 1–2 cümlelik açıklama.' } },
          ],
        },
        {
          label: 'Kurumsal',
          fields: [
            { name: 'aboutTitle', label: 'Hakkımızda başlığı', type: 'text', localized: true, admin: { description: 'Kurumsal tanıtım bölümünün büyük başlığı.' } },
            { name: 'aboutDescription', label: 'Şirket tanıtım metni', type: 'textarea', localized: true, admin: { description: 'BaX Composites’in kim olduğunu ve hangi alanlarda çalıştığını açıklayın.' } },
            { name: 'aboutGoal', label: 'Hedef ve değer önerisi', type: 'textarea', localized: true, admin: { description: 'Müşterilere sağlanan faydayı ve uzun vadeli hedefi anlatan ikinci paragraf.' } },
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
            { name: 'referencesTitle', label: 'İş ortaklıkları başlığı', type: 'text', localized: true, admin: { description: 'Partnerships/Referanslar logo alanının başlığı.' } },
            { name: 'referencesText', label: 'İş ortaklıkları açıklaması', type: 'textarea', localized: true },
            { name: 'membershipsTitle', label: 'Kurumsal üyelikler başlığı', type: 'text', localized: true },
            { name: 'membershipsText', label: 'Kurumsal üyelikler açıklaması', type: 'textarea', localized: true },
            { name: 'processTitle', label: 'Süreç başlığı', type: 'text', localized: true },
          ],
        },
        {
          label: 'İletişim',
          fields: [
            { name: 'contactTitle', label: 'İletişim başlığı', type: 'text', localized: true },
            { name: 'contactText', label: 'İletişim açıklaması', type: 'textarea', localized: true },
            { name: 'email', label: 'Kurumsal e-posta adresi', type: 'email', defaultValue: 'info@baxcomposites.com' },
            { name: 'phone', label: 'Kurumsal telefon', type: 'text', defaultValue: '+90 (212) 565 00 08', admin: { description: 'Ülke koduyla birlikte yazın. Örnek: +90 (212) 565 00 08' } },
            { name: 'headOffice', label: 'Genel merkez adresi', type: 'textarea', localized: true, admin: { description: 'Adres satırlarını Enter ile ayırabilirsiniz.' } },
            { name: 'branchOffice', label: 'Şube adresi', type: 'textarea', localized: true, admin: { description: 'Adres satırlarını Enter ile ayırabilirsiniz.' } },
            { name: 'footerText', label: 'Alt bilgi kısa metni', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Sayfa Düzeni',
          description: 'Açılış alanı ile footer arasındaki bölümleri sürükleyerek sıralayın, geçici olarak gizleyin veya listeden çıkarın.',
          fields: [
            {
              name: 'sectionLayout',
              label: 'Ana sayfa bölümleri',
              type: 'array',
              minRows: 1,
              maxRows: 10,
              labels: { singular: 'Bölüm', plural: 'Bölümler' },
              admin: {
                description: 'Satırları sol taraftaki tutamaçtan sürükleyebilirsiniz. Aynı bölümü iki kez eklemeyin.',
                initCollapsed: true,
              },
              defaultValue: [
                { section: 'about', enabled: true },
                { section: 'designNarrative', enabled: true },
                { section: 'expertise', enabled: true },
                { section: 'manufacturingNarrative', enabled: true },
                { section: 'process', enabled: true },
                { section: 'principles', enabled: true },
                { section: 'solutions', enabled: true },
                { section: 'partners', enabled: true },
                { section: 'memberships', enabled: true },
                { section: 'contact', enabled: true },
              ],
              fields: [
                {
                  name: 'section',
                  label: 'Gösterilecek bölüm',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Hakkımızda', value: 'about' },
                    { label: 'Mühendislik ve Tasarım Görsel Alanı', value: 'designNarrative' },
                    { label: 'Uzmanlık Kartları', value: 'expertise' },
                    { label: 'Üretim Görsel Alanı', value: 'manufacturingNarrative' },
                    { label: 'Uçtan Uca Süreç', value: 'process' },
                    { label: 'Vizyon, Misyon ve Değerler', value: 'principles' },
                    { label: 'Sektörel Çözümler', value: 'solutions' },
                    { label: 'İş Ortakları ve Referanslar', value: 'partners' },
                    { label: 'Kurumsal Üyelikler', value: 'memberships' },
                    { label: 'İletişim', value: 'contact' },
                  ],
                },
                {
                  name: 'enabled',
                  label: 'Sitede göster',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { description: 'Kapalı olduğunda bölüm düzende kalır ancak ziyaretçilere görünmez.' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', label: 'Google sayfa başlığı', type: 'text', localized: true, maxLength: 60, admin: { description: 'Arama sonuçlarında görünen başlık. Yaklaşık 50–60 karakter önerilir.' } },
            { name: 'seoDescription', label: 'Google sayfa açıklaması', type: 'textarea', localized: true, maxLength: 160, admin: { description: 'Arama sonuçlarında başlığın altında görünür. Yaklaşık 140–160 karakter önerilir.' } },
          ],
        },
      ],
    },
  ],
}
