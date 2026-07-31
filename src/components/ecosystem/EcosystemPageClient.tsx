'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { ManagedLocale, Membership, Partner } from '@/components/ManagedSections'
import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'

type PageKind = 'partnerships' | 'networks'

export default function EcosystemPageClient({
  locales,
  kind,
}: {
  locales: Record<CorporateLang, ManagedLocale>
  kind: PageKind
}) {
  const [lang, setLang] = useState<CorporateLang>('tr')
  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('bax-language', lang)
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
        }
      : {
          eyebrow: 'AĞLAR VE ÜYELİKLER',
          lead: 'Bağlantılı bilgi',
          title: 'Bilginin, iş birliğinin ve inovasyonun içindeyiz',
          description: 'Sektörel ağlar, meslek kuruluşları, ihracat birlikleri ve uluslararası Ar-Ge programlarıyla kurduğumuz bağlar; bilgiye, iş birliğine ve yeni pazarlara erişimimizi güçlendiriyor.',
          index: 'Kurumsal ağlar ve inovasyon ekosistemi',
          next: 'İş Ortaklıklarını İnceleyin',
          nextText: 'Mühendislik ve üretim yolculuğumuzu güçlendiren stratejik iş birliklerini görün.',
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
        }
      : {
          eyebrow: 'NETWORKS & MEMBERSHIPS',
          lead: 'Connected knowledge',
          title: 'Part of a global ecosystem of knowledge and innovation',
          description: 'Our connections with industry networks, professional organizations, exporters associations and international R&D programmes strengthen access to knowledge, collaboration and new markets.',
          index: 'Institutional networks and innovation ecosystem',
          next: 'Explore Partnerships',
          nextText: 'See the strategic collaborations supporting our engineering and manufacturing journey.',
        }

  const items: Array<Partner | Membership> = isPartnerships ? locale.partners : locale.memberships
  const nextHref = isPartnerships ? '/aglar-ve-uyelikler' : '/is-ortakliklari'

  return (
    <main className={`ecosystem-page ecosystem-page-${kind}`}>
      <CorporateHeader lang={lang} active={kind} />
      <section className="ecosystem-page-hero">
        <div className="ecosystem-page-grid" aria-hidden="true" />
        <div className="ecosystem-page-orbit" aria-hidden="true"><i /><i /></div>
        <div className="ecosystem-page-hero-inner">
          <span>{copy.eyebrow}</span>
          <p>{copy.lead}</p>
          <h1>{copy.title}</h1>
          <div className="ecosystem-page-intro"><p>{copy.description}</p><i aria-hidden="true" /></div>
        </div>
      </section>

      <section className="ecosystem-directory" aria-labelledby="ecosystem-directory-title">
        <div className="ecosystem-directory-heading">
          <span>01 / {String(items.length).padStart(2, '0')}</span>
          <h2 id="ecosystem-directory-title">{copy.index}</h2>
        </div>
        <div className={`ecosystem-directory-grid${isPartnerships ? ' is-partnerships' : ' is-networks'}`}>
          {items.map((item, index) => (
            <a href={item.website} target="_blank" rel="noopener" key={item.name}>
              <span className="ecosystem-card-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="ecosystem-card-logo">
                {item.logo ? <img src={item.logo} alt={item.name} loading="lazy" /> : <strong>{item.name}</strong>}
              </span>
              <span className="ecosystem-card-meta">
                <strong>{item.name}</strong>
                <small>{'category' in item ? item.category : item.caption}</small>
              </span>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>

      <section className="ecosystem-next">
        <div><span>{lang === 'tr' ? 'SONRAKİ BAĞLANTI' : 'NEXT CONNECTION'}</span><h2>{copy.next}</h2><p>{copy.nextText}</p></div>
        <Link href={nextHref}>Keşfedin<span aria-hidden="true">↗</span></Link>
      </section>

      <footer className="profile-footer">
        <span>© 2026 BaX Composites Inc.</span>
        <Link href="/#ecosystem">{lang === 'tr' ? 'Ana sayfaya dön' : 'Return to homepage'}</Link>
        <Link href="/#home">baxcomposites.com</Link>
      </footer>
    </main>
  )
}
