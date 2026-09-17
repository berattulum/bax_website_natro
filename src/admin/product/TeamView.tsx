import type { AdminViewServerProps } from 'payload'

import ProductShell from './ProductShell'
import { requireProductUser } from './product-auth'

export default async function TeamView({ initPageResult }: AdminViewServerProps) {
  const user = requireProductUser(initPageResult)
  const result = await initPageResult.req.payload.find({ collection: 'users', limit: 50, sort: 'email', overrideAccess: false, req: initPageResult.req })
  return (
    <ProductShell userEmail={user.email}>
      <main className="bx-screen">
        <header className="bx-screen__heading bx-screen__heading--split"><div><span>Erişim yönetimi</span><h1>Kullanıcılar</h1><p>Panele erişebilen ekip üyeleri ve yetki seviyeleri.</p></div><a className="bx-primary-link" href="/admin/collections/users/create">Kullanıcı ekle</a></header>
        <section className="bx-team" aria-label="Panel kullanıcıları">
          {result.docs.map((doc) => <a href={`/admin/collections/users/${doc.id}`} key={doc.id}><span>{doc.email.slice(0, 1).toUpperCase()}</span><div><strong>{doc.email}</strong><small>{doc.role === 'admin' ? 'Yönetici' : 'Editör'}</small></div><b aria-hidden="true">→</b></a>)}
        </section>
      </main>
    </ProductShell>
  )
}
