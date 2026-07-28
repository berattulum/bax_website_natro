import React from 'react'
import type { AdminViewServerProps, PayloadRequest } from 'payload'

type DashboardDoc = Record<string, unknown>

type ContentMapItem = {
  index: string
  eyebrow: string
  title: string
  description: string
  area: string
  href: string
  image: string
  locale?: boolean
  status?: string
  updatedAt?: string
}

const cleanText = (value: unknown, fallback: string) => {
  if (typeof value !== 'string' || !value.trim()) return fallback

  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const formatUpdatedAt = (value?: string) => {
  if (!value) return 'Güncelleme bilgisi yok'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Güncelleme bilgisi yok'

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getDocs = async (
  req: PayloadRequest,
  collection: 'expertise-items' | 'memberships' | 'partners' | 'messages' | 'media' | 'users',
) => {
  try {
    return await req.payload.find({
      collection,
      depth: 1,
      limit: 100,
      overrideAccess: false,
      req,
    })
  } catch {
    return { docs: [], totalDocs: 0 }
  }
}

const getGlobal = async (
  req: PayloadRequest,
  slug: 'site-content' | 'site-settings',
) => {
  try {
    return (await req.payload.findGlobal({
      slug,
      depth: 1,
      draft: false,
      overrideAccess: false,
      req,
    })) as unknown as DashboardDoc
  } catch {
    return {} as DashboardDoc
  }
}

export default async function BaxDashboard({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  const [
    siteContent,
    siteSettings,
    expertise,
    partners,
    memberships,
    messages,
    media,
    users,
  ] = await Promise.all([
    getGlobal(req, 'site-content'),
    getGlobal(req, 'site-settings'),
    getDocs(req, 'expertise-items'),
    getDocs(req, 'partners'),
    getDocs(req, 'memberships'),
    getDocs(req, 'messages'),
    getDocs(req, 'media'),
    getDocs(req, 'users'),
  ])

  const pendingMessages = messages.docs.filter((doc) => {
    const status = (doc as unknown as DashboardDoc).status
    return status === 'new' || status === 'pending' || !status
  }).length

  const contentStatus = String(siteContent._status || 'published')
  const settingsStatus = String(siteSettings._status || 'published')
  const contentUpdatedAt =
    typeof siteContent.updatedAt === 'string' ? siteContent.updatedAt : undefined
  const settingsUpdatedAt =
    typeof siteSettings.updatedAt === 'string' ? siteSettings.updatedAt : undefined

  const contentMap: ContentMapItem[] = [
    {
      index: '01',
      eyebrow: 'İlk ekran',
      title: cleanText(siteContent.heroTitle, 'Tasarımdan Endüstrileştirmeye'),
      description: cleanText(
        siteContent.heroDescription,
        'Havacılık ve otomotiv için ölçeklenebilir kompozit üretim çözümleri.',
      ),
      area: 'Site içeriği · Ana sayfa',
      href: '/admin/globals/site-content?locale=tr',
      image: '/assets/img/plane-hero.webp',
      locale: true,
      status: contentStatus,
      updatedAt: contentUpdatedAt,
    },
    {
      index: '02',
      eyebrow: 'Kurumsal anlatı',
      title: cleanText(siteContent.aboutTitle, 'Geleceği Kompozit ile Şekillendiriyoruz'),
      description: cleanText(
        siteContent.aboutDescription,
        'BaX Composites kurumsal anlatısı, hedefleri ve mühendislik yaklaşımı.',
      ),
      area: 'Site içeriği · Kurumsal',
      href: '/admin/globals/site-content?locale=tr',
      image: '/assets/img/carbon-fiber-roll.webp',
      locale: true,
      status: contentStatus,
      updatedAt: contentUpdatedAt,
    },
    {
      index: '03',
      eyebrow: 'Yetkinlik kataloğu',
      title: 'Uçtan uca kompozit mühendisliği yetkinlikleri',
      description: 'Ziyaretçiye sunulan mühendislik, tasarım ve üretim yetkinlik kartları.',
      area: `${expertise.totalDocs} içerik kartı`,
      href: '/admin/collections/expertise-items',
      image: '/assets/img/automotive-hero.webp',
      status: 'published',
    },
    {
      index: '04',
      eyebrow: 'Üretim ve süreç',
      title: 'Fikirden seri üretime kontrollü ilerleme.',
      description: 'Mühendislik, üretim, süreç, sektör çözümleri ve bölüm görünürlük sırası.',
      area: 'Site içeriği · Bölümler ve düzen',
      href: '/admin/globals/site-content?locale=tr',
      image: '/assets/img/manufacturing-process.webp',
      locale: true,
      status: contentStatus,
      updatedAt: contentUpdatedAt,
    },
    {
      index: '05',
      eyebrow: 'Kurumsal ağ',
      title: 'Güçlü iş birlikleriyle birlikte büyüyoruz.',
      description: 'Referans logoları, kurumsal bağlantılar ve görünürlük ayarları.',
      area: `${partners.totalDocs} aktif kurum`,
      href: '/admin/collections/partners',
      image: '/assets/img/partners-network.webp',
      status: 'published',
    },
    {
      index: '06',
      eyebrow: 'Kurumsal ağ',
      title: 'Güçlü ağların ve inovasyon ekosisteminin içindeyiz.',
      description: 'Sektörel ağlar, meslek kuruluşları ve uluslararası programlar.',
      area: `${memberships.totalDocs} aktif üyelik`,
      href: '/admin/collections/memberships',
      image: '/assets/img/memberships-network.webp',
      status: 'published',
    },
    {
      index: '07',
      eyebrow: 'İletişim ve footer',
      title: cleanText(siteSettings.formModalTitle, 'Bir sonraki kompozit çözümü birlikte geliştirelim.'),
      description: cleanText(
        siteSettings.footerCopyright,
        'Adresler, iletişim bilgileri, yasal metinler ve footer içeriği.',
      ),
      area: 'Arayüz · İletişim · Alt bilgi',
      href: '/admin/globals/site-settings?locale=tr',
      image: '/assets/img/contact-engineering.webp',
      locale: true,
      status: settingsStatus,
      updatedAt: settingsUpdatedAt,
    },
  ]

  const priorities = [
    {
      index: '01',
      title: 'Proje talepleri',
      description: `${pendingMessages} yeni · ${Math.max(
        messages.totalDocs - pendingMessages,
        0,
      )} işlemde`,
      href: '/admin/collections/messages',
      accent: pendingMessages > 0,
    },
    {
      index: '02',
      title: 'Medya kütüphanesi',
      description: `${media.totalDocs} görsel, logo, video veya belge`,
      href: '/admin/collections/media',
    },
    {
      index: '03',
      title: 'Kullanıcı ve yetkiler',
      description: `${users.totalDocs} panel kullanıcısı`,
      href: '/admin/collections/users',
    },
  ]

  return (
    <main className="bax-dashboard">
      <section className="bax-dashboard__hero" aria-labelledby="bax-dashboard-title">
        <div>
          <p className="bax-kicker">BaX Composites / İçerik operasyon merkezi</p>
          <h1 id="bax-dashboard-title">Web sitesi yönetimi</h1>
          <p className="bax-dashboard__intro">
            Sitedeki her bölüm, gerçek içeriği ve yönetim bağlantısıyla tek çalışma alanında.
          </p>
        </div>

        <div className="bax-dashboard__signals" aria-label="Güncel operasyon özeti">
          <a href="/admin/collections/messages">
            <strong>{pendingMessages}</strong>
            <span>Takip bekleyen talep</span>
          </a>
          <a href="/admin/collections/media">
            <strong>{media.totalDocs}</strong>
            <span>Medya dosyası</span>
          </a>
        </div>
      </section>

      <section className="bax-priority" aria-labelledby="bax-priority-title">
        <div className="bax-section-heading">
          <div>
            <p className="bax-kicker">Öncelikli işlemler</p>
            <h2 id="bax-priority-title">Günlük yönetim</h2>
          </div>
          <p>Takip ve operasyon alanlarına doğrudan erişin.</p>
        </div>

        <div className="bax-priority__grid">
          {priorities.map((item) => (
            <a
              className={`bax-priority__item${item.accent ? ' is-accent' : ''}`}
              href={item.href}
              key={item.index}
            >
              <span>{item.index}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </div>
              <b aria-hidden="true">→</b>
            </a>
          ))}
        </div>
      </section>

      <section className="bax-content-map" aria-labelledby="bax-content-map-title">
        <div className="bax-section-heading">
          <div>
            <p className="bax-kicker">Yayın akışı</p>
            <h2 id="bax-content-map-title">Ana web sitesi içerik haritası</h2>
          </div>
          <p>Yukarıdan aşağıya, ziyaretçinin sitede gördüğü sırayla.</p>
        </div>

        <div className="bax-content-map__list">
          {contentMap.map((item) => (
            <article
              className="bax-content-row"
              data-status={item.status}
              key={item.index}
            >
              <a
                aria-label={`${item.title} alanını düzenle`}
                className="bax-content-row__overlay"
                href={item.href}
              >
                <span className="bax-sr-only">{item.title} alanını düzenle</span>
              </a>

              <div className="bax-content-row__visual">
                <img alt="" loading="lazy" src={item.image} />
                <span>{item.index}</span>
              </div>

              <div className="bax-content-row__body">
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <small>{item.description}</small>
              </div>

              <div className="bax-content-row__meta">
                <p>Yönetilen alan</p>
                <strong>{item.area}</strong>
                <div className="bax-content-row__state">
                  <span className={`bax-status-pill is-${item.status}`}>
                    {item.status === 'draft' ? 'Taslak' : 'Yayında'}
                  </span>
                  {item.locale && <span className="bax-locale-pill">TR + EN</span>}
                </div>
                {item.updatedAt && <small>{formatUpdatedAt(item.updatedAt)}</small>}
              </div>

              <div className="bax-content-row__actions">
                {item.locale && (
                  <a href={`${item.href.split('?')[0]}?locale=en`} lang="en">
                    EN
                  </a>
                )}
                <a className="is-primary" href={item.href}>
                  Düzenle <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
