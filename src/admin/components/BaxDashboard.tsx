import type { Payload } from 'payload'
import './admin-brand.scss'

type DashboardProps = {
  payload: Payload
}

type WorkspaceItem = {
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

const text = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.replace(/<br\s*\/?>/gi, ' ') : fallback

export default async function BaxDashboard({ payload }: DashboardProps) {
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

  const globalHref = '/admin/globals/site-content'
  const workspace: WorkspaceItem[] = [
    {
      code: '01',
      eyebrow: 'İlk ekran',
      title: text(site.heroTitle, 'Açılış slider alanı'),
      description: text(
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
      title: text(site.aboutTitle, 'Hakkımızda'),
      description: text(
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
      title: text(site.expertiseTitle, 'Uzmanlıklar'),
      description:
        'Ziyaretçiye sunulan mühendislik, tasarım ve üretim yetkinlik kartları.',
      image: '/assets/automotive-composite-hero.webp',
      href: '/admin/collections/expertise-items',
      meta: `${expertise.totalDocs} içerik kartı`,
      tone: 'dark',
    },
    {
      code: '04',
      eyebrow: 'Üretim ve süreç',
      title: text(site.processTitle, 'Uçtan uca süreç'),
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
      title: text(site.referencesTitle, 'İş ortakları ve referanslar'),
      description: text(
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
      title: text(site.membershipsTitle, 'Üyelikler'),
      description: text(
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
      title: text(site.contactTitle, 'İletişim'),
      description: `${text(site.email, 'Kurumsal e-posta')} · ${text(site.phone, 'Kurumsal telefon')}`,
      href: `${globalHref}?locale=tr`,
      hrefEn: `${globalHref}?locale=en`,
      meta: 'Adresler · iletişim · alt bilgi',
      tone: 'light',
    },
  ]

  const attention = newMessages.totalDocs + activeMessages.totalDocs

  return (
    <main className="bax-studio">
      <header className="bax-studio__masthead">
        <div>
          <span className="bax-kicker">BAX COMPOSITES / İÇERİK OPERASYON MERKEZİ</span>
          <h1>Web sitesi yönetimi</h1>
          <p>
            Sitedeki her bölüm, gerçek içeriği ve yönetim bağlantısıyla tek çalışma
            alanında.
          </p>
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

      <section className="bax-site-map" aria-labelledby="site-map-title">
        <header className="bax-site-map__header">
          <div>
            <span className="bax-kicker">YAYIN AKIŞI</span>
            <h2 id="site-map-title">Ana web sitesi içerik haritası</h2>
          </div>
          <p>Yukarıdan aşağıya, ziyaretçinin sitede gördüğü sırayla.</p>
        </header>

        <div className="bax-site-map__list">
          {workspace.map((item) => (
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
                <a href={item.href} aria-label={`${item.title} içeriğini düzenle`}>
                  Düzenle <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bax-operations" aria-labelledby="operations-title">
        <header>
          <span className="bax-kicker">OPERASYON</span>
          <h2 id="operations-title">Günlük yönetim</h2>
        </header>
        <div>
          <a href="/admin/collections/messages">
            <span>01</span>
            <strong>Proje talepleri</strong>
            <small>{newMessages.totalDocs} yeni · {activeMessages.totalDocs} işlemde</small>
            <b aria-hidden="true">→</b>
          </a>
          <a href="/admin/collections/media">
            <span>02</span>
            <strong>Medya kütüphanesi</strong>
            <small>{media.totalDocs} görsel, logo, video veya belge</small>
            <b aria-hidden="true">→</b>
          </a>
          <a href="/admin/collections/users">
            <span>03</span>
            <strong>Kullanıcı ve yetkiler</strong>
            <small>Panel erişimleri ve editör rolleri</small>
            <b aria-hidden="true">→</b>
          </a>
        </div>
      </section>
    </main>
  )
}
