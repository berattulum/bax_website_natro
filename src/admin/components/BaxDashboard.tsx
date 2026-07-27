import type { Payload } from 'payload'
import VisualSiteEditor from './VisualSiteEditor'
import './admin-brand.scss'

type DashboardProps = {
  payload: Payload
}

const statusLabels: Record<string, string> = {
  new: 'Yeni',
  inProgress: 'İşlemde',
  replied: 'Yanıtlandı',
  closed: 'Kapatıldı',
}

const displayText = (value: unknown, fallback = 'Belirtilmedi') =>
  typeof value === 'string' && value.trim() ? value : fallback

const formatDate = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

export default async function BaxDashboard({ payload }: DashboardProps) {
  const [
    expertise,
    partners,
    memberships,
    media,
    newMessages,
    inProgressMessages,
    recentMessages,
  ] = await Promise.all([
    payload.count({ collection: 'expertise-items' }),
    payload.count({ collection: 'partners', where: { active: { equals: true } } }),
    payload.count({ collection: 'memberships', where: { active: { equals: true } } }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'messages', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'messages', where: { status: { equals: 'inProgress' } } }),
    payload.find({
      collection: 'messages',
      depth: 0,
      limit: 5,
      sort: '-createdAt',
      select: {
        company: true,
        createdAt: true,
        name: true,
        status: true,
        subject: true,
      },
    }),
  ])

  const attentionTotal = newMessages.totalDocs + inProgressMessages.totalDocs
  const quickActions = [
    {
      code: '01',
      label: 'Site içeriği',
      detail: 'Metinler, adresler, SEO ve bölüm sırası',
      meta: 'TR / EN',
      href: '/admin/globals/site-content',
    },
    {
      code: '02',
      label: 'Uzmanlıklar',
      detail: 'Hizmet kartları ve açıklamaları',
      meta: `${expertise.totalDocs} kayıt`,
      href: '/admin/collections/expertise-items',
    },
    {
      code: '03',
      label: 'İş ortakları',
      detail: 'Referans logoları ve bağlantıları',
      meta: `${partners.totalDocs} aktif`,
      href: '/admin/collections/partners',
    },
    {
      code: '04',
      label: 'Üyelikler',
      detail: 'Kurumsal ağlar ve üyelik kartları',
      meta: `${memberships.totalDocs} aktif`,
      href: '/admin/collections/memberships',
    },
    {
      code: '05',
      label: 'Medya',
      detail: 'Görsel, video, logo ve belgeler',
      meta: `${media.totalDocs} dosya`,
      href: '/admin/collections/media',
    },
  ]

  return (
    <main className="bax-dashboard">
      <header className="bax-command">
        <div className="bax-command__identity">
          <span className="bax-command__index">BAX / CMS</span>
          <div>
            <p>Web sitesi yönetimi</p>
            <h1>İçerik çalışma alanı</h1>
          </div>
        </div>
        <div className="bax-command__summary">
          <span className={attentionTotal > 0 ? 'has-attention' : ''}>
            {attentionTotal}
          </span>
          <div>
            <strong>Takip bekleyen talep</strong>
            <small>{newMessages.totalDocs} yeni · {inProgressMessages.totalDocs} işlemde</small>
          </div>
        </div>
        <a className="bax-button" href="/" target="_blank" rel="noreferrer">
          Canlı siteyi aç ↗
        </a>
      </header>

      <VisualSiteEditor />

      <section className="bax-action-strip" aria-labelledby="quick-actions-title">
        <header>
          <span className="bax-section-code">HIZLI İŞLEMLER</span>
          <h2 id="quick-actions-title">Doğrudan yönetim alanları</h2>
        </header>
        <div className="bax-action-list">
          {quickActions.map((action) => (
            <a href={action.href} key={action.code}>
              <span>{action.code}</span>
              <div>
                <strong>{action.label}</strong>
                <small>{action.detail}</small>
              </div>
              <em>{action.meta}</em>
              <b aria-hidden="true">→</b>
            </a>
          ))}
        </div>
      </section>

      <section className="bax-inbox" aria-labelledby="inbox-title">
        <header>
          <div>
            <span className="bax-section-code">GELEN KUTUSU</span>
            <h2 id="inbox-title">Son proje talepleri</h2>
          </div>
          <a href="/admin/collections/messages">Tüm talepleri aç →</a>
        </header>
        {recentMessages.docs.length > 0 ? (
          <div className="bax-inbox-table">
            <div className="bax-inbox-table__head">
              <span>Talep</span>
              <span>Gönderen</span>
              <span>Durum</span>
              <span>Tarih</span>
              <span />
            </div>
            {recentMessages.docs.map((message) => {
              const status = displayText(message.status, 'new')
              return (
                <a
                  href={`/admin/collections/messages/${String(message.id)}`}
                  key={String(message.id)}
                >
                  <strong>{displayText(message.subject, 'Konusuz talep')}</strong>
                  <span>{displayText(message.company, displayText(message.name))}</span>
                  <span className={`bax-status bax-status--${status}`}>
                    {statusLabels[status] || status}
                  </span>
                  <time>{formatDate(message.createdAt)}</time>
                  <b aria-hidden="true">→</b>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="bax-empty-state">
            <strong>Henüz bir talep bulunmuyor.</strong>
            <span>Yeni form gönderimleri burada görüntülenecek.</span>
          </div>
        )}
      </section>

      <footer className="bax-safety-line">
        <strong>Güvenli çalışma:</strong>
        <span>İçeriği silmek yerine görünürlüğünü kapatın.</span>
        <span>Türkçe ve İngilizce alanları birlikte kontrol edin.</span>
        <span>Değişiklik sonrası mobil önizlemeyi doğrulayın.</span>
      </footer>
    </main>
  )
}
