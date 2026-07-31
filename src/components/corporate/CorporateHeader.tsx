'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export type CorporateLang = 'tr' | 'en'

export function CorporateHeader({
  lang,
  active,
}: {
  lang: CorporateLang
  active: 'profile' | 'records' | 'partnerships' | 'networks'
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [ecosystemOpen, setEcosystemOpen] = useState(false)
  const labels = lang === 'tr'
    ? { about: 'Hakkımızda', profile: 'Şirket Profili', profileDesc: 'Kim olduğumuz ve mühendislik yaklaşımımız', records: 'Kurumsal Bilgiler', recordsDesc: 'Ticari ve doğrulanabilir şirket kayıtları', expertise: 'Uzmanlık', ecosystem: 'Ekosistem', partnerships: 'İş Ortaklıkları', partnershipsDesc: 'Stratejik iş birlikleri ve referans kurumlar', networks: 'Ağlar ve Üyelikler', networksDesc: 'Sektörel ağlar, Ar-Ge ve inovasyon ekosistemi', contact: 'Bize Ulaşın', menu: 'Menüyü aç', ecosystemMenu: 'Ekosistem menüsünü aç' }
    : { about: 'About', profile: 'Company Profile', profileDesc: 'Who we are and our engineering approach', records: 'Corporate Information', recordsDesc: 'Commercial and verifiable company records', expertise: 'Expertise', ecosystem: 'Ecosystem', partnerships: 'Partnerships', partnershipsDesc: 'Strategic collaborations and reference organizations', networks: 'Networks & Memberships', networksDesc: 'Industry networks, R&D and innovation ecosystem', contact: 'Contact Us', menu: 'Open menu', ecosystemMenu: 'Open ecosystem menu' }

  return (
    <header className="corporate-header">
      <div className="corporate-header-inner">
        <Link href="/#home" className="corporate-brand" aria-label="BaX Composites">
          <Image src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority />
        </Link>

        <button type="button" className="corporate-menu-toggle" aria-expanded={menuOpen} aria-label={labels.menu} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>

        <nav className={menuOpen ? 'is-open' : ''} aria-label={lang === 'tr' ? 'Kurumsal navigasyon' : 'Corporate navigation'}>
          <div className="corporate-about-menu">
            <span>{labels.about}</span>
            <div>
              <Link className={active === 'profile' ? 'is-active' : ''} href="/sirket-profili"><strong>{labels.profile}</strong><small>{labels.profileDesc}</small><i aria-hidden="true">↗</i></Link>
              <Link className={active === 'records' ? 'is-active' : ''} href="/kurumsal-bilgiler"><strong>{labels.records}</strong><small>{labels.recordsDesc}</small><i aria-hidden="true">↗</i></Link>
            </div>
          </div>
          <Link href="/#expertise">{labels.expertise}</Link>
          <div className={`corporate-ecosystem-menu${ecosystemOpen ? ' is-open' : ''}`}>
            <button type="button" aria-expanded={ecosystemOpen} aria-label={labels.ecosystemMenu} onClick={() => setEcosystemOpen((open) => !open)}>{labels.ecosystem}<span aria-hidden="true">⌄</span></button>
            <div>
              <Link className={active === 'partnerships' ? 'is-active' : ''} href="/is-ortakliklari"><strong>{labels.partnerships}</strong><small>{labels.partnershipsDesc}</small><i aria-hidden="true">↗</i></Link>
              <Link className={active === 'networks' ? 'is-active' : ''} href="/aglar-ve-uyelikler"><strong>{labels.networks}</strong><small>{labels.networksDesc}</small><i aria-hidden="true">↗</i></Link>
            </div>
          </div>
        </nav>

        <div className="corporate-actions">
          <Link className="corporate-contact" href="/#contact">{labels.contact}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </header>
  )
}
