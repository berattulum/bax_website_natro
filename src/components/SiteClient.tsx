'use client'

import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import Image from 'next/image'
import { EcosystemPreview, type ManagedLocale } from './ManagedSections'
import { HeaderLanguageMenu } from './HeaderLanguageMenu'
import { PublicFooter } from './PublicFooter'

type Lang = 'tr' | 'en'
type MegaMenu = 'about' | 'expertise' | 'ecosystem' | 'sustainability'
type Locales = Record<Lang, ManagedLocale>
const HERO_SLIDE_DURATION = 7000
const cleanEyebrow = (text?: string) => (text || '').replace(/^BAX(?:\s+COMPOSITES)?\s*(?:\/\/)?\s*/i, '').trim()
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
  const [slide, setSlide] = useState(0)
  const [sliderPaused, setSliderPaused] = useState(false)
  const [rotationCycle, setRotationCycle] = useState(0)
  const [capabilitySlide, setCapabilitySlide] = useState(0)
  const [capabilityPaused, setCapabilityPaused] = useState(false)
  const [sectorSlide, setSectorSlide] = useState(0)
  const [verificationActive, setVerificationActive] = useState(0)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const navigationLock = useRef<number | null>(null)
  const heroVideo = useRef<HTMLVideoElement | null>(null)
  const megaCloseTimer = useRef<number | null>(null)
  const showcaseScene = useRef<HTMLDivElement | null>(null)
  const content = locales[lang]
  const megaMenuOpen = openMegaMenu !== null

  const moveShowcase = (event: MouseEvent<HTMLElement>) => {
    if (!motionEnabled || !showcaseScene.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2
    showcaseScene.current.style.setProperty('--pointer-x', x.toFixed(3))
    showcaseScene.current.style.setProperty('--pointer-y', y.toFixed(3))
  }

  const resetShowcase = () => {
    showcaseScene.current?.style.setProperty('--pointer-x', '0')
    showcaseScene.current?.style.setProperty('--pointer-y', '0')
  }

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
  const d = Object.fromEntries(
    Object.entries(content.dictionary).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replace(/\.+\s*$/, '') : value,
    ]),
  ) as typeof content.dictionary
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
    const desktopViewport = window.matchMedia('(min-width: 769px)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    setMotionEnabled(desktopViewport && !reducedMotion && !connection?.saveData)
    if (reducedMotion) setSliderPaused(true)
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
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

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
    if (sliderPaused) return
    const timer = window.setTimeout(() => setSlide((current) => (current + 1) % 3), HERO_SLIDE_DURATION)
    return () => window.clearTimeout(timer)
  }, [slide, sliderPaused, rotationCycle])

  useEffect(() => {
    if (capabilityPaused) return
    const timer = window.setTimeout(() => setCapabilitySlide((current) => (current + 1) % 4), 6200)
    return () => window.clearTimeout(timer)
  }, [capabilitySlide, capabilityPaused])

  useEffect(() => {
    if (!heroVideo.current) return
    if (slide !== 0 || !motionEnabled || sliderPaused) {
      heroVideo.current.pause()
      return
    }
    heroVideo.current.currentTime = 0
    void heroVideo.current.play().catch(() => undefined)
  }, [motionEnabled, slide, sliderPaused])

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

  const mainSlide = lang === 'tr'
    ? ['GERİ DÖNÜŞTÜRÜLMÜŞ VE İLERİ KOMPOZİT MÜHENDİSLİĞİ', 'Geri dönüştürülmüş ve ileri kompozitleri<br><span>konseptten doğrulanmış üretime taşıyoruz</span>', 'Otomotiv ve havacılık uygulamaları için malzeme geliştirme, yapısal tasarım, proses mühendisliği ve sanayileştirme'] as const
    : ['RECYCLED & ADVANCED COMPOSITE ENGINEERING', 'Advanced and recycled composites<br><span>Engineered for production</span>', 'Material development, structural design, process engineering and industrialization for automotive and aerospace applications'] as const
  const slides = [mainSlide, ...settings.hero.secondarySlides]
  const loco3Process = lang === 'tr' ? [
    { stage: 'GERİ KAZAN', label: 'Karbon naylon üretim atığının yüksek değerli yeniden kullanım için hazırlanması', image: '/assets/loco3-process/01-carbon-nylon-scrap-preparation-v1.png' },
    { stage: 'YENİDEN İŞLE', label: 'Uzun lif değerinin düşük kesmeli prosesle korunması', image: '/assets/loco3-process/02-low-shear-extrusion-sheet-v1.png' },
    { stage: 'SANAYİLEŞTİR', label: 'Geri dönüştürülmüş plakalardan doğrulanmış otomotiv parçaları üretilmesi', image: '/assets/loco3-process/03-automated-compression-moulding-v1.png' },
  ] : [
    { stage: 'RECOVER', label: 'Carbon nylon production waste prepared for high value reuse', image: '/assets/loco3-process/01-carbon-nylon-scrap-preparation-v1.png' },
    { stage: 'REPROCESS', label: 'Long fiber value preserved through low shear processing', image: '/assets/loco3-process/02-low-shear-extrusion-sheet-v1.png' },
    { stage: 'INDUSTRIALIZE', label: 'Recycled composite sheets converted into verified automotive components', image: '/assets/loco3-process/03-automated-compression-moulding-v1.png' },
  ]
  const sliderControl = lang === 'tr'
    ? { pause: 'Sliderı duraklat', resume: 'Sliderı devam ettir', region: 'BaX Composites öne çıkan mühendislik alanları' }
    : { pause: 'Pause slider', resume: 'Resume slider', region: 'BaX Composites featured engineering capabilities' }
  const capabilityTransition = lang === 'tr' ? [
    { index: '01', stage: 'TASARIM VE ANALİZ', title: 'Yapısal performanstan üretilebilir geometriye', text: 'Malzeme davranışını, yük durumlarını ve parça mimarisini fiziksel üretim kararlarına dönüştürüyoruz', image: '/assets/capability-transition/01-structural-design-analysis.png' },
    { index: '02', stage: 'PROSES GELİŞTİRME', title: 'Kontrollü RTM proseslerinden tekrarlanabilir kaliteye', text: 'Karmaşık kompozit yapılar için kalıp, preform ve enjeksiyon parametrelerini birlikte geliştiriyoruz', image: '/assets/capability-transition/02-industrial-rtm-process.png' },
    { index: '03', stage: 'SANAYİLEŞTİRME', title: 'Esnek parçalardan kararlı robotik üretime', text: 'Fikstürleme, takım ve otomasyon kararlarını ölçeklenebilir üretim hücrelerine bağlıyoruz', image: '/assets/capability-transition/03-robotic-flexible-composite-machining.png' },
    { index: '04', stage: 'TEST VE DOĞRULAMA', title: 'Ölçülebilir performanstan üretim onayına', text: 'Yapısal test, optik ölçüm ve tahribatsız muayeneyi izlenebilir doğrulama çıktılarında birleştiriyoruz', image: '/assets/capability-transition/04-structural-test-validation.png' },
  ] : [
    { index: '01', stage: 'DESIGN & ANALYSIS', title: 'From structural performance to manufacturable geometry', text: 'We translate material behaviour, load cases and part architecture into physical production decisions', image: '/assets/capability-transition/01-structural-design-analysis.png' },
    { index: '02', stage: 'PROCESS DEVELOPMENT', title: 'From controlled RTM processes to repeatable quality', text: 'We develop tooling, preforms and injection parameters together for complex composite structures', image: '/assets/capability-transition/02-industrial-rtm-process.png' },
    { index: '03', stage: 'INDUSTRIALIZATION', title: 'From flexible components to stable robotic production', text: 'We connect fixturing, tooling and automation decisions in scalable manufacturing cells', image: '/assets/capability-transition/03-robotic-flexible-composite-machining.png' },
    { index: '04', stage: 'TEST & VALIDATION', title: 'From measurable performance to production approval', text: 'We combine structural testing, optical metrology and non-destructive inspection in traceable verification outputs', image: '/assets/capability-transition/04-structural-test-validation.png' },
  ]
  const sectorApplications = lang === 'tr' ? [
    { index: '01', sector: 'HAVACILIK', title: 'Karmaşık yapılar için hafif ve doğrulanabilir kompozit çözümler', text: 'Yapısal tasarım, RTM proses geliştirme, hassas fikstürleme ve doğrulama yaklaşımını havacılık yapılarının üretim gereksinimleriyle birleştiriyoruz', meta: 'AEROSTRUCTURES · RTM · VERIFICATION', image: '/assets/sector-applications/01-aerospace-composite-structures.png' },
    { index: '02', sector: 'ELEKTRİKLİ MOBİLİTE', title: 'Batarya sistemleri çevresinde hafiflik ve yapısal koruma', text: 'Kompozit malzeme ve proses bilgisini elektrikli araçların batarya muhafazaları, alt gövde bileşenleri ve hafif yapı ihtiyaçlarına taşıyoruz', meta: 'BATTERY ENCLOSURES · LIGHTWEIGHTING · SAFETY', image: '/assets/sector-applications/02-electric-mobility-battery-enclosure.png' },
    { index: '03', sector: 'OTOMOTİV', title: 'Geri dönüştürülmüş malzemeden yüksek hacimli üretime', text: 'Uzun lif değerini koruyan termoplastik yarı mamulleri otomasyon ve kontrollü kalıplama ile ölçeklenebilir otomotiv bileşenlerine dönüştürüyoruz', meta: 'RECYCLED TPC · AUTOMATION · SERIAL PRODUCTION', image: '/assets/sector-applications/03-high-volume-automotive-production.png' },
    { index: '04', sector: 'TİCARİ ARAÇLAR', title: 'Büyük modüllerde malzeme seçimi ve araç entegrasyonu', text: 'Hafif kompozit modülleri üretilebilirlik, bağlantı arayüzleri ve ölçüsel doğrulama kararlarıyla ticari mobilite mimarilerine bağlıyoruz', meta: 'LARGE STRUCTURES · INTEGRATION · METROLOGY', image: '/assets/sector-applications/04-commercial-vehicle-lightweighting.png' },
  ] : [
    { index: '01', sector: 'AEROSPACE', title: 'Lightweight and verifiable composite solutions for complex structures', text: 'We connect structural design, RTM process development, precision fixturing and verification with the production requirements of aerospace structures', meta: 'AEROSTRUCTURES · RTM · VERIFICATION', image: '/assets/sector-applications/01-aerospace-composite-structures.png' },
    { index: '02', sector: 'ELECTRIC MOBILITY', title: 'Lightweight structures and protection around battery systems', text: 'We apply composite material and process knowledge to battery enclosures, underbody components and lightweight architectures for electric vehicles', meta: 'BATTERY ENCLOSURES · LIGHTWEIGHTING · SAFETY', image: '/assets/sector-applications/02-electric-mobility-battery-enclosure.png' },
    { index: '03', sector: 'AUTOMOTIVE', title: 'From recycled material to high-volume manufacturing', text: 'We convert thermoplastic semi-fabricates that preserve long-fibre value into scalable automotive components through automation and controlled moulding', meta: 'RECYCLED TPC · AUTOMATION · SERIAL PRODUCTION', image: '/assets/sector-applications/03-high-volume-automotive-production.png' },
    { index: '04', sector: 'COMMERCIAL VEHICLES', title: 'Material selection and vehicle integration for large modules', text: 'We connect lightweight composite modules with manufacturability, interface design and dimensional verification decisions for commercial mobility architectures', meta: 'LARGE STRUCTURES · INTEGRATION · METROLOGY', image: '/assets/sector-applications/04-commercial-vehicle-lightweighting.png' },
  ]
  const verificationEvidence = lang === 'tr' ? [
    { code: '01', type: 'RESMÎ PROGRAM KAYDI', title: 'MachFlexComp', body: 'BaX koordinatörlüğünde Türkiye, İspanya ve Belçika’dan altı kuruluşu bir araya getiren M-ERA.NET yüksek performanslı kompozitler projesi', facts: ['M-ERA.NET Call 2022', 'TRL 3–6', '€693.146 fonlama'], source: 'M-ERA.NET resmî kaydı', href: 'https://www.m-era.net/materipedia/2022/machflexcomp' },
    { code: '02', type: 'FONLANAN ULUSLARARASI AR-GE', title: 'LOCO3', body: 'BaX Kompozit, SPIRAL RTC ve Hollanda uygulamalı araştırma ekosistemini düşük CO₂’li kompozit bileşenler için buluşturan Eurostars programı', facts: ['Eurostars 3 · Call 6', 'Project 5826', 'TÜBİTAK 9249509'], source: 'Eureka katılımcı kaydı', href: 'https://www.eurekanetwork.org/wp-content/uploads/2026/01/participants-in-eurostars-3-projects.pdf' },
    { code: '03', type: 'AKADEMİK DOĞRULAMA', title: 'Malzemeden ölçülebilir veriye', body: 'Geri dönüştürülmüş kısa karbon elyaf matların geçirgenlik ve lif yönelimi çalışmaları Koç Üniversitesi Kompozit Malzemeler Üretim Laboratuvarı ve Sabancı Üniversitesi SUNUM altyapısıyla yürütüldü', facts: ['Koç University', 'Sabancı University SUNUM', 'AeroMat 2026'], source: 'Hakkı Kızılok araştırma paylaşımı', href: 'https://www.linkedin.com/in/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0/' },
    { code: '04', type: 'BAĞIMSIZ PROJE DOĞRULAMASI', title: 'Endüstriyel ölçeğe geçiş', body: 'TPAC, LOCO3 kapsamında BaX Composites ve SPIRAL RTC ile karbon-nylon atıkların geri dönüştürülebilirliğini ve ölçeklenebilir üretim zincirini birlikte araştırdığını yayımladı', facts: ['TPAC', 'SPIRAL RTC', 'Otomotiv uygulaması'], source: 'TPAC araştırma duyurusu', href: 'https://www.linkedin.com/posts/thermoplasticcomposites_%F0%9D%90%91%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%9E%F0%9D%90%9A%F0%9D%90%AB%F0%9D%90%9C%F0%9D%90%A1-%F0%9D%90%AC%F0%9D%90%A9%F0%9D%90%A8%F0%9D%90%AD%F0%9D%90%A5%F0%9D%90%A2%F0%9D%90%A0%F0%9D%90%A1%F0%9D%90%AD-%F0%9D%90%8B%F0%9D%90%8E%F0%9D%90%82%F0%9D%90%8E3-activity-7450816170095611905-QEGN' },
  ] : [
    { code: '01', type: 'OFFICIAL PROGRAMME RECORD', title: 'MachFlexComp', body: 'An M-ERA.NET high-performance composites project coordinated by BaX across six organizations in Türkiye, Spain and Belgium', facts: ['M-ERA.NET Call 2022', 'TRL 3–6', '€693,146 funding'], source: 'Official M-ERA.NET record', href: 'https://www.m-era.net/materipedia/2022/machflexcomp' },
    { code: '02', type: 'FUNDED INTERNATIONAL R&D', title: 'LOCO3', body: 'A Eurostars programme connecting BaX Kompozit, SPIRAL RTC and the Dutch applied-research ecosystem around low-CO₂ composite components', facts: ['Eurostars 3 · Call 6', 'Project 5826', 'TÜBİTAK 9249509'], source: 'Eureka participant record', href: 'https://www.eurekanetwork.org/wp-content/uploads/2026/01/participants-in-eurostars-3-projects.pdf' },
    { code: '03', type: 'ACADEMIC VERIFICATION', title: 'From material to measurable evidence', body: 'Permeability and fibre-orientation research on recycled short-carbon-fibre mats was conducted with Koç University Composite Materials Manufacturing Laboratory and Sabancı University SUNUM infrastructure', facts: ['Koç University', 'Sabancı University SUNUM', 'AeroMat 2026'], source: 'Hakkı Kızılok research post', href: 'https://www.linkedin.com/in/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0/' },
    { code: '04', type: 'INDEPENDENT PROJECT CONFIRMATION', title: 'Moving research toward industrial scale', body: 'TPAC publicly confirms joint work with BaX Composites and SPIRAL RTC on carbon-nylon waste recyclability and a scalable manufacturing chain within LOCO3', facts: ['TPAC', 'SPIRAL RTC', 'Automotive application'], source: 'TPAC research announcement', href: 'https://www.linkedin.com/posts/thermoplasticcomposites_%F0%9D%90%91%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%9E%F0%9D%90%9A%F0%9D%90%AB%F0%9D%90%9C%F0%9D%90%A1-%F0%9D%90%AC%F0%9D%90%A9%F0%9D%90%A8%F0%9D%90%AD%F0%9D%90%A5%F0%9D%90%A2%F0%9D%90%A0%F0%9D%90%A1%F0%9D%90%AD-%F0%9D%90%8B%F0%9D%90%8E%F0%9D%90%82%F0%9D%90%8E3-activity-7450816170095611905-QEGN' },
  ]
  const visibleSections = content.sectionLayout.filter((item) => item.enabled)
  const orderedSections = [...visibleSections]
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
  const corporateNavigationLabel = lang === 'tr' ? 'Kurumsal' : 'Corporate'
  const navigationItems = [[corporateNavigationLabel, 'about'], [lang === 'tr' ? 'Yetkinlikler' : 'Capabilities', 'expertise'], [ecosystemNavigation.label, 'ecosystem'], [sustainabilityLabel, 'sustainability'], [copy.contact, 'contact']]
  const headerNavigationItems = navigationItems.filter(([, id]) => id !== 'contact')
    .filter(([, id]) => id === 'ecosystem'
      ? visibleSectionKeys.has('partners') || visibleSectionKeys.has('memberships')
      : id === 'sustainability' || visibleSectionKeys.has(id as typeof visibleSections[number]['section']))
  const aboutNavigation = lang === 'tr'
    ? { profile: 'Hakkımızda', profileDesc: 'Kim olduğumuz ve mühendislik yaklaşımımız', founder: 'Kurucu', founderDesc: 'Hakkı Kızılok ve mühendislik liderliği', corporate: 'Kurumsal Bilgiler', corporateDesc: 'Ticari ve doğrulanabilir şirket kayıtları', toggle: 'Kurumsal menüsünü aç', teaser: 'BaX’ı Tanıyın' }
    : { profile: 'About Us', profileDesc: 'Who we are and our engineering approach', founder: 'Founder', founderDesc: 'Hakkı Kızılok and engineering leadership', corporate: 'Corporate Information', corporateDesc: 'Commercial and verifiable company records', toggle: 'Open Corporate menu', teaser: 'Discover BaX' }
  const trustBand = lang === 'tr'
    ? {
        eyebrow: 'MÜHENDİSLİK YAKLAŞIMI',
      title: 'İleri kompozit mühendisliği',
      description: 'Tasarımdan doğrulamaya, proses geliştirmeden seri üretime uzanan bütünleşik mühendislik ve üretim çözümleri',
        designTitle: 'Kompozit Tasarım ve Dijital Mühendislik',
      designText: 'Malzeme, geometri ve yapısal performansı üretilebilir çözümlere dönüştürüyoruz',
      }
    : {
        eyebrow: 'ENGINEERING APPROACH',
      title: 'Advanced composite engineering',
      description: 'Integrated engineering and manufacturing solutions spanning design, validation, process development and serial production',
        designTitle: 'Composite Design and Digital Engineering',
      designText: 'We transform material, geometry and structural performance into manufacturable solutions',
      }
  const engineeringCards = lang === 'tr' ? [
    {
      index: '01',
      title: 'Mühendislik ve sanal doğrulama',
      text: 'Kompozit yapıları üretim kararı alınmadan önce malzeme, geometri ve yük durumları üzerinden doğruluyoruz',
      meta: 'LAMİNE TASARIMI · FEA · OPTİMİZASYON',
      href: '/capabilities#composite-design',
    },
    {
      index: '02',
      title: 'İleri üretim prosesleri',
      text: 'RTM ve termoplastik proseslerini tekrarlanabilir kalite, düşük fire ve ölçeklenebilir üretim için geliştiriyoruz',
      meta: 'RTM · TERMOPLASTİK · PROTOTİPLEME',
      href: '/capabilities#material-process-innovation',
    },
    {
      index: '03',
      title: 'Sanayileşme ve doğrulama',
      text: 'Proses penceresini test, otomasyon ve kalite gereksinimleriyle birleştirerek seri üretime hazır hale getiriyoruz',
      meta: 'OTOMASYON · NDT · SERTİFİKASYON',
      href: '/capabilities#industrialization-automation',
    },
  ] : [
    {
      index: '01',
      title: 'Engineering and virtual verification',
      text: 'We verify composite structures across material, geometry and load cases before production decisions are released',
      meta: 'LAMINATE DESIGN · FEA · OPTIMIZATION',
      href: '/capabilities#composite-design',
    },
    {
      index: '02',
      title: 'Advanced manufacturing processes',
      text: 'We develop RTM and thermoplastic processes for repeatable quality, lower waste and scalable manufacturing',
      meta: 'RTM · THERMOPLASTICS · PROTOTYPING',
      href: '/capabilities#material-process-innovation',
    },
    {
      index: '03',
      title: 'Industrialization and validation',
      text: 'We connect process windows with testing, automation and quality requirements to prepare programs for serial production',
      meta: 'AUTOMATION · NDT · CERTIFICATION',
      href: '/capabilities#industrialization-automation',
    },
  ]
  const operationalProcess = lang === 'tr' ? [
    { title: 'Tanımla', text: 'Uygulama gereksinimlerini, yük durumlarını, malzeme hedeflerini ve üretim kısıtlarını ortak bir tasarım temelinde netleştiririz', output: 'Tasarım temeli' },
    { title: 'Mühendisliğini yap', text: 'Malzeme, yapı, takım ve proses kararlarını birlikte geliştirerek doğrulanabilir bir üretim yaklaşımı kurarız', output: 'Doğrulanmış proses penceresi' },
    { title: 'Doğrula', text: 'Analiz, test, ölçüm ve kalifikasyon çıktılarıyla performansı ve üretim kararlarını izlenebilir hale getiririz', output: 'Test kanıtı' },
    { title: 'Sanayileştir', text: 'Otomasyon, proses kontrolü ve kalite gereksinimlerini üretime hazır, tekrarlanabilir bir sisteme dönüştürürüz', output: 'Üretim onayı' },
  ] : [
    { title: 'Define', text: 'We align application requirements, load cases, material targets and manufacturing constraints in one design basis', output: 'Design basis' },
    { title: 'Engineer', text: 'We develop material, structure, tooling and process decisions together to establish a verifiable manufacturing approach', output: 'Verified process window' },
    { title: 'Verify', text: 'We make performance and production decisions traceable through analysis, testing, measurement and qualification', output: 'Test evidence' },
    { title: 'Industrialize', text: 'We convert automation, process control and quality requirements into a repeatable production-ready system', output: 'Production release' },
  ]
  function renderSection(section: typeof visibleSections[number]['section']) {
    switch (section) {
      case 'about':
        return <>
          <section id="about" className="home-engineering-showcase scroll-reveal scroll-scene" data-scroll-scene data-language={lang}>
            <div className="home-engineering-surface">
              <div className="home-engineering-cloud-field" aria-hidden="true">
                {loco3Process.map((_, index) => <span key={`engineering-cloud-${index}`} className={`home-engineering-cloud-layer is-slide-${index}${index === slide ? ' is-active' : ''}`} />)}
              </div>
              <div className="container home-engineering-layout">
                <div className="home-engineering-intro">
                  <span className="home-engineering-kicker">{lang === 'tr' ? 'LOCO3 / DÖNGÜSEL MALZEME MÜHENDİSLİĞİ' : 'LOCO3 / CIRCULAR MATERIAL ENGINEERING'}</span>
                  <h2>
                    <span>{lang === 'tr' ? 'Üretim atığından' : 'From production waste'}</span>
                    <strong>{lang === 'tr' ? 'doğrulanmış malzeme sistemine' : 'to a verified material system'}</strong>
                  </h2>
                  <div className="home-engineering-statement">
                    <p>{lang === 'tr' ? 'Kompozit üretim atıklarını; lif değerini koruyan hazırlama, kontrollü yeniden işleme ve karakterizasyon adımlarıyla otomotiv ve havacılık programlarına hazır, izlenebilir malzeme sistemlerine dönüştürüyoruz.' : 'We convert composite production waste into traceable material systems through fibre-preserving preparation, controlled reprocessing and characterisation—ready for scalable automotive and aerospace programmes.'}</p>
                    <a className="home-engineering-link" href="#capability-transition"><span>{lang === 'tr' ? 'MALZEME ROTASINI İNCELE' : 'FOLLOW THE MATERIAL ROUTE'}</span><span aria-hidden="true">↘</span></a>
                  </div>
                </div>
                <div className="home-engineering-media-carousel" role="region" aria-roledescription="carousel" aria-label={sliderControl.region}>
                  <div className="home-engineering-media-viewport">
                    {loco3Process.map((item, index) => <div
                      key={`engineering-media-${lang}-${index}`}
                      className={`home-engineering-media-slide${index === slide ? ' is-active' : ''}`}
                      aria-hidden={index !== slide}
                      role="img"
                      aria-label={`${item.stage} · ${item.label}`}
                      style={{ backgroundImage: `url('${item.image}')` }}
                    >
                      <div className="home-engineering-media-caption"><strong>{item.stage}</strong><span>{item.label}</span></div>
                    </div>)}
                  </div>
                  <div className="home-engineering-media-controls" role="group" aria-label={settings.hero.slidesLabel}>
                    <span>{String(slide + 1).padStart(2, '0')} / {String(loco3Process.length).padStart(2, '0')}</span>
                    {loco3Process.map((item, index) => <button type="button" key={`engineering-control-${index}-${index === slide ? rotationCycle : 'idle'}`} className={index === slide ? 'is-active' : undefined} aria-current={index === slide ? 'true' : undefined} aria-label={`${item.stage} · ${item.label}`} onClick={() => { setSlide(index); setRotationCycle((cycle) => cycle + 1) }} />)}
                    <button type="button" className="home-engineering-media-pause" aria-pressed={sliderPaused} aria-label={sliderPaused ? sliderControl.resume : sliderControl.pause} onClick={() => { setSliderPaused((paused) => !paused); setRotationCycle((cycle) => cycle + 1) }}>{sliderPaused ? '▶' : 'Ⅱ'}</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="capability-transition" className="capability-transition scroll-reveal" aria-labelledby="capability-transition-title">
            <div className="container capability-transition-shell">
              <header className="capability-transition-header">
                <span>{lang === 'tr' ? 'UÇTAN UCA MÜHENDİSLİK' : 'END-TO-END ENGINEERING'}</span>
                <h2 id="capability-transition-title">{lang === 'tr' ? <>Malzeme bilgisinden<br />doğrulanmış üretime</> : <>From material intelligence<br />to verified production</>}</h2>
                <p>{lang === 'tr' ? 'BaX yetkinlikleri tekil hizmetler değil, birbirini besleyen bir üretim sistemi olarak ilerler' : 'BaX capabilities operate as one connected production system rather than isolated services'}</p>
              </header>
              <div className="capability-transition-stage" role="region" aria-roledescription="carousel" aria-label={lang === 'tr' ? 'BaX yetkinlik geçişleri' : 'BaX capability transitions'}>
                <div className="capability-transition-visual">
                  {capabilityTransition.map((item, index) => <Image key={item.image} className={index === capabilitySlide ? 'is-active' : ''} src={item.image} alt={`${item.stage} — ${item.title}`} fill sizes="(max-width: 900px) 100vw, 64vw" />)}
                  <span className="capability-transition-number" aria-hidden="true">{capabilityTransition[capabilitySlide].index}</span>
                </div>
                <div className="capability-transition-copy" aria-live="polite">
                  <span>{capabilityTransition[capabilitySlide].stage}</span>
                  <h3>{capabilityTransition[capabilitySlide].title}</h3>
                  <p>{capabilityTransition[capabilitySlide].text}</p>
                </div>
              </div>
              <div className="capability-transition-controls" role="group" aria-label={lang === 'tr' ? 'Yetkinlik aşaması seçimi' : 'Select capability stage'}>
                {capabilityTransition.map((item, index) => <button type="button" key={item.index} className={index === capabilitySlide ? 'is-active' : undefined} aria-current={index === capabilitySlide ? 'true' : undefined} onClick={() => setCapabilitySlide(index)}><span>{item.index}</span><strong>{item.stage}</strong></button>)}
                <button type="button" className="capability-transition-pause" aria-pressed={capabilityPaused} aria-label={capabilityPaused ? sliderControl.resume : sliderControl.pause} onClick={() => setCapabilityPaused((current) => !current)}>{capabilityPaused ? '▶' : 'Ⅱ'}</button>
              </div>
            </div>
          </section>
          <section id="expertise" className="home-capability-index scroll-reveal" aria-labelledby="home-capability-title">
            <div className="container home-capability-shell">
              <header><span>{lang === 'tr' ? 'YETKİNLİKLER' : 'CAPABILITIES'}</span><h2 id="home-capability-title">{lang === 'tr' ? 'Bir proje için gereken üç mühendislik sistemi' : 'Three engineering systems for one production programme'}</h2><p>{lang === 'tr' ? 'Tasarım kararlarını malzeme ve proses geliştirme ile birleştiriyor, doğrulanmış üretim sistemlerine taşıyoruz' : 'We connect design decisions with material and process development, then carry them into verified production systems'}</p></header>
              <div className="home-capability-grid">{engineeringCards.map((card) => <a href={card.href} key={card.index}><span>{card.index}</span><h3>{card.title}</h3><p>{card.text}</p><small>{card.meta}</small><i aria-hidden="true">↗</i></a>)}</div>
              <a className="home-capability-all" href="/capabilities">{lang === 'tr' ? 'TÜM YETKİNLİKLERİ İNCELE' : 'EXPLORE ALL CAPABILITIES'}<span aria-hidden="true">↗</span></a>
            </div>
          </section>
          <section id="sector-applications" className="sector-applications scroll-reveal" aria-labelledby="sector-applications-title">
            <div className={`sector-applications-light is-sector-${sectorSlide}`} aria-hidden="true" />
            <div className="container sector-applications-shell">
              <header className="sector-applications-header">
                <span>{lang === 'tr' ? 'SEKTÖREL UYGULAMALAR' : 'SECTOR APPLICATIONS'}</span>
                <h2 id="sector-applications-title">{lang === 'tr' ? <>Mühendislik yaklaşımı<br />uygulamayla değer kazanır</> : <>Engineering creates value<br />through application</>}</h2>
                <p>{lang === 'tr' ? 'Aynı mühendislik zincirini farklı sektörlerin performans, üretim hacmi ve doğrulama gereksinimlerine uyarlıyoruz' : 'We adapt one connected engineering chain to the performance, production-volume and verification requirements of each sector'}</p>
              </header>
              <div className="sector-applications-index-layout">
                <nav className="sector-applications-index" aria-label={lang === 'tr' ? 'Sektör seçimi' : 'Select sector'}>
                  {sectorApplications.map((item, index) => <button type="button" key={item.index} className={index === sectorSlide ? 'is-active' : undefined} aria-current={index === sectorSlide ? 'true' : undefined} onClick={() => setSectorSlide(index)}>
                    <span>{item.index}</span><strong>{item.sector}</strong><i aria-hidden="true">↗</i>
                  </button>)}
                </nav>
                <div className="sector-applications-feature" role="region" aria-live="polite" aria-label={`${sectorApplications[sectorSlide].sector} — ${sectorApplications[sectorSlide].title}`}>
                  <div className="sector-applications-visual">
                    {sectorApplications.map((item, index) => <Image key={item.image} className={index === sectorSlide ? 'is-active' : ''} src={item.image} alt={`${item.sector} — ${item.title}`} fill sizes="(max-width: 900px) 100vw, 72vw" />)}
                    <span className="sector-applications-image-index">{sectorApplications[sectorSlide].index} / 04</span>
                  </div>
                  <article className="sector-applications-copy">
                    <div><span>{sectorApplications[sectorSlide].sector}</span><small>{sectorApplications[sectorSlide].meta}</small></div>
                    <h3>{sectorApplications[sectorSlide].title}</h3>
                    <p>{sectorApplications[sectorSlide].text}</p>
                    <a href="/capabilities">{lang === 'tr' ? 'İLGİLİ YETKİNLİKLERİ İNCELE' : 'EXPLORE RELATED CAPABILITIES'} <i aria-hidden="true">↗</i></a>
                  </article>
                </div>
              </div>
            </div>
          </section>
          <section id="verification" className="verification-strip scroll-reveal" aria-labelledby="verification-title">
            <div className="container verification-strip-shell">
              <header className="verification-strip-header">
                <div><span>{lang === 'tr' ? 'GÜVEN VE DOĞRULAMA' : 'TRUST & VERIFICATION'}</span><h2 id="verification-title">{lang === 'tr' ? <>Söylenene değil<br />doğrulanabilene güven</> : <>Trust what can<br />be verified</>}</h2></div>
                <div><p>{lang === 'tr' ? 'İzlenebilir proje kayıtları, ölçülebilir çıktılar ve bağımsız kurum doğrulamaları.' : 'Traceable programme records, measurable outputs and independent institutional validation.'}</p><small>{lang === 'tr' ? 'Her kayıt doğrudan kaynağına bağlıdır' : 'Every record links directly to its source'}</small></div>
              </header>
              <article className="verification-strip-record" key={`active-${verificationEvidence[verificationActive].code}`}>
                <div className="verification-feature-identity"><span>{verificationEvidence[verificationActive].code}</span><small>{verificationEvidence[verificationActive].type}</small><h3>{verificationEvidence[verificationActive].title}</h3></div>
                <p>{verificationEvidence[verificationActive].body}</p>
                <ul>{verificationEvidence[verificationActive].facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
                <a href={verificationEvidence[verificationActive].href} target="_blank" rel="noreferrer"><span>{lang === 'tr' ? 'KAYNAĞI AÇ' : 'OPEN SOURCE'}</span><i aria-hidden="true">↗</i></a>
              </article>
              <nav className="verification-strip-nav" aria-label={lang === 'tr' ? 'Doğrulama kaydı seçimi' : 'Verification record selection'}>
                {verificationEvidence.map((item, index) => <button key={`verification-step-${item.code}`} type="button" className={verificationActive === index ? 'is-active' : ''} onClick={() => setVerificationActive(index)} aria-label={`${index + 1}: ${item.title}`}><span>{item.code}</span><strong>{item.title}</strong></button>)}
              </nav>
            </div>
          </section>
        </>
      case 'designNarrative':
        return null
      case 'expertise':
        return null
      case 'manufacturingNarrative':
        return null
      case 'process':
        return null
      case 'principles':
        return null
      case 'solutions':
        return null
      case 'partners':
        return <EcosystemPreview lang={lang} partners={content.partners} memberships={content.memberships} />
      case 'memberships':
        return null
      case 'contact':
        return <section id="contact" className="contact-section"><div className="container contact-grid"><div className="contact-intro"><h2>{d.contactTitle}</h2><p>{d.contactText}</p><a className="contact-action" href="/iletisim">{copy.tellProject}</a></div><div className="contact-directory"><article data-contact-icon="BX"><span>{copy.company}</span><strong>{copy.companyName}</strong></article><article data-contact-icon="@"><span>{copy.email}</span><a href={`mailto:${d.email}`}>{d.email}</a></article><article data-contact-icon="+"><span>{copy.phone}</span><a href={`tel:${(d.phone || '').replace(/[^+\d]/g, '')}`}>{d.phone}</a></article><article data-contact-icon="↗"><span>{copy.web}</span><a href={copy.websiteUrl}>{copy.websiteLabel}</a></article></div></div></section>
    }
  }

  return <>
    <header className="main-header is-hero">
      <div className="container header-container">
        <div className="logo"><a href="#home" aria-label="BaX Composites"><Image className="brand-logo brand-logo-header" src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority /></a></div>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label={copy.mainNavigationLabel} onMouseEnter={cancelMegaClose} onMouseLeave={scheduleMegaClose}><ul>
          {headerNavigationItems.map(([label, id]) => {
            if (id === 'about') return <li className={`nav-with-submenu${openMegaMenu === 'about' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('about')}><div className="nav-parent-row"><a href="/sirket-profili" className={activeSection === id ? 'active' : undefined}><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'about'} aria-label={aboutNavigation.toggle} onClick={() => toggleMegaMenu('about')}><span aria-hidden="true">⌄</span></button></div></li>
            if (id === 'expertise') return <li className={`nav-with-submenu nav-expertise${openMegaMenu === 'expertise' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('expertise')}><div className="nav-parent-row"><a href="/capabilities" className={activeSection === id ? 'active' : undefined}><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'expertise'} aria-label={lang === 'tr' ? 'Yetkinlikler menüsünü aç' : 'Open capabilities menu'} onClick={() => toggleMegaMenu('expertise')}><span aria-hidden="true">⌄</span></button></div></li>
            if (id === 'ecosystem') return <li className={`nav-with-submenu nav-ecosystem${openMegaMenu === 'ecosystem' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('ecosystem')}><div className="nav-parent-row"><a href="#ecosystem" className={activeSection === id ? 'active' : undefined} onClick={(event) => navigateToSection(event, id)}><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'ecosystem'} aria-label={ecosystemNavigation.toggle} onClick={() => toggleMegaMenu('ecosystem')}><span aria-hidden="true">⌄</span></button></div></li>
            if (id === 'sustainability') return <li className={`nav-with-submenu nav-sustainability${openMegaMenu === 'sustainability' ? ' is-submenu-open' : ''}`} key={id} onMouseEnter={() => showMegaMenu('sustainability')}><div className="nav-parent-row"><a href="/surdurulebilirlik"><span className="nav-dot" aria-hidden="true" />{label}</a><button type="button" className="nav-submenu-toggle" aria-expanded={openMegaMenu === 'sustainability'} aria-label={lang === 'tr' ? 'Sürdürülebilirlik menüsünü aç' : 'Open sustainability menu'} onClick={() => toggleMegaMenu('sustainability')}><span aria-hidden="true">⌄</span></button></div></li>
            return <li key={id} onMouseEnter={() => setOpenMegaMenu(null)}><a href={`#${id}`} className={activeSection === id ? 'active' : undefined} aria-current={activeSection === id ? 'page' : undefined} onClick={(event) => navigateToSection(event, id)}><span className="nav-dot" aria-hidden="true" />{label}</a></li>
          })}
        </ul><div className={`nav-mega-panel${megaMenuOpen ? ` is-open menu-${openMegaMenu}` : ''}`} aria-hidden={!megaMenuOpen}>
          <div className="nav-mega-inner">
            <div className="nav-mega-content">
              {openMegaMenu === 'about' && <section><span>{lang === 'tr' ? 'KURUMSAL' : 'CORPORATE'}</span><h3>{lang === 'tr' ? 'BaX’ı tanıyın' : 'Discover BaX'}</h3><a href="/sirket-profili">{aboutNavigation.profile}</a><a href="/kurucu">{aboutNavigation.founder}</a><a href="/kurumsal-bilgiler">{aboutNavigation.corporate}</a></section>}
              {openMegaMenu === 'expertise' && <section><span>{lang === 'tr' ? 'YETKİNLİKLER' : 'CAPABILITIES'}</span><h3>{lang === 'tr' ? 'Kompozit mühendisliği' : 'Composite engineering'}</h3><a href="/capabilities">{lang === 'tr' ? 'Mühendislik yetkinlikleri' : 'Engineering capabilities'}</a></section>}
              {openMegaMenu === 'ecosystem' && <section><span>{lang === 'tr' ? 'EKOSİSTEM' : 'ECOSYSTEM'}</span><h3>{ecosystemNavigation.label}</h3><a href="/is-ortakliklari">{ecosystemNavigation.partnerships}</a><a href="/aglar-ve-uyelikler">{ecosystemNavigation.networks}</a></section>}
              {openMegaMenu === 'sustainability' && <section><span>{lang === 'tr' ? 'SÜRDÜRÜLEBİLİRLİK' : 'SUSTAINABILITY'}</span><h3>{lang === 'tr' ? 'Döngüsel mühendislik' : 'Circular engineering'}</h3><a href="/surdurulebilirlik">{lang === 'tr' ? 'Yaklaşımımız' : 'Our approach'}</a></section>}
            </div>
          </div>
        </div></nav>
        <button type="button" className="mobile-menu-toggle" aria-expanded={menuOpen} aria-label={copy.mobileMenuLabel} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        <div className="header-right"><a className="header-contact-link" href="/iletisim">{copy.contactUs}</a><HeaderLanguageMenu value={lang} onChange={selectLanguage} label={copy.languageLabel} /></div>
      </div>
    </header>

    <main className="home-page">
    <section id="home" className="showcase-hero" data-language={lang} aria-labelledby="showcase-title" onMouseMove={moveShowcase} onMouseLeave={resetShowcase}>
      <div className="showcase-visual" ref={showcaseScene} aria-hidden="true">
        <span className="showcase-factory" />
        <span className="showcase-white-balance" />
      </div>
      <div className="container showcase-layout">
        <div className="showcase-copy">
          <p>{cleanEyebrow(mainSlide[0])}</p>
          <h1 id="showcase-title">{lang === 'tr' ? <>İleri ve geri dönüştürülmüş kompozitler<strong>Üretim için tasarlandı</strong></> : <>Advanced and recycled composites<strong>Engineered for production</strong></>}</h1>
          <div className="showcase-description">{mainSlide[2]}</div>
          <div className="showcase-actions">
            <a className="showcase-primary" href="/iletisim">{copy.discuss}</a>
            <a href="#expertise">{lang === 'tr' ? 'YETKİNLİKLERİMİZİ KEŞFEDİN' : 'EXPLORE OUR CAPABILITIES'}</a>
          </div>
        </div>
        <div className="showcase-process" aria-hidden="true">
          <span className="process-industrialize">INDUSTRIALIZE<i /></span><span className="process-validate">VALIDATE<i /></span><span className="process-engineer">ENGINEER<i /></span><span className="process-recover">RECOVER<i /></span>
        </div>
      </div>
    </section>

    {orderedSections.map(({ section }) => <Fragment key={section}>{renderSection(section)}</Fragment>)}
    </main>
    <PublicFooter lang={lang} />

  </>
}
