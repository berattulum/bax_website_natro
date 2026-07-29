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
  active: 'profile' | 'records'
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const labels = lang === 'tr'
    ? { about: 'Hakkımızda', profile: 'Şirket Profili', profileDesc: 'Kim olduğumuz ve mühendislik yaklaşımımız', records: 'Kurumsal Bilgiler', recordsDesc: 'Ticari ve doğrulanabilir şirket kayıtları', expertise: 'Uzmanlık', references: 'Referanslar', memberships: 'Üyelikler', contact: 'Bize Ulaşın', menu: 'Menüyü aç' }
    : { about: 'About', profile: 'Company Profile', profileDesc: 'Who we are and our engineering approach', records: 'Corporate Information', recordsDesc: 'Commercial and verifiable company records', expertise: 'Expertise', references: 'References', memberships: 'Memberships', contact: 'Contact Us', menu: 'Open menu' }

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
              <span className="corporate-menu-mark" aria-hidden="true"><Image src="/images/bax-composites-logo-original.png" alt="" width={1526} height={781} /></span>
              <Link className={active === 'profile' ? 'is-active' : ''} href="/sirket-profili"><strong>{labels.profile}</strong><small>{labels.profileDesc}</small><i aria-hidden="true">↗</i></Link>
              <Link className={active === 'records' ? 'is-active' : ''} href="/kurumsal-bilgiler"><strong>{labels.records}</strong><small>{labels.recordsDesc}</small><i aria-hidden="true">↗</i></Link>
            </div>
          </div>
          <Link href="/#expertise">{labels.expertise}</Link>
          <Link href="/#references">{labels.references}</Link>
          <Link href="/#memberships">{labels.memberships}</Link>
        </nav>

        <div className="corporate-actions">
          <Link className="corporate-contact" href="/#contact">{labels.contact}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </header>
  )
}
