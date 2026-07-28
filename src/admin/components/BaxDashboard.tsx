import type { Payload } from 'payload'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import './admin-brand.scss'

type DashboardProps = {
  payload: Payload
  user?: {
    id: number | string
  } | null
}

type ContentMapItem = {
  code: string
  title: string
  eyebrow: string
  description: string
  image?: string
  href: string
  hrefEn?: string
  meta: string
  tone?: 'dark' | 'light'
}

type QuickModule = {
  code: string
  title: string
  description: string
  href: string
  count?: string
  icon: 'content' | 'settings' | 'expertise' | 'partners' | 'memberships' | 'messages' | 'media' | 'users'
}

const cleanText = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim()
    ? value.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')
    : fallback

const quickEditIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M14.7 5.3 18.7 9.3M4 20l3.9-.8L19.4 7.7a1.4 1.4 0 0 0 0-2l-1.1-1.1a1.4 1.4 0 0 0-2 0L4.8 16.1 4 20Z" />
  </svg>
)

const previewIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.7" />
  </svg>
)

function ModuleIcon({ name }: { name: QuickModule['icon'] }) {
  const paths: Record<QuickModule['icon'], ReactNode> = {
    content: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A8 8 0 0 0 15 6l-.3-2.5h-4L10.3 6a8 8 0 0 0-1.7 1l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A8 8 0 0 0 10 18l.4 2.5h4L15 18a8 8 0 0 0 1.6-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1Z" /></>,
    expertise: <><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    partners: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6M10.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6" /></>,
    memberships: <><path d="M12 3 9.5 8 4 9l4 4-.8 5.7L12 16l4.8 2.7L16 13l4-4-5.5-1L12 3Z" /></>,
    messages: <><path d="M4 5h16v12H8l-4 4V5Z" /><path d="M8 9h8M8 13h5" /></>,
    media: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m4 18 5-5 3 3 2-2 6 5" /></>,
    users: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" /></>,
  }

  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>
}

export default async function BaxDashboard({ payload, user }: DashboardProps) {
  if (!user) {
    redirect('/admin/login?redirect=/admin')
  }

  const [site, expertise, partners, memberships, media, newMessages, activeMessages] =
    await Promise.all([
      payload.findGlobal({
        slug: 'site-content',
        locale: 'tr',
        fallbackLocale: 'tr',
        depth: 0,
      }),
      payload.count({ collection: 'expertise-items' }),
      payload.count({ collection: 'partners', where: { active: { equals: true } } }),
      payload.count({ collection: 'memberships', where: { active: { equals: true } } }),
      payload.count({ collection: 'media' }),
      payload.count({ collection: 'messages', where: { status: { equals: 'new' } } }),
      payload.count({ collection: 'messages', where: { status: { equals: 'inProgress' } } }),
    ])

  const previewSecret = process.env.PREVIEW_SECRET || ''
  const previewHref = previewSecret
    ? `/api/draft?secret=${encodeURIComponent(previewSecret)}&redirect=/`
    : '/'
  const globalHref = '/admin/globals/site-content'
  const attention = newMessages.totalDocs + activeMessages.totalDocs

  const contentMap: ContentMapItem[] = [
    {
      code: '01',
      eyebrow: 'İlk ekran',
      title: cleanText(site.heroTitle, 'Açılış slider alanı'),
      description: cleanText(
        site.heroDescription,
        'Açılış başlığı, açıklaması ve ziyaretçiyi karşılayan ilk mesaj.',
      ),
      image: '/assets/aircraft-hero-poster.webp',
      href: `${globalHref}?locale=tr`,
      hrefEn: `${globalHref}?locale=en`,
      meta: 'Site içeriği · Ana sayfa',
      tone: 'dark',
    },
    {
      code: '02',
      eyebrow: 'Kurumsal anlatı',
      title: cleanText(site.aboutTitle, 'Hakkımızda'),
      description: cleanText(
        site.aboutDescription,
        'Şirket tanıtımı, hedefi, vizyonu, misyonu ve değerleri.',
      ),
      image: '/assets/carbon-weave.jpg',
      href: `${globalHref}?locale=tr`,
      hrefEn: `${globalHref}?locale=en`,
      meta: 'Site içeriği · Kurumsal',
      tone: 'dark',
    },
    {
      code: '03',
      eyebrow: 'Yetkinlik kataloğu',
      title: cleanText(site.expertiseTitle, 'Uzmanlıklar'),
      description: 'Ziyaretçiye sunulan mühendislik, tasarım ve üretim yetkinlik kartları.',
      image: '/assets/automotive-composite-hero.webp',
      href: '/admin/collections/expertise-items',
      meta: `${expertise.totalDocs} içerik kartı`,
      tone: 'dark',
    },
    {
      code: '04',
      eyebrow: 'Üretim ve süreç',
      title: cleanText(site.processTitle, 'Uçtan uca süreç'),
      description:
        'Mühendislik, üretim, süreç, sektörel çözümler ve bölüm görünürlük sırası.',
      image: '/assets/automotive-composite-manufacturing.webp',
      href: `${globalHref}?locale=tr`,
      hrefEn: `${globalHref}?locale=en`,
      meta: 'Site içeriği · Bölümler ve düzen',
      tone: 'dark',
    },
    {
      code: '05',
      eyebrow: 'Kurumsal ağ',
      title: cleanText(site.referencesTitle, 'İş ortakları ve referanslar'),
      description: cleanText(
        site.referencesText,
        'Ana sayfada yayınlanan kurum logoları, bağlantıları ve sıralaması.',
      ),
      href: '/admin/collections/partners',
      meta: `${partners.totalDocs} aktif kurum`,
      tone: 'light',
    },
    {
      code: '06',
      eyebrow: 'Kurumsal ağ',
      title: cleanText(site.membershipsTitle, 'Üyelikler'),
      description: cleanText(
        site.membershipsText,
        'Üyesi olunan kurumlar, ağlar, logolar ve kart görünümleri.',
      ),
      href: '/admin/collections/memberships',
      meta: `${memberships.totalDocs} aktif üyelik`,
      tone: 'light',
    },
    {
      code: '07',
      eyebrow: 'İletişim ve footer',
      title: cleanText(site.contactTitle, 'İletişim'),
      description: `${cleanText(site.email, 'Kurumsal e-posta')} · ${cleanText(site.phone, 'Kurumsal telefon')}`,
      href: `${globalHref}?locale=tr`,
      hrefEn: `${globalHref}?locale=en`,
      meta: 'Adresler · iletişim · alt bilgi',
      tone: 'light',
    },
  ]

  const quickModules: QuickModule[] = [
    {
      code: '01',
      title: 'Ana sayfa ve kurumsal',
      description: 'Hero, kurumsal anlatı, süreç ve SEO metinleri',
      href: '/admin/globals/site-content?locale=tr',
      icon: 'content',
    },
    {
      code: '02',
      title: 'Arayüz ve sistem metinleri',
      description: 'Header, footer, butonlar ve form bildirimleri',
      href: '/admin/globals/site-settings?locale=tr',
      icon: 'settings',
    },
    {
      code: '03',
      title: 'Uzmanlıklar',
      description: 'Yetkinlik kartları ve sıralama',
      href: '/admin/collections/expertise-items',
      count: `${expertise.totalDocs} kayıt`,
      icon: 'expertise',
    },
    {
      code: '04',
      title: 'İş ortakları',
      description: 'Referans logoları, bağlantılar ve görünürlük',
      href: '/admin/collections/partners',
      count: `${partners.totalDocs} aktif`,
      icon: 'partners',
    },
    {
      code: '05',
      title: 'Üyelikler',
      description: 'Kurumsal ağ ve üyelik kartları',
      href: '/admin/collections/memberships',
      count: `${memberships.totalDocs} aktif`,
      icon: 'memberships',
    },
    {
      code: '06',
      title: 'Proje talepleri',
      description: 'Gelen kutusu, durum ve takip işlemleri',
      href: '/admin/collections/messages',
      count: `${attention} bekliyor`,
      icon: 'messages',
    },
    {
      code: '07',
      title: 'Medya kütüphanesi',
      description: 'Görsel, logo, video ve belgeler',
      href: '/admin/collections/media',
      count: `${media.totalDocs} dosya`,
      icon: 'media',
    },
    {
      code: '08',
      title: 'Kullanıcı ve yetkiler',
      description: 'Panel erişimleri ve editör rolleri',
      href: '/admin/collections/users',
      icon: 'users',
    },
  ]

  return (
    <main className="bax-studio">
      <header className="bax-studio__masthead">
        <div className="bax-studio__intro">
          <span className="bax-kicker">BAX COMPOSITES / İÇERİK OPERASYON MERKEZİ</span>
          <h1>Web sitesi yönetimi</h1>
          <p>
            İçerikleri gerçek site akışına göre yönetin, taslakları önizleyin ve her modüle
            tek tıkla ulaşın.
          </p>
          <div className="bax-studio__primary-actions">
            <a className="bax-preview-action" href={previewHref} target="_blank" rel="noreferrer">
              {previewIcon}
              <span>
                <strong>Siteyi Önizle</strong>
                <small>Draft Mode ile yeni sekmede aç</small>
              </span>
              <b aria-hidden="true">↗</b>
            </a>
            <a className="bax-secondary-action" href="/admin/globals/site-content?locale=tr">
              {quickEditIcon}
              Ana sayfayı düzenle
            </a>
          </div>
        </div>

        <div className="bax-studio__signals" aria-label="Sistem özeti">
          <a href="/admin/collections/messages">
            <strong>{attention}</strong>
            <span>Takip bekleyen talep</span>
          </a>
          <a href="/admin/collections/media">
            <strong>{media.totalDocs}</strong>
            <span>Medya dosyası</span>
          </a>
        </div>
      </header>

      <section className="bax-quick-modules" aria-labelledby="quick-modules-title">
        <header className="bax-section-heading">
          <div>
            <span className="bax-kicker">HIZLI ERİŞİM</span>
            <h2 id="quick-modules-title">Yönetim modülleri</h2>
          </div>
          <p>En sık kullanılan içerik alanlarına doğrudan gidin.</p>
        </header>

        <div className="bax-quick-modules__grid">
          {quickModules.map((module) => (
            <article className="bax-module-card" key={module.code}>
              <div className="bax-module-card__icon">
                <ModuleIcon name={module.icon} />
              </div>
              <div className="bax-module-card__body">
                <span>{module.code}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              {module.count && <small>{module.count}</small>}
              <a href={module.href} aria-label={`${module.title}: doğrudan düzenle`}>
                {quickEditIcon}
                <span>Doğrudan Düzenle</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bax-site-map" aria-labelledby="site-map-title">
        <header className="bax-section-heading">
          <div>
            <span className="bax-kicker">YAYIN AKIŞI</span>
            <h2 id="site-map-title">Ana web sitesi içerik haritası</h2>
          </div>
          <p>Yukarıdan aşağıya, ziyaretçinin sitede gördüğü sırayla.</p>
        </header>

        <div className="bax-site-map__list">
          {contentMap.map((item) => (
            <article className={`bax-content-row bax-content-row--${item.tone}`} key={item.code}>
              <div
                className="bax-content-row__visual"
                style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined}
                aria-hidden="true"
              >
                <span>{item.code}</span>
              </div>
              <div className="bax-content-row__body">
                <span>{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="bax-content-row__meta">
                <span>YÖNETİLEN ALAN</span>
                <strong>{item.meta}</strong>
              </div>
              <div className="bax-content-row__actions">
                {item.hrefEn && (
                  <a href={item.hrefEn} aria-label={`${item.title} İngilizce içeriğini düzenle`}>
                    EN
                  </a>
                )}
                <a href={item.href} aria-label={`${item.title} içeriğini doğrudan düzenle`}>
                  {quickEditIcon}
                  <span>Düzenle</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
