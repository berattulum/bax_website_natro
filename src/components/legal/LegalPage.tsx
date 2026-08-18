import Link from 'next/link'
import type { ReactNode } from 'react'
import { PublicFooter } from '@/components/PublicFooter'
import { CorporateHeader } from '@/components/corporate/CorporateHeader'
import styles from '@/components/institutional/InstitutionalSimple.module.css'

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
    <main className={styles.page}>
      <CorporateHeader lang="en" active="records" />
      <section className={styles.legalHero}>
        <div>
          <span className={styles.legalEyebrow}>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.meta}>
          <span>Sunum sürümü</span>
          <strong>{metaTitle}</strong>
          <small>{metaDescription}</small>
        </div>
      </section>

      <div className={styles.legalLayout}>
        <aside className={styles.aside}>
          <span>{asideTitle}</span>
          <p>{asideDescription}</p>
          {pdfHref && <a href={pdfHref} target="_blank" rel="noreferrer">
            PDF belgesini aç <span aria-hidden="true">↗</span>
          </a>}
          {externalHref && <a href={externalHref} target="_blank" rel="noreferrer">
            {externalLabel || 'Kaydı doğrula'} <span aria-hidden="true">↗</span>
          </a>}
          <Link href="/kvkk">KVKK ve yasal belgeler</Link>
        </aside>
        <article className={styles.document}>{children}</article>
      </div>

      <PublicFooter lang="tr" />
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
    <section className={styles.legalSection}>
      <div className={styles.legalSectionHeading}>
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <div className={styles.legalSectionBody}>{children}</div>
    </section>
  )
}
