export const siteLocales = ['en', 'tr'] as const
export type SiteLocale = (typeof siteLocales)[number]

type RouteDefinition = {
  legacy: string
  paths: Record<SiteLocale, string>
  title: Record<SiteLocale, string>
  description: Record<SiteLocale, string>
}

export const siteRoutes = {
  home: {
    legacy: '/', paths: { en: '/en', tr: '/tr' },
    title: { en: 'BaX Composites | Advanced Composite Engineering', tr: 'BaX Composites | İleri Kompozit Mühendisliği' },
    description: { en: 'Advanced composite engineering, design, verification and industrialization solutions.', tr: 'İleri kompozit mühendisliği, tasarım, doğrulama ve endüstrileştirme çözümleri.' },
  },
  company: {
    legacy: '/sirket-profili', paths: { en: '/en/company', tr: '/tr/sirket-profili' },
    title: { en: 'Company | BaX Composites', tr: 'Şirket Profili | BaX Composites' },
    description: { en: 'Discover BaX Composites and its connected engineering approach.', tr: 'BaX Composites ve bütünleşik mühendislik yaklaşımını keşfedin.' },
  },
  founder: {
    legacy: '/kurucu', paths: { en: '/en/founder', tr: '/tr/kurucu' },
    title: { en: 'Founder | BaX Composites', tr: 'Kurucu | BaX Composites' },
    description: { en: 'Meet BaX Composites founder Hakkı Kızılok.', tr: 'BaX Composites kurucusu Hakkı Kızılok’u tanıyın.' },
  },
  corporate: {
    legacy: '/kurumsal-bilgiler', paths: { en: '/en/corporate-information', tr: '/tr/kurumsal-bilgiler' },
    title: { en: 'Corporate Information | BaX Composites', tr: 'Kurumsal Bilgiler | BaX Composites' },
    description: { en: 'Verified corporate information for BaX Composites.', tr: 'BaX Composites doğrulanabilir kurumsal bilgileri.' },
  },
  capabilities: {
    legacy: '/capabilities', paths: { en: '/en/capabilities', tr: '/tr/yetkinlikler' },
    title: { en: 'Capabilities | BaX Composites', tr: 'Yetkinlikler | BaX Composites' },
    description: { en: 'Composite engineering, manufacturing and industrialization capabilities.', tr: 'Kompozit mühendisliği, üretim ve endüstrileştirme yetkinlikleri.' },
  },
  partnerships: {
    legacy: '/is-ortakliklari', paths: { en: '/en/partnerships', tr: '/tr/is-ortakliklari' },
    title: { en: 'Partnerships | BaX Composites', tr: 'İş Ortaklıkları | BaX Composites' },
    description: { en: 'Strategic partnerships supporting advanced composite engineering.', tr: 'İleri kompozit mühendisliğini destekleyen stratejik iş ortaklıkları.' },
  },
  networks: {
    legacy: '/aglar-ve-uyelikler', paths: { en: '/en/networks-memberships', tr: '/tr/aglar-ve-uyelikler' },
    title: { en: 'Networks & Memberships | BaX Composites', tr: 'Ağlar ve Üyelikler | BaX Composites' },
    description: { en: 'BaX Composites research, industry and innovation networks.', tr: 'BaX Composites araştırma, sanayi ve inovasyon ağları.' },
  },
  sustainability: {
    legacy: '/surdurulebilirlik', paths: { en: '/en/sustainability', tr: '/tr/surdurulebilirlik' },
    title: { en: 'Sustainability | BaX Composites', tr: 'Sürdürülebilirlik | BaX Composites' },
    description: { en: 'Circular materials and sustainable composite engineering.', tr: 'Döngüsel malzemeler ve sürdürülebilir kompozit mühendisliği.' },
  },
  contact: {
    legacy: '/iletisim', paths: { en: '/en/contact', tr: '/tr/iletisim' },
    title: { en: 'Contact | BaX Composites', tr: 'İletişim | BaX Composites' },
    description: { en: 'Contact the BaX Composites engineering team.', tr: 'BaX Composites mühendislik ekibiyle iletişime geçin.' },
  },
  privacy: {
    legacy: '/kvkk/aydinlatma-metni', paths: { en: '/en/privacy-notice', tr: '/tr/kvkk/aydinlatma-metni' },
    title: { en: 'Privacy Notice | BaX Composites', tr: 'Aydınlatma Metni | BaX Composites' },
    description: { en: 'BaX Composites privacy notice.', tr: 'BaX Composites kişisel veriler aydınlatma metni.' },
  },
  cookies: {
    legacy: '/cerez-politikasi', paths: { en: '/en/cookie-policy', tr: '/tr/cerez-politikasi' },
    title: { en: 'Cookie Policy | BaX Composites', tr: 'Çerez Politikası | BaX Composites' },
    description: { en: 'BaX Composites cookie policy.', tr: 'BaX Composites çerez politikası.' },
  },
  application: {
    legacy: '/kvkk/basvuru', paths: { en: '/en/privacy-application', tr: '/tr/kvkk/basvuru' },
    title: { en: 'Privacy Application | BaX Composites', tr: 'KVKK Başvuru Formu | BaX Composites' },
    description: { en: 'Privacy rights application information.', tr: 'Kişisel veri hakları başvuru bilgileri.' },
  },
  privacyHub: {
    legacy: '/kvkk', paths: { en: '/en/privacy', tr: '/tr/kvkk' },
    title: { en: 'Privacy | BaX Composites', tr: 'KVKK | BaX Composites' },
    description: { en: 'BaX Composites privacy documents.', tr: 'BaX Composites kişisel veri belgeleri.' },
  },
} satisfies Record<string, RouteDefinition>

export type SiteRouteKey = keyof typeof siteRoutes

export function localeFromPath(pathname: string): SiteLocale | null {
  const locale = pathname.split('/')[1]
  return siteLocales.includes(locale as SiteLocale) ? locale as SiteLocale : null
}

export function routeFromPath(pathname: string) {
  const cleanPath = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname
  return Object.entries(siteRoutes).find(([, route]) =>
    route.legacy === cleanPath || Object.values(route.paths).includes(cleanPath),
  ) ?? null
}

export function localizedPath(pathname: string, locale: SiteLocale) {
  return routeFromPath(pathname)?.[1].paths[locale] ?? `/${locale}`
}

export function routeByLocalizedSlug(locale: SiteLocale, slug: string[]) {
  const path = `/${locale}${slug.length ? `/${slug.join('/')}` : ''}`
  return Object.entries(siteRoutes).find(([, route]) => route.paths[locale] === path) ?? null
}
