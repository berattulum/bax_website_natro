import type { AdminViewServerProps, PayloadRequest } from 'payload'

import ProductShell from './ProductShell'
import { requireProductUser } from './product-auth'

const libraryTypes = [
  { collection: 'expertise-items', title: 'Yetkinlikler', description: 'Mühendislik ve üretim kabiliyet kartları.' },
  { collection: 'partners', title: 'İş Ortakları', description: 'Stratejik ortaklar, referanslar ve kurum logoları.' },
  { collection: 'memberships', title: 'Ağlar ve Üyelikler', description: 'Sektörel ağlar ve kurumsal üyelik kayıtları.' },
] as const

async function getCount(req: PayloadRequest, collection: typeof libraryTypes[number]['collection']) {
  return (await req.payload.count({ collection, overrideAccess: false, req })).totalDocs
}

export default async function LibraryView({ initPageResult }: AdminViewServerProps) {
  const user = requireProductUser(initPageResult)
  const counts = await Promise.all(libraryTypes.map((item) => getCount(initPageResult.req, item.collection)))

  return (
    <ProductShell userEmail={user.email}>
      <main className="bx-screen">
        <header className="bx-screen__heading"><div><span>Yapılandırılmış içerik</span><h1>İçerik Kütüphanesi</h1><p>Birden fazla sayfada tekrar kullanılan kurumsal kayıtlar.</p></div></header>
        <section className="bx-library" aria-label="İçerik türleri">
          {libraryTypes.map((item, index) => (
            <a href={`/admin/collections/${item.collection}`} key={item.collection}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h2>{item.title}</h2><p>{item.description}</p></div>
              <strong>{counts[index]}<small> kayıt</small></strong>
              <b aria-hidden="true">→</b>
            </a>
          ))}
        </section>
      </main>
    </ProductShell>
  )
}
