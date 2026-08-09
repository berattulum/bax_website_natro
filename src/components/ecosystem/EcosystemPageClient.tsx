'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { ManagedLocale, Membership, Partner } from '@/components/ManagedSections'
import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import styles from '@/components/institutional/InstitutionalSimple.module.css'

type PageKind = 'partnerships' | 'networks'

export default function EcosystemPageClient({
  locales,
  kind,
}: {
  locales: Record<CorporateLang, ManagedLocale>
  kind: PageKind
}) {
  const [lang, setLang] = useState<CorporateLang>('en')
  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const locale = locales[lang]
  const isPartnerships = kind === 'partnerships'
  const copy = lang === 'tr'
    ? isPartnerships
      ? {
          eyebrow: 'İŞ ORTAKLIKLARI',
          lead: 'Birlikte geliştiriyoruz',
          title: 'Güçlü iş birlikleriyle mühendisliği ileri taşıyoruz',
          description: 'Tasarım, malzeme teknolojileri ve ileri üretim alanlarında dünyanın farklı noktalarındaki uzman kuruluşlarla aynı mühendislik hedefi doğrultusunda çalışıyoruz.',
          index: 'Seçilmiş iş ortakları ve referans kurumlar',
          next: 'Ağlar ve Üyelikleri İnceleyin',
          nextText: 'Araştırma, ihracat ve inovasyon ekosistemindeki bağlantılarımızı keşfedin.',
          explore: 'Keşfedin',
        }
      : {
          eyebrow: 'AĞLAR VE ÜYELİKLER',
          lead: 'Bağlantılı bilgi',
          title: 'Bilginin, iş birliğinin ve inovasyonun içindeyiz',
          description: 'Sektörel ağlar, meslek kuruluşları, ihracat birlikleri ve uluslararası Ar-Ge programlarıyla kurduğumuz bağlar; bilgiye, iş birliğine ve yeni pazarlara erişimimizi güçlendiriyor.',
          index: 'Kurumsal ağlar ve inovasyon ekosistemi',
          next: 'İş Ortaklıklarını İnceleyin',
          nextText: 'Mühendislik ve üretim yolculuğumuzu güçlendiren stratejik iş birliklerini görün.',
          explore: 'Keşfedin',
        }
    : isPartnerships
      ? {
          eyebrow: 'PARTNERSHIPS',
          lead: 'Engineered together',
          title: 'Advancing engineering through strong partnerships',
          description: 'We work toward shared engineering goals with expert organizations across design, material technologies and advanced manufacturing.',
          index: 'Selected partners and reference organizations',
          next: 'Explore Networks & Memberships',
          nextText: 'Discover our connections across research, export and innovation ecosystems.',
          explore: 'Explore',
        }
      : {
          eyebrow: 'NETWORKS & MEMBERSHIPS',
          lead: 'Connected knowledge',
          title: 'Part of a global ecosystem of knowledge and innovation',
          description: 'Our connections with industry networks, professional organizations, exporters associations and international R&D programmes strengthen access to knowledge, collaboration and new markets.',
          index: 'Institutional networks and innovation ecosystem',
          next: 'Explore Partnerships',
          nextText: 'See the strategic collaborations supporting our engineering and manufacturing journey.',
          explore: 'Explore',
        }

  const items: Array<Partner | Membership> = isPartnerships ? locale.partners : locale.memberships
  const nextHref = isPartnerships ? '/aglar-ve-uyelikler' : '/is-ortakliklari'

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
