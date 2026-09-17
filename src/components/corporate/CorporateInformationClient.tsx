'use client'

import { CorporateHeader } from './CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import {
  corporateInformationCopy,
  corporateInformationOffices,
  corporateInformationRecords,
  type CorporateInformationCopy,
} from '@/lib/cms/corporate-information-defaults'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'
import styles from '@/components/institutional/InstitutionalSimple.module.css'

export {
  corporateInformationCopy,
  corporateInformationOffices,
  corporateInformationRecords,
}

export function CorporateInformationClient({
  content = corporateInformationCopy,
  records = corporateInformationRecords,
  offices = corporateInformationOffices,
}: {
  content?: Record<'tr' | 'en', CorporateInformationCopy>
  records?: ReadonlyArray<readonly [string, string, string]>
  offices?: typeof corporateInformationOffices
}) {
  const [lang, setLang] = useSiteLanguage()

  const t = content?.[lang] && 'eyebrow' in content[lang] ? content[lang] : corporateInformationCopy[lang]

  return (
    <main className={styles.page}>
      <CorporateHeader lang={lang} active="records" onLangChange={setLang} />

      <section className={styles.hero}>
        <div>
          <p className={styles.heroLead}>{t.eyebrow}</p>
          <h1>
            {t.title}
            <br />
            <em>{t.titleAccent}.</em>
          </h1>
        </div>
        <div className={styles.heroIntro}>
          <p>{t.intro}</p>
        </div>
      </section>

      <section className={styles.content}>
        <header className={styles.sectionTitle}>
          <h2>{t.identity}</h2>
        </header>
        <div className={styles.records}>
          {records.map(([tr, en, value]) => (
            <article className={styles.record} key={tr}>
              <span>{lang === 'tr' ? tr : en}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <header className={styles.sectionTitle}>
          <h2>{t.offices}</h2>
        </header>
        <div className={styles.offices}>
          <article className={styles.office}>
            <span>{t.head}</span>
            <p>{offices.head}</p>
          </article>
          <article className={styles.office}>
            <span>{t.branch}</span>
            <p>{offices.branch}</p>
          </article>
        </div>

        <aside className={styles.verify}>
          <div>
            <h2>{t.verify}</h2>
            <p>{t.verifyText}</p>
          </div>
          <a href="https://e-sirket.mkk.com.tr/" target="_blank" rel="noreferrer">
            {t.verifyLink}
            <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </section>

      <PublicFooter lang={lang} />
    </main>
  )
}
