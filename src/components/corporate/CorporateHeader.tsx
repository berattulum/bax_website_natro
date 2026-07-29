'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export type CorporateLang = 'tr' | 'en'

export function CorporateHeader({
  lang,
  onLanguageChange,
  active,
}: {
  lang: CorporateLang
  onLanguageChange: (lang: CorporateLang) => void
  active: 'profile' | 'records'
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const labels = lang === 'tr'
    ? { about: 'Hakkımızda', profile: 'Şirket Profili', records: 'Kurumsal Bilgiler', expertise: 'Uzmanlık', references: 'Referanslar', memberships: 'Üyelikler', contact: 'Bize Ulaşın', menu: 'Menüyü aç' }
    : { about: 'About', profile: 'Company Profile', records: 'Corporate Information', expertise: 'Expertise', references: 'References', memberships: 'Memberships', contact: 'Contact Us', menu: 'Open menu' }

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
              <Link className={active === 'profile' ? 'is-active' : ''} href="/sirket-profili">{labels.profile}</Link>
              <Link className={active === 'records' ? 'is-active' : ''} href="/kurumsal-bilgiler">{labels.records}</Link>
            </div>
          </div>
          <Link href="/#expertise">{labels.expertise}</Link>
          <Link href="/#references">{labels.references}</Link>
          <Link href="/#memberships">{labels.memberships}</Link>
        </nav>

        <div className="corporate-actions">
          <div className="corporate-language" aria-label={lang === 'tr' ? 'Dil seçimi' : 'Language selection'}>
            <button className={lang === 'tr' ? 'is-active' : ''} onClick={() => onLanguageChange('tr')} type="button">TR</button>
            <button className={lang === 'en' ? 'is-active' : ''} onClick={() => onLanguageChange('en')} type="button">EN</button>
          </div>
          <Link className="corporate-contact" href="/#contact">{labels.contact}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </header>
  )
}
