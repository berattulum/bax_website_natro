import type { Field, GlobalConfig } from 'payload'

import { createGlobalRevalidationHook } from '@/hooks/revalidate-site'
import { CACHE_TAGS } from '@/lib/cache/tags'

const localizedText = (name: string, label: string, textarea = false): Field =>
  textarea
    ? { name, label, type: 'textarea', localized: true, required: true }
    : { name, label, type: 'text', localized: true, required: true }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  versions: {
    drafts: {
      autosave: { interval: 800, showSaveDraftButton: true },
    },
    max: 20,
  },
  label: 'Arayüz ve Sistem Metinleri',
  admin: {
    group: 'İçerik Yönetimi',
    description: 'Header, footer, butonlar, formlar ve sistem bildirimlerinde kullanılan Türkçe ve İngilizce metinleri yönetin.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      createGlobalRevalidationHook([CACHE_TAGS.home, CACHE_TAGS.siteSettings]),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header ve Gezinme',
          fields: [{
            name: 'navigation', type: 'group', label: 'Gezinme metinleri',
            fields: [
              localizedText('home', 'Ana sayfa'),
              localizedText('about', 'Hakkımızda'),
              localizedText('expertise', 'Uzmanlık'),
              localizedText('references', 'Referanslar'),
              localizedText('memberships', 'Üyelikler'),
              localizedText('contact', 'İletişim'),
              localizedText('contactUs', 'Header iletişim butonu'),
              localizedText('mainNavigationLabel', 'Ana navigasyon erişilebilirlik etiketi'),
              localizedText('mobileMenuLabel', 'Mobil menü erişilebilirlik etiketi'),
              localizedText('languageLabel', 'Dil seçimi erişilebilirlik etiketi'),
            ],
          }],
        },
        {
          label: 'Açılış ve Görsel Alanlar',
          fields: [
            {
              name: 'hero', type: 'group', label: 'Açılış alanı',
              fields: [
                localizedText('capabilities', 'Yetkinlikler butonu'),
                localizedText('discuss', 'Projeyi konuşalım butonu'),
                localizedText('slidesLabel', 'Slider erişilebilirlik etiketi'),
                localizedText('slideLabel', 'Tekil slider etiketi'),
                localizedText('slide2Eyebrow', 'İkinci slider üst başlığı'),
                localizedText('slide2Title', 'İkinci slider başlığı'),
                localizedText('slide2Description', 'İkinci slider açıklaması', true),
                localizedText('slide3Eyebrow', 'Üçüncü slider üst başlığı'),
                localizedText('slide3Title', 'Üçüncü slider başlığı'),
                localizedText('slide3Description', 'Üçüncü slider açıklaması', true),
              ],
            },
            {
              name: 'narratives', type: 'group', label: 'Tam ekran görsel anlatım alanları',
              fields: [
                localizedText('designEyebrow', 'Tasarım alanı üst başlığı'),
                localizedText('designTitle', 'Tasarım alanı başlığı'),
                localizedText('designDescription', 'Tasarım alanı açıklaması', true),
                localizedText('manufacturingEyebrow', 'Üretim alanı üst başlığı'),
                localizedText('manufacturingTitle', 'Üretim alanı başlığı'),
                localizedText('manufacturingDescription', 'Üretim alanı açıklaması', true),
              ],
            },
          ],
        },
        {
          label: 'Süreç ve Çözümler',
          fields: [
            {
              name: 'process', type: 'group', label: 'Uçtan uca süreç',
              fields: [
                localizedText('label', 'Süreç üst başlığı'),
                ...[1, 2, 3, 4].flatMap((step) => [
                  localizedText(`step${step}Title`, `${step}. adım başlığı`),
                  localizedText(`step${step}Text`, `${step}. adım açıklaması`, true),
                ]),
              ],
            },
            {
              name: 'sections', type: 'group', label: 'Kurumsal ve çözüm alanları',
              fields: [
                localizedText('principlesTitle', 'Vizyon, misyon ve değerler üst başlığı'),
                localizedText('solutionsLabel', 'Çözümler üst etiketi'),
                localizedText('solutionsTitle', 'Çözümler başlığı'),
                localizedText('solutionsText', 'Çözümler açıklaması', true),
                localizedText('defense', 'Savunma çözümü etiketi'),
                localizedText('aviation', 'Havacılık çözümü etiketi'),
                localizedText('selectedPartners', 'Seçilmiş iş ortakları etiketi'),
              ],
            },
          ],
        },
        {
          label: 'İletişim Formu',
          fields: [
            {
              name: 'directory', type: 'group', label: 'İletişim dizini',
              fields: [
                localizedText('company', 'Şirket etiketi'),
                localizedText('email', 'E-posta etiketi'),
                localizedText('phone', 'Telefon etiketi'),
                localizedText('web', 'Web etiketi'),
                localizedText('tellProject', 'Projenizi anlatın butonu'),
                localizedText('companyName', 'Şirket adı'),
                localizedText('websiteLabel', 'Web sitesi görünen adı'),
                { name: 'websiteUrl', label: 'Web sitesi bağlantısı', type: 'text', required: true, defaultValue: 'https://baxcomposites.com/' },
              ],
            },
            {
              name: 'form', type: 'group', label: 'Form metinleri ve bildirimleri',
              fields: [
                localizedText('modalTitle', 'Form başlığı'),
                localizedText('modalIntro', 'Form açıklaması', true),
                localizedText('name', 'Ad soyad alanı'),
                localizedText('company', 'Şirket alanı'),
                localizedText('subject', 'Konu alanı'),
                localizedText('message', 'Mesaj alanı'),
                localizedText('consent', 'Açık rıza metni', true),
                localizedText('send', 'Gönder butonu'),
                localizedText('sending', 'Gönderiliyor bildirimi'),
                localizedText('received', 'Başarılı gönderim bildirimi'),
                localizedText('failed', 'Hata bildirimi'),
                localizedText('closeLabel', 'Kapat erişilebilirlik etiketi'),
              ],
            },
          ],
        },
        {
          label: 'Footer ve Yasal',
          fields: [{
            name: 'footer', type: 'group', label: 'Footer metinleri',
            fields: [
              localizedText('navigation', 'Gezinme başlığı'),
              localizedText('headOffice', 'Genel merkez başlığı'),
              localizedText('branchOffice', 'Şube başlığı'),
              localizedText('rights', 'Haklar metni'),
              localizedText('copyright', 'Telif metni'),
              localizedText('legalNavigationLabel', 'Yasal bağlantılar erişilebilirlik etiketi'),
              localizedText('privacyLabel', 'KVKK / gizlilik bağlantısı etiketi'),
              localizedText('cookieLabel', 'Çerez politikası bağlantısı etiketi'),
              localizedText('applicationLabel', 'Başvuru formu bağlantısı etiketi'),
              { name: 'privacyUrl', label: 'KVKK / gizlilik dosyası', type: 'text', required: true, defaultValue: '/assets/legal/bax-personal-data-clarification.pdf' },
              { name: 'cookieUrl', label: 'Çerez politikası dosyası', type: 'text', required: true, defaultValue: '/assets/legal/bax-cookie-policy.pdf' },
              { name: 'applicationUrl', label: 'Başvuru formu dosyası', type: 'text', required: true, defaultValue: '/assets/legal/bax-kvkk-application-form.pdf' },
            ],
          }],
        },
      ],
    },
  ],
}
