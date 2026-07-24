import type { Payload } from 'payload'
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
    allMessages,
    newMessages,
    inProgressMessages,
    repliedMessages,
    recentMessages,
  ] = await Promise.all([
    payload.count({ collection: 'expertise-items' }),
    payload.count({ collection: 'partners', where: { active: { equals: true } } }),
    payload.count({ collection: 'memberships', where: { active: { equals: true } } }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'messages' }),
    payload.count({ collection: 'messages', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'messages', where: { status: { equals: 'inProgress' } } }),
    payload.count({ collection: 'messages', where: { status: { equals: 'replied' } } }),
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

  const contentTotal =
    expertise.totalDocs + partners.totalDocs + memberships.totalDocs
  const attentionTotal = newMessages.totalDocs + inProgressMessages.totalDocs
  const responseRate =
    allMessages.totalDocs > 0
      ? Math.round((repliedMessages.totalDocs / allMessages.totalDocs) * 100)
      : 100

  const operationalMetrics = [
    {
      label: 'Bekleyen iş',
      value: attentionTotal,
      detail: `${newMessages.totalDocs} yeni · ${inProgressMessages.totalDocs} işlemde`,
      tone: attentionTotal > 0 ? 'warning' : 'positive',
    },
    {
      label: 'Yönetilen içerik',
      value: contentTotal,
      detail: 'Uzmanlık, iş ortağı ve üyelik',
    },
    {
      label: 'Medya varlığı',
      value: media.totalDocs,
      detail: 'Görsel, video, logo ve belge',
    },
    {
      label: 'Yanıtlama oranı',
      value: `%${responseRate}`,
      detail: `${repliedMessages.totalDocs} talep yanıtlandı`,
      tone: 'positive',
    },
  ]

  const workspaces = [
    {
      code: '01',
      title: 'Site içeriği',
      description: 'Ana sayfa metinleri, TR/EN içerikler, SEO ve bölüm sırası.',
      href: '/admin/globals/site-content',
      action: 'İçeriği düzenle',
      meta: 'Tek merkez',
    },
    {
      code: '02',
      title: 'Uzmanlık alanları',
      description: 'Hizmet kartlarının başlık, açıklama ve sıralamasını yönetin.',
      href: '/admin/collections/expertise-items',
      createHref: '/admin/collections/expertise-items/create',
      action: 'Listeyi aç',
      meta: `${expertise.totalDocs} kayıt`,
    },
    {
      code: '03',
      title: 'İş ortakları',
      description: 'Referans kurumları, logoları, bağlantıları ve görünürlüğü yönetin.',
      href: '/admin/collections/partners',
      createHref: '/admin/collections/partners/create',
      action: 'Listeyi aç',
      meta: `${partners.totalDocs} aktif`,
    },
    {
      code: '04',
      title: 'Üyelikler',
      description: 'Kurumsal ağları, üyelik türlerini, logoları ve kart stilini yönetin.',
      href: '/admin/collections/memberships',
      createHref: '/admin/collections/memberships/create',
      action: 'Listeyi aç',
      meta: `${memberships.totalDocs} aktif`,
    },
    {
      code: '05',
      title: 'Medya kütüphanesi',
      description: 'Yayınlanacak görsel, video, logo ve belgeleri tek yerde yönetin.',
      href: '/admin/collections/media',
      createHref: '/admin/collections/media/create',
      action: 'Kütüphaneyi aç',
      meta: `${media.totalDocs} dosya`,
    },
  ]

  return (
    <main className="bax-dashboard">
      <header className="bax-command">
        <div className="bax-command__identity">
          <span className="bax-command__index">BAX / CMS</span>
          <div>
            <p>Operasyon merkezi</p>
            <h1>İçerik kontrol paneli</h1>
          </div>
        </div>
        <div className="bax-command__status">
          <span className="bax-live-dot" aria-hidden="true" />
          <div>
            <strong>Sistem çevrimiçi</strong>
            <span>Veritabanı ve web sitesi bağlı</span>
          </div>
        </div>
        <div className="bax-command__actions">
          <a className="bax-button" href="/" target="_blank" rel="noreferrer">
            Siteyi görüntüle ↗
          </a>
          <a
            className="bax-button bax-button--primary"
            href="/admin/globals/site-content"
          >
            İçeriği düzenle
          </a>
        </div>
      </header>

      <section className="bax-priority" aria-labelledby="priority-title">
        <div className="bax-priority__copy">
          <span className="bax-section-code">GÜNLÜK AKIŞ</span>
          <h2 id="priority-title">
            {attentionTotal > 0
              ? `${attentionTotal} iş dikkat bekliyor`
              : 'Bugün için bekleyen iş yok'}
          </h2>
          <p>
            Önce yeni talepleri değerlendirin, ardından içerik değişikliklerini
            iki dilde kontrol ederek yayınlayın.
          </p>
        </div>
        <ol className="bax-flow">
          <li className={newMessages.totalDocs > 0 ? 'is-active' : 'is-complete'}>
            <span>01</span>
            <div>
              <strong>Yeni talepleri incele</strong>
              <small>{newMessages.totalDocs} yeni kayıt</small>
            </div>
            <a href="/admin/collections/messages?where[status][equals]=new">
              Aç
            </a>
          </li>
          <li className={inProgressMessages.totalDocs > 0 ? 'is-active' : ''}>
            <span>02</span>
            <div>
              <strong>Devam eden işleri tamamla</strong>
              <small>{inProgressMessages.totalDocs} işlemde</small>
            </div>
            <a href="/admin/collections/messages?where[status][equals]=inProgress">
              Aç
            </a>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>TR / EN içerikleri kontrol et</strong>
              <small>Yayın öncesi dil kontrolü</small>
            </div>
            <a href="/admin/globals/site-content">Kontrol et</a>
          </li>
          <li>
            <span>04</span>
            <div>
              <strong>Canlı siteyi doğrula</strong>
              <small>Masaüstü ve mobil görünüm</small>
            </div>
            <a href="/" target="_blank" rel="noreferrer">Görüntüle ↗</a>
          </li>
        </ol>
      </section>

      <section className="bax-metrics" aria-label="Operasyon özeti">
        {operationalMetrics.map((metric) => (
          <article
            className={`bax-metric${metric.tone ? ` bax-metric--${metric.tone}` : ''}`}
            key={metric.label}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <div className="bax-dashboard__columns">
        <section className="bax-panel bax-panel--workspace">
          <div className="bax-panel__heading">
            <div>
              <span className="bax-section-code">İÇERİK OPERASYONLARI</span>
              <h2>Çalışma alanları</h2>
            </div>
            <span className="bax-panel__meta">5 MODÜL</span>
          </div>
          <div className="bax-workspaces">
            {workspaces.map((workspace) => (
              <article className="bax-workspace" key={workspace.code}>
                <span className="bax-workspace__code">{workspace.code}</span>
                <div className="bax-workspace__body">
                  <div>
                    <h3>{workspace.title}</h3>
                    <span>{workspace.meta}</span>
                  </div>
                  <p>{workspace.description}</p>
                </div>
                <div className="bax-workspace__actions">
                  {workspace.createHref && (
                    <a
                      className="bax-icon-action"
                      href={workspace.createHref}
                      aria-label={`${workspace.title} alanına yeni kayıt ekle`}
                      title="Yeni kayıt ekle"
                    >
                      +
                    </a>
                  )}
                  <a href={workspace.href}>{workspace.action} →</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="bax-dashboard__rail">
          <section className="bax-panel">
            <div className="bax-panel__heading">
              <div>
                <span className="bax-section-code">GELEN KUTUSU</span>
                <h2>Son proje talepleri</h2>
              </div>
              <a href="/admin/collections/messages">Tümü →</a>
            </div>
            {recentMessages.docs.length > 0 ? (
              <div className="bax-message-list">
                {recentMessages.docs.map((message) => {
                  const status = displayText(message.status, 'new')

                  return (
                    <a
                      href={`/admin/collections/messages/${String(message.id)}`}
                      key={String(message.id)}
                    >
                      <div className="bax-message-list__main">
                        <strong>{displayText(message.subject, 'Konusuz talep')}</strong>
                        <span>
                          {displayText(message.company, displayText(message.name))}
                        </span>
                      </div>
                      <div className="bax-message-list__meta">
                        <span className={`bax-status bax-status--${status}`}>
                          {statusLabels[status] || status}
                        </span>
                        <time>{formatDate(message.createdAt)}</time>
                      </div>
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

          <section className="bax-panel bax-checklist">
            <div className="bax-panel__heading">
              <div>
                <span className="bax-section-code">YAYIN GÜVENLİĞİ</span>
                <h2>Değişiklik kontrolü</h2>
              </div>
            </div>
            <ul>
              <li><span>01</span> Türkçe ve İngilizce alanları birlikte tamamlayın.</li>
              <li><span>02</span> Logolarda şeffaf ve yüksek çözünürlüklü dosya kullanın.</li>
              <li><span>03</span> Silmek yerine “Sitede göster” seçeneğini kapatın.</li>
              <li><span>04</span> Değişiklikten sonra canlı siteyi mobilde kontrol edin.</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}
