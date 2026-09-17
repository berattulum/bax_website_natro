import type { AdminViewServerProps } from 'payload'

import ProductShell from './ProductShell'
import { requireProductUser } from './product-auth'

export default async function InboxView({ initPageResult }: AdminViewServerProps) {
  const user = requireProductUser(initPageResult)
  const result = await initPageResult.req.payload.find({ collection: 'messages', limit: 30, sort: '-createdAt', overrideAccess: false, req: initPageResult.req })

  return (
    <ProductShell userEmail={user.email}>
      <main className="bx-screen">
        <header className="bx-screen__heading bx-screen__heading--split"><div><span>Operasyon</span><h1>Mesajlar</h1><p>Web sitesinden gelen proje ve iletişim taleplerini takip edin.</p></div><a className="bx-primary-link" href="/admin/collections/messages/create">Yeni kayıt</a></header>
        <section className="bx-table" aria-label="Gelen mesajlar">
          <div className="bx-table__head"><span>Durum</span><span>Gönderen</span><span>Konu</span><span>Tarih</span><span /></div>
          {result.docs.map((doc) => (
            <a className="bx-table__row" href={`/admin/collections/messages/${doc.id}`} key={doc.id}>
              <span className={`bx-state is-${doc.status || 'new'}`}>{doc.status || 'Yeni'}</span>
              <span><strong>{doc.name}</strong><small>{doc.company || doc.email}</small></span>
              <span>{doc.subject}</span>
              <span>{new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(doc.createdAt))}</span>
              <b aria-hidden="true">→</b>
            </a>
          ))}
          {result.docs.length === 0 && <p className="bx-empty">Henüz gelen mesaj bulunmuyor.</p>}
        </section>
      </main>
    </ProductShell>
  )
}
