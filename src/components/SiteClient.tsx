'use client'

import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { EcosystemPreview, ExpertiseSection, type ManagedLocale } from './ManagedSections'
import { HeaderLanguageMenu } from './HeaderLanguageMenu'
import { PublicFooter } from './PublicFooter'

type Lang = 'tr' | 'en'
type MegaMenu = 'about' | 'expertise' | 'ecosystem'
type Locales = Record<Lang, ManagedLocale>
const HERO_SLIDE_DURATIONS = [10000, 6500, 6500] as const
const cleanEyebrow = (text?: string) => (text || '').replace(/^BAX(?:\s+COMPOSITES)?\s*(?:\/\/)?\s*/i, '').trim()
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

function Heading({ text, materialTailWords = 0 }: { text?: string; materialTailWords?: number }) {
  return <>{(text || '').split(/<br\s*\/?>/gi).map((line, index) => {
    const materialAccent = /<span>/i.test(line)
    const cleanLine = line.replace(/<\/?span>/gi, '')
    if (!materialAccent && materialTailWords > 0) {
      const words = cleanLine.trim().split(/\s+/)
      const splitAt = Math.max(words.length - materialTailWords, 1)
      const lead = words.slice(0, splitAt).join(' ')
      const accent = words.slice(splitAt).join(' ')
      return <span key={`${cleanLine}-${index}`}>{index > 0 && <br />}{lead}{accent && <><br /><span className="is-material">{accent}</span></>}</span>
    }
    return <span className={materialAccent ? 'is-material' : undefined} key={`${cleanLine}-${index}`}>{index > 0 && <br />}{cleanLine}</span>
  })}</>
}

function Address({ text }: { text?: string }) {
  return <>{(text || '').split('\n').map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>)}</>
}

export default function SiteClient({ locales }: { locales: Locales }) {
  const [lang, setLang] = useState<Lang>('en')
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMegaMenu, setOpenMegaMenu] = useState<MegaMenu | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'received' | 'failed'>('idle')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [motionEnabled, setMotionEnabled] = useState(false)
  const navigationLock = useRef<number | null>(null)
  const heroVideo = useRef<HTMLVideoElement | null>(null)
  const modalCloseButton = useRef<HTMLButtonElement | null>(null)
  const turnstileContainer = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const megaCloseTimer = useRef<number | null>(null)
  const content = locales[lang]
  const megaMenuOpen = openMegaMenu !== null

  const cancelMegaClose = () => {
    if (megaCloseTimer.current !== null) window.clearTimeout(megaCloseTimer.current)
    megaCloseTimer.current = null
  }

  const scheduleMegaClose = () => {
    cancelMegaClose()
    megaCloseTimer.current = window.setTimeout(() => {
      setOpenMegaMenu(null)
    }, 140)
  }

  const showMegaMenu = (menu: MegaMenu) => {
    cancelMegaClose()
    setOpenMegaMenu(menu)
  }

  const toggleMegaMenu = (menu: MegaMenu) => {
    cancelMegaClose()
    setOpenMegaMenu((current) => current === menu ? null : menu)
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMegaMenu(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      if (megaCloseTimer.current !== null) window.clearTimeout(megaCloseTimer.current)
    }
  }, [])
  const d = content.dictionary
  const settings = content.ui
  const copy = {
    ...settings.navigation,
    ...settings.sections,
    ...settings.directory,
    ...settings.form,
    capabilities: settings.hero.capabilities,
    discuss: settings.hero.discuss,
    processLabel: settings.process.label,
    process: settings.process.steps,
    companyInput: settings.form.company,
    navigation: settings.footer.navigation,
    headOffice: settings.footer.headOffice,
    branchOffice: settings.footer.branchOffice,
    rights: settings.footer.rights,
  }

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    setMotionEnabled(!reducedMotion && !connection?.saveData)
  }, [])

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (!targetId) return

    const scrollToHashTarget = () => document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
    const animationFrame = window.requestAnimationFrame(scrollToHashTarget)
    const settleTimer = window.setTimeout(scrollToHashTarget, 350)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(settleTimer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const selectLanguage = (nextLang: Lang) => {
    localStorage.setItem('bax-language', nextLang)
    setLang(nextLang)
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('menu-open', 'modal-open')
  }, [menuOpen, modalOpen])

  useEffect(() => {
    if (!modalOpen) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const animationFrame = window.requestAnimationFrame(() => modalCloseButton.current?.focus())
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('keydown', closeOnEscape)
      previouslyFocused?.focus()
    }
  }, [modalOpen])

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
    const revealSections = Array.from(document.querySelectorAll<HTMLElement>('.scroll-reveal'))
    const scrollScenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-scene], .process-section'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      revealSections.forEach((section) => section.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' })

    revealSections.forEach((section) => observer.observe(section))

    let animationFrame = 0
    const updateScrollScenes = () => {
      animationFrame = 0
      const viewportHeight = window.innerHeight
      scrollScenes.forEach((scene) => {
        const bounds = scene.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)))
        const centerDistance = Math.abs((bounds.top + bounds.height / 2) - viewportHeight / 2)
        const proximityRange = (viewportHeight + bounds.height) / 2
        const proximity = Math.min(1, Math.max(0, 1 - centerDistance / proximityRange))
        const easedProximity = proximity * proximity * (3 - 2 * proximity)
        const lift = 1 - easedProximity
        scene.style.setProperty('--scroll-progress', progress.toFixed(4))
        scene.style.setProperty('--surface-shift', `${(lift * -42).toFixed(2)}px`)
        scene.style.setProperty('--surface-scale', (0.91 + easedProximity * 0.09).toFixed(4))
        scene.style.setProperty('--surface-opacity', (0.5 + easedProximity * 0.5).toFixed(4))
        scene.style.setProperty('--surface-shadow', `0 ${(-8 - lift * 22).toFixed(1)}px ${(26 + lift * 48).toFixed(1)}px rgba(2,15,21,${(0.08 + lift * 0.12).toFixed(3)})`)
        scene.style.setProperty('--content-shift', `${((progress - 0.5) * -34).toFixed(2)}px`)
        scene.style.setProperty('--media-shift', `${((progress - 0.5) * -6).toFixed(2)}%`)
      })
    }
    const requestSceneUpdate = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(updateScrollScenes)
    }

    updateScrollScenes()
    window.addEventListener('scroll', requestSceneUpdate, { passive: true })
    window.addEventListener('resize', requestSceneUpdate)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestSceneUpdate)
      window.removeEventListener('resize', requestSceneUpdate)
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setSlide((current) => (current + 1) % HERO_SLIDE_DURATIONS.length), HERO_SLIDE_DURATIONS[slide])
    return () => window.clearTimeout(timer)
  }, [slide])

  useEffect(() => {
    if (slide !== 0 || !motionEnabled || !heroVideo.current) return
    heroVideo.current.currentTime = 0
    void heroVideo.current.play().catch(() => undefined)
  }, [motionEnabled, slide])

  useEffect(() => {
    const sections = ['home', 'about', 'expertise', 'ecosystem', 'contact'].map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    let animationFrame = 0

    const updateActiveSection = () => {
      animationFrame = 0
      if (navigationLock.current !== null || sections.length === 0) return

      const headerHeight = document.querySelector<HTMLElement>('.header-container')?.offsetHeight ?? 84
      const probeLine = headerHeight + Math.min(window.innerHeight * 0.18, 140)
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
    setOpenMegaMenu(null)

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
      const response = await fetch('/api/submit-form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(15_000), body: JSON.stringify({ name: data.get('name'), company: data.get('company'), email: data.get('email'), phone: data.get('phone'), subject: data.get('subject'), message: data.get('message'), consent: data.get('consent') === 'on', website: data.get('website') || '', turnstileToken }) })
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
  const slides = [mainSlide, ...settings.hero.secondarySlides]
  const visibleSections = content.sectionLayout.filter((item) => item.enabled)
  const visibleSectionKeys = new Set(visibleSections.map((item) => item.section))
  const ecosystemNavigation = lang === 'tr'
    ? {
        label: 'Ekosistem',
        partnerships: 'İş Ortaklıkları',
        partnershipsDesc: 'Stratejik iş birlikleri ve referans kurumlar',
        networks: 'Ağlar ve Üyelikler',
        networksDesc: 'Sektörel ağlar, Ar-Ge ve inovasyon ekosistemi',
        toggle: 'Ekosistem menüsünü aç',
      }
    : {
        label: 'Ecosystem',
        partnerships: 'Partnerships',
        partnershipsDesc: 'Strategic collaborations and reference organizations',
        networks: 'Networks & Memberships',
        networksDesc: 'Industry networks, R&D and innovation ecosystem',
        toggle: 'Open ecosystem menu',
      }
  const sustainabilityLabel = lang === 'tr' ? 'Sürdürülebilirlik' : 'Sustainability'
  const navigationItems = [[copy.about, 'about'], [copy.expertise, 'expertise'], [ecosystemNavigation.label, 'ecosystem'], [sustainabilityLabel, 'sustainability'], [copy.contact, 'contact']]
  const headerNavigationItems = navigationItems.filter(([, id]) => id !== 'contact')
    .filter(([, id]) => id === 'ecosystem'
      ? visibleSectionKeys.has('partners') || visibleSectionKeys.has('memberships')
      : id === 'sustainability' || visibleSectionKeys.has(id as typeof visibleSections[number]['section']))
  const expertiseAnchors = ['composite-design', 'industrialization-automation', 'material-process-innovation', 'testing-qualification-certification', 'tooling-machinery-equipment', 'engineering-consulting']
  const expertiseFallbackTitles = lang === 'tr'
    ? ['Kompozit Tasarım ve Dijital Mühendislik', 'Endüstrileştirme ve Otomasyon', 'Malzeme ve Proses İnovasyonu', 'Test Kalifikasyon ve Sertifikasyon', 'Takım Makine ve Ekipman', 'Mühendislik Danışmanlığı ve Yetkinlik Geliştirme']
    : ['Composite Design and Digital Engineering', 'Industrialization and Automation', 'Material and Process Innovation', 'Testing Qualification and Certification', 'Tooling Machinery and Equipment', 'Engineering Consulting and Capability Development']
  const expertiseMenuItems = expertiseAnchors.map((anchor, index) => ({
    anchor,
    title: content.expertise[index]?.title || expertiseFallbackTitles[index],
  }))
  const aboutNavigation = lang === 'tr'
    ? { profile: 'Şirket Profili', profileDesc: 'Kim olduğumuz ve mühendislik yaklaşımımız', corporate: 'Kurumsal Bilgiler', corporateDesc: 'Ticari ve doğrulanabilir şirket kayıtları', toggle: 'Hakkımızda menüsünü aç', teaser: 'BaX’ı Tanıyın' }
    : { profile: 'Company Profile', profileDesc: 'Who we are and our engineering approach', corporate: 'Corporate Information', corporateDesc: 'Commercial and verifiable company records', toggle: 'Open About menu', teaser: 'Discover BaX' }
  const trustBand = lang === 'tr'
    ? {
        eyebrow: 'MÜHENDİSLİK YAKLAŞIMI',
        title: 'İleri kompozit mühendisliği.',
        description: 'Tasarımdan doğrulamaya, proses geliştirmeden seri üretime uzanan bütünleşik mühendislik ve üretim çözümleri.',
        designTitle: 'Kompozit Tasarım ve Dijital Mühendislik',
        designText: 'Malzeme, geometri ve yapısal performansı üretilebilir çözümlere dönüştürüyoruz.',
      }
    : {
        eyebrow: 'ENGINEERING APPROACH',
        title: 'Advanced composite engineering.',
        description: 'Integrated engineering and manufacturing solutions spanning design, validation, process development and serial production.',
        designTitle: 'Composite Design and Digital Engineering',
        designText: 'We transform material, geometry and structural performance into manufacturable solutions.',
      }
  const principlesOrbit = <section className="principles-orbit scroll-reveal" aria-labelledby="principles-orbit-title">
    <div className="principles-orbit-grid" aria-hidden="true" />
    <div className="principles-orbit-horizon" aria-hidden="true"><i /><i /><i /></div>
    <div className="principles-orbit-scan" aria-hidden="true" />
    <div className="container principles-orbit-inner">
      <header className="principles-orbit-heading">
        <h2 id="principles-orbit-title">{lang === 'tr'
          ? <>Geleceği malzemeden<br /><strong>mühendisliğe taşıyoruz</strong></>
          : <>From material potential<br /><strong>to engineered futures</strong></>}</h2>
      </header>
      <div className="principles-orbit-path" aria-hidden="true"><i /><i /><i /></div>
      <div className="principles-orbit-items principles-orbit-items-revised">
        {(lang === 'tr' ? [
          { index: '01', title: d.visionTitle, items: [<>Küresel ölçekte <strong>güvenilir teknoloji ortağı</strong> olmak</>, <>Yenilikçi teknolojileri <strong>ölçülebilir endüstriyel değere</strong> dönüştürmek</>, <><strong>Sürdürülebilir kompozit çözümlerle</strong> geleceğin üretimine yön vermek</>] },
          { index: '02', title: d.missionTitle, items: [<><strong>Tasarım, analiz ve doğrulamayı</strong> tek sistemde birleştirmek</>, <>Hafif, dayanıklı ve <strong>ölçeklenebilir üretim</strong> çözümleri sunmak</>, <><strong>Sürdürülebilirliği</strong> malzeme seçiminden seri üretime taşımak</>] },
          { index: '03', title: d.valuesTitle, items: [<><strong>Güven, adalet ve samimiyet</strong></>, <><strong>Tutku, sorumluluk ve bilgi</strong></>, <>Kaynak verimliliği ve <strong>sürdürülebilirlik</strong></>] },
        ] : [
          { index: '01', title: d.visionTitle, items: [<>Become a globally <strong>trusted technology partner</strong></>, <>Transform innovative technologies into <strong>measurable industrial value</strong></>, <>Shape future manufacturing through <strong>sustainable composite solutions</strong></>] },
          { index: '02', title: d.missionTitle, items: [<>Unite <strong>design, analysis and verification</strong> in one system</>, <>Deliver lightweight, durable and <strong>scalable manufacturing</strong> solutions</>, <>Carry <strong>sustainability</strong> from material selection into serial production</>] },
          { index: '03', title: d.valuesTitle, items: [<><strong>Trust, fairness and sincerity</strong></>, <><strong>Passion, responsibility and knowledge</strong></>, <>Resource efficiency and <strong>sustainability</strong></>] },
        ]).map(({ index, title, items }) => <article key={index}>
          <h3>{title}</h3>
          <ul>{items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
        </article>)}
      </div>
      <div className="principles-orbit-items principles-orbit-items-legacy" aria-hidden="true">
        {[
          ['01', lang === 'tr' ? 'YÖN' : 'DIRECTION', d.visionTitle, d.visionText],
          ['02', lang === 'tr' ? 'SİSTEM' : 'SYSTEM', d.missionTitle, d.missionText],
          ['03', lang === 'tr' ? 'TEMEL' : 'FOUNDATION', d.valuesTitle, d.valuesText],
        ].map(([index, , title, text]) => <article key={index}>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>)}
      </div>
    </div>
  </section>

  function renderSection(section: typeof visibleSections[number]['section']) {
    switch (section) {
      case 'about':
        return <>
          <section id="about" className="home-engineering-showcase scroll-reveal scroll-scene" data-scroll-scene data-language={lang}>
            <div className="home-engineering-surface">
              <div className="container home-engineering-layout">
                <div className="home-engineering-intro">
                  <span className="home-engineering-kicker">{trustBand.eyebrow}</span>
                  <h2>
                    <span>{lang === 'tr' ? 'İleri kompozit' : 'Advanced composite'}</span>
                    <strong>{lang === 'tr' ? 'mühendisliği' : 'engineering'}</strong>
                  </h2>
                  <div className="home-engineering-statement"><p>{trustBand.description}</p><a className="home-engineering-link" href="/sirket-profili"><span>{copy.about}</span><span aria-hidden="true">↗</span></a></div>
                </div>
              </div>
            </div>
          </section>
          <div className="engineering-continuum">
            <div className="engineering-continuum-orbit" aria-hidden="true"><i /><i /><i /></div>
            {principlesOrbit}
            <ExpertiseSection
              items={content.expertise}
              label={lang === 'tr' ? 'MÜHENDİSLİK YETKİNLİKLERİ' : 'ENGINEERING CAPABILITIES'}
              locale={lang}
            />
          </div>
        </>
      case 'designNarrative':
        return null
      case 'expertise':
        return null
      case 'manufacturingNarrative':
        return null
      case 'process':
        return <section className="process-section scroll-reveal" aria-labelledby="process-title"><div className="container"><div className="process-heading"><h2 id="process-title"><Heading text={d.processTitle || ''} /></h2></div><ol className="process-track">{copy.process.map(([title, text], index) => <li style={{ '--reveal-order': index + 1 } as CSSProperties} key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>
      case 'principles':
        return null
      case 'solutions':
        return null
      case 'partners':
        return <EcosystemPreview lang={lang} partners={content.partners} memberships={content.memberships} />
      case 'memberships':
        return null
      case 'contact':
        return <section id="contact" className="contact-section"><div className="container contact-grid"><div className="contact-intro"><h2>{d.contactTitle}</h2><p>{d.contactText}</p><button type="button" className="contact-action" onClick={() => setModalOpen(true)}>{copy.tellProject}</button></div><div className="contact-directory"><article data-contact-icon="BX"><span>{copy.company}</span><strong>{copy.companyName}</strong></article><article data-contact-icon="@"><span>{copy.email}</span><a href={`mailto:${d.email}`}>{d.email}</a></article><article data-contact-icon="+"><span>{copy.phone}</span><a href={`tel:${(d.phone || '').replace(/[^+\d]/g, '')}`}>{d.phone}</a></article><article data-contact-icon="↗"><span>{copy.web}</span><a href={copy.websiteUrl}>{copy.websiteLabel}</a></article></div></div></section>
    }
  }

  return <>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onLoad={() => setTurnstileReady(true)}
    />
    <header className="main-header is-hero">
      <div className="container header-container">
        <div className="logo"><a href="#home" aria-label="BaX Composites"><Image className="brand-logo brand-logo-header" src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority /></a></div>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label={copy.mainNavigationLabel} onMouseEnter={cancelMegaClose} onMouseLeave={scheduleMegaClose}><ul>
          {headerNavigationItems.map(([label, id]) => {
            if (id === 'about') return <li className={`nav-with-submenu${openMegaMenu === 'about' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('about')}><div className="nav-parent-row"><a href="/sirket-profili" className={activeSection === id ? 'active' : undefined}><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'about'} aria-label={aboutNavigation.toggle} onClick={() => toggleMegaMenu('about')}><span aria-hidden="true">⌄</span></button></div></li>
            if (id === 'expertise') return <li className={`nav-with-submenu nav-expertise${openMegaMenu === 'expertise' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('expertise')}><div className="nav-parent-row"><a href="/expertise" className={activeSection === id ? 'active' : undefined}><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'expertise'} aria-label={lang === 'tr' ? 'Uzmanlık menüsünü aç' : 'Open expertise menu'} onClick={() => toggleMegaMenu('expertise')}><span aria-hidden="true">⌄</span></button></div></li>
            if (id === 'ecosystem') return <li className={`nav-with-submenu nav-ecosystem${openMegaMenu === 'ecosystem' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('ecosystem')}><div className="nav-parent-row"><a href="#ecosystem" className={activeSection === id ? 'active' : undefined} onClick={(event) => navigateToSection(event, id)}><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'ecosystem'} aria-label={ecosystemNavigation.toggle} onClick={() => toggleMegaMenu('ecosystem')}><span aria-hidden="true">⌄</span></button></div></li>
            if (id === 'sustainability') return <li key={id} onMouseEnter={() => setOpenMegaMenu(null)}><a href="/surdurulebilirlik"><span className="nav-dot" aria-hidden="true" />{label}</a></li>
            return <li key={id} onMouseEnter={() => setOpenMegaMenu(null)}><a href={`#${id}`} className={activeSection === id ? 'active' : undefined} aria-current={activeSection === id ? 'page' : undefined} onClick={(event) => navigateToSection(event, id)}><span className="nav-dot" aria-hidden="true" />{label}</a></li>
          })}
        </ul><div className={`nav-mega-panel${megaMenuOpen ? ' is-open' : ''}`} aria-hidden={!megaMenuOpen}>
          <div className="nav-mega-inner">
            <section className={openMegaMenu === 'about' ? 'is-current' : undefined}><span>01</span><h3>{copy.about}</h3><a href="/sirket-profili">{aboutNavigation.profile}<i aria-hidden="true">↗</i></a><a href="/kurumsal-bilgiler">{aboutNavigation.corporate}<i aria-hidden="true">↗</i></a></section>
            <section className={openMegaMenu === 'expertise' ? 'is-current' : undefined}><span>02</span><h3>{copy.expertise}</h3>{expertiseMenuItems.map((item) => <a href={`/expertise#${item.anchor}`} key={item.anchor}>{item.title}<i aria-hidden="true">↗</i></a>)}</section>
            <section className={openMegaMenu === 'ecosystem' ? 'is-current' : undefined}><span>03</span><h3>{ecosystemNavigation.label}</h3><a href="/is-ortakliklari">{ecosystemNavigation.partnerships}<i aria-hidden="true">↗</i></a><a href="/aglar-ve-uyelikler">{ecosystemNavigation.networks}<i aria-hidden="true">↗</i></a></section>
            <section><span>04</span><h3>{sustainabilityLabel}</h3><a href="/surdurulebilirlik">{lang === 'tr' ? 'Sürdürülebilirlik yaklaşımımız' : 'Our sustainability approach'}<i aria-hidden="true">↗</i></a></section>
          </div>
        </div></nav>
        <button type="button" className="mobile-menu-toggle" aria-expanded={menuOpen} aria-label={copy.mobileMenuLabel} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        <div className="header-right"><a className="header-contact-link" href="/iletisim">{copy.contactUs}</a><HeaderLanguageMenu value={lang} onChange={selectLanguage} label={copy.languageLabel} /></div>
      </div>
    </header>

    <section id="home" className="hero-section"><div className="hero-slider">
      {slides.map((slideContent, index) => <div
        key={`${lang}-${index}`}
        className={`slide opening-slide${index === slide ? ' active' : ''}`}
        data-language={lang}
        data-slide-index={index}
        aria-hidden={index !== slide}
      >
        {index === 0 ? <video ref={heroVideo} autoPlay={motionEnabled} loop muted playsInline preload={motionEnabled ? 'metadata' : 'none'} poster="/assets/aircraft-hero-keyframe-v2.png" className="hero-video">{motionEnabled && <source src="/assets/aircraft-gemini-cinematic-v1.mp4" type="video/mp4" />}</video> : <div className={`slide-bg ${slideContent[3] || ''}`} />}
        <div className="hero-overlay" /><div className="container hero-content"><h2 className="hero-subtitle">{cleanEyebrow(slideContent[0])}</h2><h1 className="hero-title"><Heading text={slideContent[1] || ''} materialTailWords={index === 1 ? 1 : index === 2 ? 2 : 0} /></h1><p className="hero-description">{slideContent[2]}</p><div className="hero-actions"><a href="#expertise" className="hero-link hero-link-primary">{copy.capabilities}</a>{index === 0 && <button type="button" className="hero-link" onClick={() => setModalOpen(true)}>{copy.discuss}</button>}</div></div>
      </div>)}
      <div className="opening-pagination" role="group" aria-label={settings.hero.slidesLabel}>{slides.map((_, index) => <button type="button" key={index} className={`opening-dot${index === slide ? ' active' : ''}`} style={{ '--slide-duration': `${HERO_SLIDE_DURATIONS[index]}ms` } as CSSProperties} aria-current={index === slide} aria-label={`${settings.hero.slideLabel} ${index + 1}`} onClick={() => setSlide(index)} />)}</div>
    </div><div className="hero-cloud-transition" aria-hidden="true"><span /><span /><span /></div></section>

    {visibleSections.map(({ section }) => <Fragment key={section}>{renderSection(section)}</Fragment>)}
    <PublicFooter lang={lang} />

    {modalOpen && <div className="contact-modal is-open" id="contact-modal" aria-hidden="false"><button className="contact-modal-backdrop" aria-label={copy.closeLabel} onClick={() => setModalOpen(false)} /><div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" aria-describedby="contact-modal-description"><button ref={modalCloseButton} type="button" className="modal-close" aria-label={copy.closeLabel} onClick={() => setModalOpen(false)}>×</button><aside className="contact-dialog-aside"><span className="section-label">BAX // {copy.contact.toUpperCase()}</span><h3>{d.contactTitle}</h3><p>{d.contactText}</p><div className="contact-dialog-scope">{copy.process.slice(0, 3).map(([title]) => <span key={title}>{title}</span>)}</div><div className="contact-dialog-direct"><a href={`mailto:${d.email}`}>{d.email}</a><a href={`tel:${(d.phone || '').replace(/[^+\d]/g, '')}`}>{d.phone}</a></div></aside><div className="contact-dialog-main"><h2 id="contact-modal-title">{copy.modalTitle}</h2><p className="modal-intro" id="contact-modal-description">{copy.modalIntro}</p><form onSubmit={submitContact}><input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form-honeypot" /><div className="form-row"><label><span>{copy.name}</span><input type="text" name="name" autoComplete="name" required /></label><label><span>{copy.companyInput}</span><input type="text" name="company" autoComplete="organization" /></label></div><div className="form-row"><label><span>{copy.email}</span><input type="email" name="email" autoComplete="email" required /></label><label><span>{copy.phone}</span><input type="tel" name="phone" autoComplete="tel" /></label></div><label><span>{copy.subject}</span><input type="text" name="subject" required /></label><label><span>{copy.message}</span><textarea name="message" rows={4} required /></label><label className="consent-label"><input type="checkbox" name="consent" required /><span>{copy.consent}</span></label>{process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <div ref={turnstileContainer} className="turnstile-container" />}<div className="form-footer"><span role="status" aria-live="polite">{formStatus === 'received' ? copy.received : formStatus === 'failed' ? copy.failed : ''}</span><button type="submit" className="form-submit" disabled={formStatus === 'sending' || Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}><span>{formStatus === 'sending' ? copy.sending : formStatus === 'received' ? copy.received : formStatus === 'failed' ? copy.failed : copy.send}</span><span aria-hidden="true">→</span></button></div></form><a className="contact-dialog-detail-link" href="/iletisim">{lang === 'tr' ? 'Detaylı proje iletişim sayfasına geçin' : 'Continue to the detailed project contact page'}<span aria-hidden="true">↗</span></a></div></div></div>}
  </>
}
