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

export default async function BaxDashboard({ payload }: DashboardProps) {
  const [
    expertise,
    partners,
    memberships,
    media,
    newMessages,
    recentMessages,
  ] = await Promise.all([
    payload.count({ collection: 'expertise-items' }),
    payload.count({ collection: 'partners', where: { active: { equals: true } } }),
    payload.count({ collection: 'memberships', where: { active: { equals: true } } }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'messages', where: { status: { equals: 'new' } } }),
    payload.find({
      collection: 'messages',
      depth: 0,
      limit: 4,
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

  const metrics = [
    { label: 'Yeni talep', value: newMessages.totalDocs, tone: 'accent' },
    { label: 'Aktif iş ortağı', value: partners.totalDocs },
    { label: 'Aktif üyelik', value: memberships.totalDocs },
    { label: 'Medya dosyası', value: media.totalDocs },
  ]

  return (
    <div className="bax-dashboard">
      <section className="bax-dashboard__hero">
        <div>
          <p className="bax-dashboard__eyebrow">BaX İçerik Merkezi</p>
          <h1>İyi çalışmalar.</h1>
          <p>
            Site içeriklerini, kurumsal ilişkileri ve gelen proje taleplerini
            tek merkezden güvenle yönetin.
          </p>
        </div>
        <div className="bax-dashboard__hero-actions">
          <a className="bax-button bax-button--primary" href="/admin/globals/site-content">
            Site içeriğini düzenle
          </a>
          <a className="bax-button" href="/admin/collections/messages">
            Talepleri görüntüle
          </a>
        </div>
      </section>

      <section className="bax-metrics" aria-label="İçerik özeti">
        {metrics.map((metric) => (
          <article
            className={`bax-metric${metric.tone ? ` bax-metric--${metric.tone}` : ''}`}
            key={metric.label}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <div className="bax-dashboard__grid">
        <section className="bax-panel">
          <div className="bax-panel__heading">
            <div>
              <p className="bax-panel__kicker">Hızlı işlemler</p>
              <h2>Sık kullanılan alanlar</h2>
            </div>
          </div>
          <div className="bax-quick-links">
            <a href="/admin/globals/site-content">
              <strong>Ana sayfa metinleri</strong>
              <span>TR/EN metinler, SEO ve bölüm sırası</span>
            </a>
            <a href="/admin/collections/partners">
              <strong>İş ortakları</strong>
              <span>Logo, bağlantı ve görünürlük yönetimi</span>
            </a>
            <a href="/admin/collections/expertise-items">
              <strong>Uzmanlık alanları</strong>
              <span>{expertise.totalDocs} uzmanlık kartını düzenleyin</span>
            </a>
            <a href="/admin/collections/media">
              <strong>Medya kütüphanesi</strong>
              <span>Görsel, video, logo ve belgeler</span>
            </a>
          </div>
        </section>

        <section className="bax-panel">
          <div className="bax-panel__heading">
            <div>
              <p className="bax-panel__kicker">İletişim takibi</p>
              <h2>Son proje talepleri</h2>
            </div>
            <a href="/admin/collections/messages">Tümünü gör</a>
          </div>
          {recentMessages.docs.length > 0 ? (
            <div className="bax-message-list">
              {recentMessages.docs.map((message) => (
                <a
                  href={`/admin/collections/messages/${message.id}`}
                  key={message.id}
                >
                  <div>
                    <strong>{message.subject}</strong>
                    <span>{message.company || message.name}</span>
                  </div>
                  <span className={`bax-status bax-status--${message.status || 'new'}`}>
                    {statusLabels[message.status || 'new']}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="bax-empty-state">
              <strong>Henüz bir talep bulunmuyor.</strong>
              <span>Yeni form gönderimleri burada görüntülenecek.</span>
            </div>
          )}
        </section>
      </div>

      <section className="bax-safety-note">
        <div className="bax-safety-note__icon" aria-hidden="true">✓</div>
        <div>
          <strong>Güvenli çalışma hatırlatması</strong>
          <span>
            Bir içeriği silmek yerine “Sitede göster” seçeneğini kapatın. Büyük
            değişikliklerden önce Türkçe ve İngilizce içerikleri birlikte kontrol edin.
          </span>
        </div>
      </section>
    </div>
  )
}
