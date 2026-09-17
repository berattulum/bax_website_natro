import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'

import ProductShell from './ProductShell'
import { websitePages } from './product-data'

export default function PagesView({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login')

  return (
    <ProductShell userEmail={req.user.email}>
      <main className="bx-screen bx-pages">
        <header className="bx-screen__heading bx-screen__heading--split">
          <div><span>Web sitesi</span><h1>Sayfalar</h1><p>Her kart gerçek web sayfasının güncel görünümünü temsil eder.</p></div>
          <div className="bx-pages__summary"><strong>{websitePages.length}</strong><span>yayındaki sayfa</span></div>
        </header>

        <section className="bx-pages__grid" aria-label="Web sitesi sayfaları">
          {websitePages.map((page, index) => (
            <article className="bx-page" key={page.route}>
              <a className="bx-page__preview" href={page.route} rel="noreferrer" target="_blank">
                <img alt={`${page.title} sayfasının güncel görünümü`} src={page.preview} />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </a>
              <div className="bx-page__content">
                <div className="bx-page__heading"><div><h2>{page.title}</h2><p>{page.description}</p></div><span className={`is-${page.contentState}`}>{page.contentState === 'managed' ? 'CMS bağlı' : 'Aktarım bekliyor'}</span></div>
                <div className="bx-page__footer"><span>TR + EN</span><div>{page.editHref && <a href={page.editHref}>Düzenle</a>}<a href={page.route} rel="noreferrer" target="_blank">Sayfayı aç ↗</a></div></div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </ProductShell>
  )
}
