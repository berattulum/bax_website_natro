import type { AdminViewServerProps } from 'payload'

import ProductShell from './ProductShell'
import { requireProductUser } from './product-auth'

export default async function AssetsView({ initPageResult }: AdminViewServerProps) {
  const user = requireProductUser(initPageResult)
  const result = await initPageResult.req.payload.find({ collection: 'media', limit: 24, sort: '-createdAt', overrideAccess: false, req: initPageResult.req })

  return (
    <ProductShell userEmail={user.email}>
      <main className="bx-screen">
        <header className="bx-screen__heading bx-screen__heading--split"><div><span>Dosya yönetimi</span><h1>Medya</h1><p>Görseller, videolar, logolar ve belgeler. İçerik kayıtlarından ayrı tutulur.</p></div><a className="bx-primary-link" href="/admin/collections/media/create">Dosya yükle</a></header>
        <section className="bx-assets" aria-label="Medya dosyaları">
          {result.docs.map((doc) => (
            <a href={`/admin/collections/media/${doc.id}`} key={doc.id}>
              <figure>{doc.mimeType?.startsWith('image/') && doc.url ? <img alt={doc.alt || ''} src={doc.url} /> : <span>{doc.mimeType?.split('/')[1]?.toUpperCase() || 'DOSYA'}</span>}</figure>
              <div><strong>{doc.filename}</strong><small>{doc.mimeType}</small></div>
            </a>
          ))}
          {result.docs.length === 0 && <p className="bx-empty">Henüz medya dosyası bulunmuyor.</p>}
        </section>
      </main>
    </ProductShell>
  )
}
