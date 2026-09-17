import { redirect } from 'next/navigation'
import type { AdminViewServerProps, PayloadRequest } from 'payload'

import ProductShell from './ProductShell'

async function count(req: PayloadRequest, collection: 'media' | 'messages') {
  const result = await req.payload.count({ collection, overrideAccess: false, req })
  return result.totalDocs
}

export default async function OverviewView({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login')

  const [messages, media] = await Promise.all([count(req, 'messages'), count(req, 'media')])

  return (
    <ProductShell userEmail={req.user.email}>
      <main className="bx-screen bx-overview">
        <header className="bx-screen__heading">
          <div><span>Bugün</span><h1>Genel Bakış</h1><p>Yalnızca ilgilenmeniz gereken işler ve güncel hareketler.</p></div>
        </header>

        <section className="bx-work-queue" aria-labelledby="work-queue-title">
          <div className="bx-section-title"><span>01</span><div><h2 id="work-queue-title">Çalışma kuyruğu</h2><p>Yayın öncesinde dikkat isteyen alanlar.</p></div></div>
          <div className="bx-work-queue__items">
            <a href="/admin/pages"><strong>3</strong><span>CMS’ye aktarılacak sayfa</span><small>Kurucu, Kurumsal Bilgiler, Sürdürülebilirlik</small></a>
            <a href="/admin/inbox"><strong>{messages}</strong><span>Toplam proje talebi</span><small>Gelen kutusunu ve takip durumlarını aç</small></a>
            <a href="/admin/assets"><strong>{media}</strong><span>Medya dosyası</span><small>Kullanım ve dosya durumunu incele</small></a>
          </div>
        </section>

        <section className="bx-overview__flow" aria-labelledby="flow-title">
          <div className="bx-section-title"><span>02</span><div><h2 id="flow-title">Yayın akışı</h2><p>İçeriğin sitede görünmesine kadar izlenecek yol.</p></div></div>
          <ol>
            <li><span>1</span><div><strong>İçeriği düzenle</strong><small>Sayfa veya kütüphane kaydında çalışın.</small></div></li>
            <li><span>2</span><div><strong>TR + EN kontrolü</strong><small>Eksik çevirileri yayın öncesinde tamamlayın.</small></div></li>
            <li><span>3</span><div><strong>Önizle ve yayınla</strong><small>Gerçek sayfada doğrulayıp yayına alın.</small></div></li>
          </ol>
        </section>
      </main>
    </ProductShell>
  )
}
