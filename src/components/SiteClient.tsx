'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import Script from 'next/script'
import { ExpertiseSection, MembershipsSection, ReferencesSection, type ManagedLocale } from './ManagedSections'

type Lang = 'tr' | 'en'
type Locales = Record<Lang, ManagedLocale>
type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: 'light'
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

const ui = {
  tr: {
    home: 'Ana Sayfa', about: 'Hakkımızda', expertise: 'Uzmanlık', references: 'Referanslar', memberships: 'Üyelikler', contact: 'İletişim', contactUs: 'BİZE ULAŞIN',
    capabilities: 'YETKİNLİKLERİMİZ', discuss: 'PROJENİZİ KONUŞALIM', processLabel: 'UÇTAN UCA MÜHENDİSLİK',
    process: [['Konsept', 'Gereksinimlerin ve performans hedeflerinin tanımlanması.'], ['Tasarım & Analiz', 'Malzeme, geometri ve yapısal performansın geliştirilmesi.'], ['Test & Doğrulama', 'Ürün ve proses performansının ölçülmesi ve doğrulanması.'], ['Endüstrileştirme', 'Tekrarlanabilir, verimli ve ölçeklenebilir üretim sistemi.']],
    principlesTitle: 'Mühendislikten üretime tek bir hedef.', solutionsLabel: 'ÇÖZÜMLERİMİZ', solutionsTitle: 'İleri Kompozit Teknolojileri', solutionsText: 'Havacılık ve otomotivin geleceğini, milimetrik tasarımlar ve sürdürülebilir üretim süreçleriyle şekillendiriyoruz.', defense: 'Savunma Sanayii', aviation: 'Sivil Havacılık',
    company: 'ŞİRKET', email: 'E-POSTA', phone: 'TELEFON', web: 'WEB', tellProject: 'PROJENİZİ BİZE ANLATIN', navigation: 'Gezinme', headOffice: 'GENEL MERKEZ', branchOffice: 'ŞUBE', rights: 'Tüm hakları saklıdır.',
    modalTitle: 'Projenizi konuşalım.', modalIntro: 'İhtiyacınızı kısaca anlatın; mesajınızı doğrudan mühendislik ekibimize iletelim.', name: 'Ad Soyad', companyInput: 'Şirket', subject: 'Konu', message: 'Mesajınız', consent: 'İletişim amacıyla bilgilerimin işlenmesini kabul ediyorum.', send: 'MESAJI GÖNDER', sending: 'GÖNDERİLİYOR…', received: 'MESAJINIZ ALINDI', failed: 'LÜTFEN TEKRAR DENEYİN', selectedPartners: 'Seçilmiş iş ortakları ve referans kurumlar',
  },
  en: {
    home: 'Home', about: 'About Us', expertise: 'Expertise', references: 'References', memberships: 'Memberships', contact: 'Contact', contactUs: 'CONTACT US',
    capabilities: 'OUR CAPABILITIES', discuss: 'DISCUSS YOUR PROJECT', processLabel: 'END-TO-END ENGINEERING',
    process: [['Concept', 'Definition of requirements and performance targets.'], ['Design & Analysis', 'Development of material, geometry and structural performance.'], ['Test & Verification', 'Measurement and verification of product and process performance.'], ['Industrialization', 'A repeatable, efficient and scalable production system.']],
    principlesTitle: 'One objective from engineering to production.', solutionsLabel: 'OUR SOLUTIONS', solutionsTitle: 'Advanced Composite Technologies', solutionsText: 'We shape the future of aerospace and automotive through precision design and sustainable manufacturing.', defense: 'Defense Industry', aviation: 'Civil Aviation',
    company: 'COMPANY', email: 'EMAIL', phone: 'PHONE', web: 'WEB', tellProject: 'TELL US ABOUT YOUR PROJECT', navigation: 'Navigation', headOffice: 'HEAD OFFICE', branchOffice: 'BRANCH OFFICE', rights: 'All rights reserved.',
    modalTitle: "Let's discuss your project.", modalIntro: 'Tell us briefly what you need and send your message directly to our engineering team.', name: 'Full name', companyInput: 'Company', subject: 'Subject', message: 'Your message', consent: 'I consent to the processing of my information for communication purposes.', send: 'SEND MESSAGE', sending: 'SENDING…', received: 'MESSAGE RECEIVED', failed: 'PLEASE TRY AGAIN', selectedPartners: 'Selected partners and reference organizations',
  },
} as const

const secondarySlides = {
  tr: [
    ['OTOMOTİV KOMPOZİT TEKNOLOJİLERİ', 'Hafiflikten Performansa', 'Karbon fiber yapısal parçalar, hafifletme çözümleri ve ölçeklenebilir üretim süreçleriyle yeni nesil mobilite projelerine mühendislik desteği sunuyoruz.', 'automotive-bg'],
    ['OTOMOTİVDE KOMPOZİT ÜRETİM', 'Malzemeden Yapısal Değere', 'Karbon fiber monokoklar ve yapısal parçalar için hassas serim, proses geliştirme ve tekrarlanabilir üretim çözümleri geliştiriyoruz.', 'manufacturing-bg'],
  ],
  en: [
    ['AUTOMOTIVE COMPOSITE TECHNOLOGIES', 'From Lightweighting to Performance', 'We support next-generation mobility projects with carbon-fiber structural components, lightweighting solutions and scalable manufacturing processes.', 'automotive-bg'],
    ['AUTOMOTIVE COMPOSITE MANUFACTURING', 'From Material to Structural Value', 'We develop precision layup, process development and repeatable production solutions for carbon-fiber monocoques and structural components.', 'manufacturing-bg'],
  ],
} as const

const narrativeScenes = {
  tr: [
    ['MÜHENDİSLİK VE TASARIM', 'Fütüristik Çizgiler', 'Sadece fonksiyonel değil, estetik ve keskin hatlara sahip yenilikçi tasarımları gerçeğe dönüştürüyoruz.', 'futuristic-bg'],
    ['YÜKSEK TEKNOLOJİ ÜRETİM', 'Milimetrik Hassasiyet', 'İleri tasarım ve analiz araçlarıyla geliştirilen sistemlerin kusursuz fiziksel kompozit karşılıklarını üretiyoruz.', 'precision-bg'],
  ],
  en: [
    ['ENGINEERING AND DESIGN', 'Futuristic Lines', 'We turn innovative designs with functional, aesthetic, and sharp lines into reality.', 'futuristic-bg'],
    ['HIGH-TECH MANUFACTURING', 'Micrometric Precision', 'We manufacture precise physical composite counterparts of systems developed with advanced design and analysis tools.', 'precision-bg'],
  ],
} as const

function Heading({ text }: { text: string }) {
  return <>{text.replace(/<\/?span>/gi, '').split(/<br\s*\/?>/gi).map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>)}</>
}

function Address({ text }: { text?: string }) {
  return <>{(text || '').split('\n').map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>)}</>
}

function NarrativeScene({ scene }: { scene: readonly [string, string, string, string] }) {
  return <section className="slide in-view narrative-scene"><div className={`slide-bg ${scene[3]}`} role="img" aria-label={scene[1]} /><div className="hero-overlay" /><div className="container hero-content"><h2 className="hero-subtitle">{scene[0]}</h2><h2 className="hero-title"><Heading text={scene[1]} /></h2><p className="hero-description">{scene[2]}</p></div></section>
}

export default function SiteClient({ locales }: { locales: Locales }) {
  const [lang, setLang] = useState<Lang>('tr')
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'received' | 'failed'>('idle')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const navigationLock = useRef<number | null>(null)
  const turnstileContainer = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const content = locales[lang]
  const d = content.dictionary
  const copy = ui[lang]

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('bax-language', lang)
  }, [lang])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('menu-open', 'modal-open')
  }, [menuOpen, modalOpen])

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    const turnstile = (window as Window & { turnstile?: TurnstileApi }).turnstile

    if (!modalOpen || !turnstileReady || !siteKey || !turnstile || !turnstileContainer.current) {
      return
    }

    setTurnstileToken('')
    setFormStatus('idle')
    turnstileWidgetId.current = turnstile.render(turnstileContainer.current, {
      sitekey: siteKey,
      action: 'contact_form',
      theme: 'light',
      callback: (token) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => {
        setTurnstileToken('')
        setFormStatus('failed')
      },
    })

    return () => {
      if (turnstileWidgetId.current) {
        turnstile.remove(turnstileWidgetId.current)
        turnstileWidgetId.current = null
      }
      setTurnstileToken('')
    }
  }, [modalOpen, turnstileReady])

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % 3), 7000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const sections = ['home', 'about', 'expertise', 'references', 'memberships', 'contact'].map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    let animationFrame = 0

    const updateActiveSection = () => {
      animationFrame = 0
      if (navigationLock.current !== null || sections.length === 0) return

      const headerBottom = document.querySelector<HTMLElement>('.header-container')?.getBoundingClientRect().bottom ?? 84
      const probeLine = headerBottom + Math.min(window.innerHeight * 0.18, 140)
      let nextSection = sections[0].id

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probeLine) nextSection = section.id
        else break
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        nextSection = sections[sections.length - 1].id
      }

      setActiveSection((current) => current === nextSection ? current : nextSection)
    }

    const requestUpdate = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  function navigateToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    setActiveSection(id)
    setMenuOpen(false)

    if (navigationLock.current !== null) window.clearTimeout(navigationLock.current)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)

    navigationLock.current = window.setTimeout(() => {
      navigationLock.current = null
      window.dispatchEvent(new Event('scroll'))
    }, 900)
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setFormStatus('failed')
      return
    }
    setFormStatus('sending')
    const form = event.currentTarget
    const data = new FormData(form)
    try {
      const response = await fetch('/api/submit-form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), company: data.get('company'), email: data.get('email'), phone: data.get('phone'), subject: data.get('subject'), message: data.get('message'), consent: data.get('consent') === 'on', website: data.get('website') || '', turnstileToken }) })
      if (!response.ok) throw new Error('Message could not be saved')
      form.reset()
      if (turnstileWidgetId.current) {
        ;(window as Window & { turnstile?: TurnstileApi }).turnstile?.reset(turnstileWidgetId.current)
      }
      setTurnstileToken('')
      setFormStatus('received')
      window.setTimeout(() => setModalOpen(false), 1200)
    } catch { setFormStatus('failed') }
  }

  const mainSlide = [d.hero1Subtitle, d.hero1Title, d.hero1Description] as const
  const slides = [mainSlide, ...secondarySlides[lang]]
  const active = slides[slide]
  const visibleSections = content.sectionLayout.filter((item) => item.enabled)
  const visibleSectionKeys = new Set(visibleSections.map((item) => item.section))
  const navigationItems = [[copy.home, 'home'], [copy.about, 'about'], [copy.expertise, 'expertise'], [copy.references, 'references'], [copy.memberships, 'memberships'], [copy.contact, 'contact']]
    .filter(([, id]) => id === 'home' || visibleSectionKeys.has(id === 'references' ? 'partners' : id as typeof visibleSections[number]['section']))

  function renderSection(section: typeof visibleSections[number]['section']) {
    switch (section) {
      case 'about':
        return <section id="about" className="about-section"><div className="container"><div className="about-flex"><div className="about-text"><h2><Heading text={d.aboutTitle || ''} /></h2></div><div className="about-desc"><p>{d.aboutDescription}</p><p>{d.aboutGoal}</p></div></div></div></section>
      case 'designNarrative':
        return <NarrativeScene scene={narrativeScenes[lang][0]} />
      case 'expertise':
        return <ExpertiseSection items={content.expertise} />
      case 'manufacturingNarrative':
        return <NarrativeScene scene={narrativeScenes[lang][1]} />
      case 'process':
        return <section className="process-section" aria-labelledby="process-title"><div className="container"><div className="process-heading"><span className="section-label">{copy.processLabel}</span><h2 id="process-title"><Heading text={d.processTitle || ''} /></h2></div><ol className="process-track">{copy.process.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>
      case 'principles':
        return <section className="principles-section" aria-labelledby="principles-title"><div className="container"><div className="principles-heading"><h2 id="principles-title">{copy.principlesTitle}</h2></div><div className="principles-grid">{[['V', d.visionTitle, d.visionText], ['M', d.missionTitle, d.missionText], ['D', d.valuesTitle, d.valuesText]].map(([letter, title, text]) => <article className="principle-card" key={letter}><span>{letter}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      case 'solutions':
        return <section className="magazine-layout"><div className="grid-item text-block"><span className="label">{copy.solutionsLabel}</span><h2>{copy.solutionsTitle}</h2><p>{copy.solutionsText}</p></div><div className="grid-item image-block solution-defense" role="img" aria-label={copy.defense}><div className="overlay"><h3>{copy.defense}</h3></div></div><div className="grid-item image-block solution-civil" role="img" aria-label={copy.aviation}><div className="overlay"><h3>{copy.aviation}</h3></div></div></section>
      case 'partners':
        return <ReferencesSection title={d.referencesTitle || ''} description={d.referencesText || ''} items={content.partners} />
      case 'memberships':
        return <MembershipsSection title={d.membershipsTitle || ''} description={d.membershipsText || ''} items={content.memberships} />
      case 'contact':
        return <section id="contact" className="contact-section"><div className="container contact-grid"><div className="contact-intro"><h2>{d.contactTitle}</h2><p>{d.contactText}</p><button type="button" className="contact-action" onClick={() => setModalOpen(true)}>{copy.tellProject}</button></div><div className="contact-directory"><article data-contact-icon="BX"><span>{copy.company}</span><strong>BaX Composites Inc.</strong></article><article data-contact-icon="@"><span>{copy.email}</span><a href={`mailto:${d.email}`}>{d.email}</a></article><article data-contact-icon="+"><span>{copy.phone}</span><a href={`tel:${(d.phone || '').replace(/[^+\d]/g, '')}`}>{d.phone}</a></article><article data-contact-icon="↗"><span>{copy.web}</span><a href="https://baxcomposites.com/">baxcomposites.com</a></article></div></div></section>
    }
  }

  return <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onLoad={() => setTurnstileReady(true)}
    />
    <header className="main-header">
      <div className="container header-container">
        <div className="logo"><a href="#home" aria-label="BaX Composites"><img className="brand-logo brand-logo-header" src="/brand/bax-composites-logo.png" alt="BaX Composites" /></a></div>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation"><ul>
          {navigationItems.map(([label, id]) => <li key={id}><a href={`#${id}`} className={activeSection === id ? 'active' : undefined} aria-current={activeSection === id ? 'page' : undefined} onClick={(event) => navigateToSection(event, id)}>{label}</a></li>)}
        </ul></nav>
        <button type="button" className="mobile-menu-toggle" aria-expanded={menuOpen} aria-label="Menü" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        <div className="header-right"><div className="lang-selector" role="group" aria-label="Language"><button type="button" className={lang === 'tr' ? 'active' : ''} aria-pressed={lang === 'tr'} onClick={() => setLang('tr')}>TR</button><button type="button" className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button></div><button type="button" className="btn-primary-small" onClick={() => setModalOpen(true)}>{copy.contactUs}</button></div>
      </div>
    </header>

    <section id="home" className="hero-section"><div className="hero-slider">
      <div
        className="slide opening-slide active"
        data-language={lang}
        data-slide-index={slide}
        aria-hidden="false"
      >
        {slide === 0 ? <video autoPlay loop muted playsInline preload="metadata" poster="/assets/aircraft-hero-poster.webp" className="hero-video"><source src="/ucak-video.mp4" type="video/mp4" /></video> : <div className={`slide-bg ${active[3] || ''}`} />}
        <div className="hero-overlay" /><div className="container hero-content"><h2 className="hero-subtitle">{active[0]}</h2><h1 className="hero-title"><Heading text={active[1] || ''} /></h1><p className="hero-description">{active[2]}</p>{slide === 0 && <div className="hero-actions"><a href="#expertise" className="hero-link hero-link-primary">{copy.capabilities}</a><button type="button" className="hero-link" onClick={() => setModalOpen(true)}>{copy.discuss}</button></div>}</div>
      </div>
      <div className="opening-pagination" role="group" aria-label="Hero slides">{slides.map((_, index) => <button type="button" key={index} className={`opening-dot${index === slide ? ' active' : ''}`} aria-current={index === slide} aria-label={`Slide ${index + 1}`} onClick={() => setSlide(index)} />)}</div>
    </div></section>

    {visibleSections.map(({ section }) => <Fragment key={section}>{renderSection(section)}</Fragment>)}
    <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a href="#home" className="footer-logo" aria-label="BaX Composites"><img className="brand-logo brand-logo-footer" src="/brand/bax-composites-logo.png" alt="BaX Composites" /></a><p>{d.footerText}</p></div><div role="navigation" aria-label={copy.navigation}><h3>{copy.navigation}</h3>{navigationItems.map(([label, id]) => <a href={`#${id}`} key={id} onClick={(event) => navigateToSection(event, id)}>{label}</a>)}</div><div><h3>{copy.contact}</h3><a href={`mailto:${d.email}`}>{d.email}</a><a href={`tel:${(d.phone || '').replace(/[^+\d]/g, '')}`}>{d.phone}</a></div><div className="footer-address"><h3>{copy.headOffice}</h3><p><Address text={d.headOffice} /></p></div><div className="footer-address"><h3>{copy.branchOffice}</h3><p><Address text={d.branchOffice} /></p></div></div><div className="container footer-bottom"><span>© 2026 BaX Composites Inc.</span><nav className="footer-legal" aria-label="Legal"><a href="/assets/legal/bax-personal-data-clarification.pdf" target="_blank">KVKK</a><a href="/assets/legal/bax-cookie-policy.pdf" target="_blank">Cookie Policy</a><a href="/assets/legal/bax-kvkk-application-form.pdf" target="_blank">Application Form</a></nav><span>{copy.rights}</span></div></footer>

    {modalOpen && <div className="contact-modal is-open" id="contact-modal" aria-hidden="false"><button className="contact-modal-backdrop" aria-label="Close" onClick={() => setModalOpen(false)} /><div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title"><button type="button" className="modal-close" aria-label="Close" onClick={() => setModalOpen(false)}>×</button><span className="section-label">BAX // {copy.contact.toUpperCase()}</span><h2 id="contact-modal-title">{copy.modalTitle}</h2><p className="modal-intro">{copy.modalIntro}</p><form onSubmit={submitContact}><input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form-honeypot" /><div className="form-row"><label><span>{copy.name}</span><input type="text" name="name" autoComplete="name" required /></label><label><span>{copy.companyInput}</span><input type="text" name="company" autoComplete="organization" /></label></div><div className="form-row"><label><span>{copy.email}</span><input type="email" name="email" autoComplete="email" required /></label><label><span>{copy.phone}</span><input type="tel" name="phone" autoComplete="tel" /></label></div><label><span>{copy.subject}</span><input type="text" name="subject" required /></label><label><span>{copy.message}</span><textarea name="message" rows={5} required /></label><label className="consent-label"><input type="checkbox" name="consent" required /><span>{copy.consent}</span></label>{process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <div ref={turnstileContainer} className="turnstile-container" />}<div className="form-footer"><span /><button type="submit" className="form-submit" disabled={formStatus === 'sending' || Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}>{formStatus === 'sending' ? copy.sending : formStatus === 'received' ? copy.received : formStatus === 'failed' ? copy.failed : copy.send}</button></div></form></div></div>}
  </>
}
