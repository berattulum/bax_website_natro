import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

type LegalPageProps = {
  eyebrow: string
  title: string
  description: string
  pdfHref?: string
  asideTitle?: string
  asideDescription?: string
  externalHref?: string
  externalLabel?: string
  metaTitle?: string
  metaDescription?: string
  children: ReactNode
}

export function LegalPage({ eyebrow, title, description, pdfHref, asideTitle = 'Belge erişimi', asideDescription = 'İçeriği bu sayfadan okuyabilir veya kaynak PDF belgesini indirebilirsiniz.', externalHref, externalLabel, metaTitle = 'Mevcut şirket belgesi', metaDescription = 'Nihai yayından önce hukuk onayı planlanmaktadır.', children }: LegalPageProps) {
  return (
    <main className="legal-shell">
      <header className="legal-header">
        <Link href="/#home" className="legal-brand" aria-label="BaX Composites ana sayfa">
          <Image
            src="/images/bax-composites-logo-original.png"
            alt="BaX Composites"
            width={1526}
            height={781}
            priority
          />
        </Link>
        <nav aria-label="Yasal belgeler">
          <Link href="/kurumsal-bilgiler">Kurumsal Bilgiler</Link>
          <Link href="/kvkk">KVKK Merkezi</Link>
          <Link href="/cerez-politikasi">Çerez Politikası</Link>
          <Link href="/kvkk/basvuru">Başvuru</Link>
        </nav>
        <Link href="/#contact" className="legal-home-link">Ana siteye dön <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="legal-hero">
        <div>
          <span className="legal-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="legal-meta">
          <span>Sunum sürümü</span>
          <strong>{metaTitle}</strong>
          <small>{metaDescription}</small>
        </div>
      </section>

      <div className="legal-layout">
        <aside className="legal-aside">
          <span>{asideTitle}</span>
          <p>{asideDescription}</p>
          {pdfHref && <a href={pdfHref} target="_blank" rel="noreferrer" className="legal-download">
            PDF belgesini aç <span aria-hidden="true">↗</span>
          </a>}
          {externalHref && <a href={externalHref} target="_blank" rel="noreferrer" className="legal-download">
            {externalLabel || 'Kaydı doğrula'} <span aria-hidden="true">↗</span>
          </a>}
          <Link href="/kvkk" className="legal-all-link">KVKK ve yasal belgeler</Link>
        </aside>
        <article className="legal-document">{children}</article>
      </div>

      <footer className="legal-footer">
        <span>© 2026 BaX Composites Inc.</span>
        <Link href="/kurumsal-bilgiler">Kurumsal Bilgiler</Link>
        <Link href="/kvkk">KVKK ve yasal belgeler</Link>
        <Link href="/#home">baxcomposites.com</Link>
      </footer>
    </main>
  )
}

export function LegalSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="legal-section">
      <div className="legal-section-heading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <div className="legal-section-body">{children}</div>
    </section>
  )
}
