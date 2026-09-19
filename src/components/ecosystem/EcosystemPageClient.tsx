'use client'

import Link from 'next/link'

import type { ManagedLocale, Membership, Partner } from '@/components/ManagedSections'
import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import styles from '@/components/institutional/InstitutionalSimple.module.css'
import { ecosystemPageCopy, type EcosystemChrome } from '@/lib/cms/ecosystem-page-defaults'
import { hrefFor } from '@/lib/i18n/site-routes'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'

type PageKind = 'partnerships' | 'networks'

export default function EcosystemPageClient({
  locales,
  kind,
  content,
}: {
  locales: Record<CorporateLang, ManagedLocale>
  kind: PageKind
  content?: Record<CorporateLang, EcosystemChrome>
}) {
  const [lang, setLang] = useSiteLanguage()

  const locale = locales[lang]
  const isPartnerships = kind === 'partnerships'
  const chrome = content?.[lang] || ecosystemPageCopy[lang]
  const copy = isPartnerships ? chrome.partnerships : chrome.networks

  const items: Array<Partner | Membership> = isPartnerships ? locale.partners : locale.memberships
  const nextHref = hrefFor(isPartnerships ? 'networks' : 'partnerships', lang)

  return (
    <main className={styles.page}>
      <CorporateHeader lang={lang} active={kind} onLangChange={setLang} />
      <section className={styles.hero}>
        <div>
          <p className={styles.heroLead}>{copy.lead}</p>
          <h1>{copy.title}</h1>
        </div>
        <div className={styles.heroIntro}><p>{copy.description}</p></div>
      </section>

      <section className={styles.content} aria-labelledby="ecosystem-directory-title">
        <div className={styles.sectionTitle}>
          <h2 id="ecosystem-directory-title">{copy.index}</h2>
        </div>
        <div className={styles.directory}>
          {items.map((item) => (
            <a href={item.website} target="_blank" rel="noopener" key={item.name}>
              <span className={styles.logo}>
                {item.logo ? <img src={item.logo} alt="" loading="lazy" decoding="async" /> : <strong>{item.name}</strong>}
              </span>
              <span className={styles.cardMeta}>
                <strong>{item.name}</strong>
                <small>{'category' in item ? item.category : item.caption}</small>
              </span>
              <i className={styles.cardArrow} aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.next}>
        <div><h2>{copy.next}</h2><p>{copy.nextText}</p></div>
        <Link href={nextHref}>{copy.explore}<span aria-hidden="true">↗</span></Link>
      </section>

      <PublicFooter lang={lang} />
    </main>
  )
}
