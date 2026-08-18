'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { HeaderLanguageMenu } from '@/components/HeaderLanguageMenu'

export type CorporateLang = 'tr' | 'en'

export function CorporateHeader({
  lang,
  active,
  onLangChange,
}: {
  lang: CorporateLang
  active: 'profile' | 'founder' | 'records' | 'capabilities' | 'partnerships' | 'networks' | 'sustainability' | 'contact'
  onLangChange?: (lang: CorporateLang) => void
  }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMegaMenu, setOpenMegaMenu] = useState<'about' | 'expertise' | 'ecosystem' | 'sustainability' | null>(null)
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showMegaMenu = (menu: NonNullable<typeof openMegaMenu>) => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current)
    setOpenMegaMenu(menu)
  }
  const scheduleMegaClose = () => {
    megaCloseTimer.current = setTimeout(() => setOpenMegaMenu(null), 140)
  }
  const toggleMegaMenu = (menu: NonNullable<typeof openMegaMenu>) => setOpenMegaMenu((current) => current === menu ? null : menu)
  const selectLanguage = (nextLang: CorporateLang) => {
    localStorage.setItem('bax-language', nextLang)
    onLangChange?.(nextLang)
  }
  const labels = lang === 'tr'
    ? { about: 'Kurumsal', profile: 'Hakkımızda', profileDesc: 'Kim olduğumuz ve mühendislik yaklaşımımız', founder: 'Kurucu', founderDesc: 'Hakkı Kızılok ve mühendislik liderliği', records: 'Kurumsal Bilgiler', recordsDesc: 'Ticari ve doğrulanabilir şirket kayıtları', capabilities: 'Yetkinlikler', ecosystem: 'Ekosistem', partnerships: 'İş Ortaklıkları', partnershipsDesc: 'Stratejik iş birlikleri ve referans kurumlar', networks: 'Ağlar ve Üyelikler', networksDesc: 'Sektörel ağlar, Ar-Ge ve inovasyon ekosistemi', sustainability: 'Sürdürülebilirlik', contact: 'Bize Ulaşın', menu: 'Menüyü aç', ecosystemMenu: 'Ekosistem menüsünü aç' }
    : { about: 'Corporate', profile: 'About Us', profileDesc: 'Who we are and our engineering approach', founder: 'Founder', founderDesc: 'Hakkı Kızılok and engineering leadership', records: 'Corporate Information', recordsDesc: 'Commercial and verifiable company records', capabilities: 'Capabilities', ecosystem: 'Ecosystem', partnerships: 'Partnerships', partnershipsDesc: 'Strategic collaborations and reference organizations', networks: 'Networks & Memberships', networksDesc: 'Industry networks, R&D and innovation ecosystem', sustainability: 'Sustainability', contact: 'Contact Us', menu: 'Open menu', ecosystemMenu: 'Open ecosystem menu' }
  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="logo"><Link href="/#home" aria-label="BaX Composites">
          <Image className="brand-logo brand-logo-header" src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority />
        </Link></div>

        <button type="button" className="mobile-menu-toggle" aria-expanded={menuOpen} aria-label={labels.menu} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>

        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label={lang === 'tr' ? 'Kurumsal navigasyon' : 'Corporate navigation'} onMouseEnter={() => megaCloseTimer.current && clearTimeout(megaCloseTimer.current)} onMouseLeave={scheduleMegaClose}><ul>
          <li className={`nav-with-submenu${openMegaMenu === 'about' ? ' is-submenu-open' : ''}`} onMouseEnter={() => showMegaMenu('about')}><div className="nav-parent-row"><Link href="/sirket-profili" className={active === 'profile' || active === 'founder' || active === 'records' ? 'active' : undefined}>{labels.about}</Link><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'about'} aria-label={labels.about} onClick={() => toggleMegaMenu('about')}><span aria-hidden="true">⌄</span></button></div></li>
          <li className={`nav-with-submenu${openMegaMenu === 'expertise' ? ' is-submenu-open' : ''}`} onMouseEnter={() => showMegaMenu('expertise')}><div className="nav-parent-row"><Link className={active === 'capabilities' ? 'active' : undefined} href="/capabilities">{labels.capabilities}</Link><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'expertise'} aria-label={labels.capabilities} onClick={() => toggleMegaMenu('expertise')}><span aria-hidden="true">⌄</span></button></div></li>
          <li className={`nav-with-submenu${openMegaMenu === 'ecosystem' ? ' is-submenu-open' : ''}`} onMouseEnter={() => showMegaMenu('ecosystem')}><div className="nav-parent-row"><Link href="/is-ortakliklari" className={active === 'partnerships' || active === 'networks' ? 'active' : undefined}>{labels.ecosystem}</Link><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'ecosystem'} aria-label={labels.ecosystemMenu} onClick={() => toggleMegaMenu('ecosystem')}><span aria-hidden="true">⌄</span></button></div></li>
          <li className={`nav-with-submenu nav-sustainability${openMegaMenu === 'sustainability' ? ' is-submenu-open' : ''}`} onMouseEnter={() => showMegaMenu('sustainability')}><div className="nav-parent-row"><Link className={active === 'sustainability' ? 'active' : undefined} href="/surdurulebilirlik">{labels.sustainability}</Link><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'sustainability'} aria-label={labels.sustainability} onClick={() => toggleMegaMenu('sustainability')}><span aria-hidden="true">⌄</span></button></div></li>
        </ul><div className={`nav-mega-panel${openMegaMenu ? ` is-open menu-${openMegaMenu}` : ''}`} aria-hidden={!openMegaMenu}><div className="nav-mega-inner"><div className="nav-mega-content">
          {openMegaMenu === 'about' && <section><span>{labels.about.toUpperCase()}</span><h3>{lang === 'tr' ? 'BaX’ı tanıyın' : 'Discover BaX'}</h3><Link href="/sirket-profili">{labels.profile}</Link><Link href="/kurucu">{labels.founder}</Link><Link href="/kurumsal-bilgiler">{labels.records}</Link></section>}
          {openMegaMenu === 'expertise' && <section><span>{labels.capabilities.toUpperCase()}</span><h3>{lang === 'tr' ? 'Kompozit mühendisliği' : 'Composite engineering'}</h3><Link href="/capabilities">{lang === 'tr' ? 'Mühendislik yetkinlikleri' : 'Engineering capabilities'}</Link></section>}
          {openMegaMenu === 'ecosystem' && <section><span>{labels.ecosystem.toUpperCase()}</span><h3>{lang === 'tr' ? 'Birlikte değer üretmek' : 'Creating value together'}</h3><Link href="/is-ortakliklari">{labels.partnerships}</Link><Link href="/aglar-ve-uyelikler">{labels.networks}</Link></section>}
          {openMegaMenu === 'sustainability' && <section><span>{labels.sustainability.toUpperCase()}</span><h3>{lang === 'tr' ? 'Döngüsel mühendislik' : 'Circular engineering'}</h3><Link href="/surdurulebilirlik">{lang === 'tr' ? 'Yaklaşımımız' : 'Our approach'}</Link></section>}
        </div></div></div></nav>

        <div className="header-right">
          <Link className={`header-contact-link${active === 'contact' ? ' is-active' : ''}`} href="/iletisim">{labels.contact}</Link>
          {onLangChange && <HeaderLanguageMenu value={lang} onChange={selectLanguage} label={lang === 'tr' ? 'Dil seçimi' : 'Language selection'} />}
        </div>
      </div>
    </header>
  )
}
