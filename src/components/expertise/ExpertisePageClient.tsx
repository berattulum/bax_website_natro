'use client'

import { useEffect, useState } from 'react'
import type { ManagedLocale } from '@/components/ManagedSections'
import { CorporateHeader } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'

type Lang = 'tr' | 'en'

const anchors = [
  'composite-design',
  'industrialization-automation',
  'material-process-innovation',
  'testing-qualification-certification',
  'tooling-machinery-equipment',
  'engineering-consulting',
] as const

const expertiseVideos: Array<{ src: string; poster?: string }> = [
  { src: '/assets/solution-civil-loop.mp4', poster: '/assets/solution-civil-aviation.webp' },
  { src: '/assets/industrialization-automation-loop-v1.mp4', poster: '/assets/industrialization-robot-start-v1.png' },
  { src: '/assets/material-process-innovation-loop-v1.mp4' },
  { src: '/assets/testing-qualification-loop-v1.mp4' },
]

const expertiseDetails: Record<Lang, string[][]> = {
  tr: [
    [
      'Kavramsal parça ve laminat tasarımı',
      'CAD ve CAE destekli geometri geliştirme',
      'Sonlu eleman analizleri ile yapısal performans değerlendirmesi',
      'Ağırlık performans ve üretilebilirlik odaklı optimizasyon',
      'Tasarımın üretim gereksinimleriyle birlikte doğrulanması',
    ],
    [
      'Malzeme ve proses gereksinimlerine uygun üretim yöntemi seçimi',
      'Tekrarlanabilir seri üretim hattı ve hücre kurgusu',
      'Çevrim süresi kapasite ve proses kararlılığı geliştirme',
      'Otomasyon ekipman ve operasyon akışının bütünleşik tasarımı',
      'Prototipten ölçeklenebilir üretime kontrollü geçiş',
    ],
    [
      'Termoset ve termoplastik kompozit sistemlerin değerlendirilmesi',
      'Uygulamaya uygun malzeme ve proses kombinasyonunun geliştirilmesi',
      'Sürdürülebilir malzeme seçeneklerinin teknik gereksinimlerle birlikte ele alınması',
      'Geri dönüştürülmüş karbon fiberin ürün ve proses gereksinimlerine göre değerlendirilmesi',
      'Prototip üretimi ve proses parametrelerinin doğrulanması',
    ],
    [
      'Ürün ve proses gereksinimlerine uygun mekanik test planları',
      'Yapısal performansın ölçüm ve analiz ile doğrulanması',
      'Tahribatsız muayene yaklaşımının parça ve prosesle eşleştirilmesi',
      'Ürün ve proses kalifikasyonu için doğrulanabilir teknik kayıt',
      'Sertifikasyon sürecini destekleyen test ve dokümantasyon altyapısı',
    ],
    [
      'Kalıp fikstür ve yardımcı ekipman tasarımı',
      'Üretim ekipmanlarının imalat ve devreye alma koordinasyonu',
      'Performans tekrarlanabilirlik ve proses uyumluluğu doğrulaması',
      'Ürüne ve üretim akışına özel makine çözümleri',
      'Bakım erişilebilirliği ve uzun dönem üretim kararlılığı odağı',
    ],
    [
      'Teknoloji ve yetkinlik yol haritalarının oluşturulması',
      'Proses ve tedarikçi yetkinlik değerlendirmeleri',
      'Teknik risklerin üretim hedefleriyle birlikte ele alınması',
      'Mühendislik ekiplerine yönelik uygulamalı teknik eğitim',
      'Kurumsal bilgi aktarımı ve sürdürülebilir yetkinlik gelişimi',
    ],
  ],
  en: [
    [
      'Conceptual part and laminate design',
      'CAD and CAE supported geometry development',
      'Structural performance evaluation through finite element analysis',
      'Optimization focused on weight performance and manufacturability',
      'Verification of design requirements together with manufacturing constraints',
    ],
    [
      'Manufacturing process selection aligned with material and product requirements',
      'Repeatable serial production line and cell architecture',
      'Cycle time capacity and process stability improvement',
      'Integrated development of automation equipment and operational flow',
      'Controlled transition from prototype to scalable production',
    ],
    [
      'Evaluation of thermoset and thermoplastic composite systems',
      'Development of material and process combinations for the intended application',
      'Integration of sustainable material options with technical requirements',
      'Assessment of recycled carbon fiber against product and process requirements',
      'Prototype manufacturing and verification of process parameters',
    ],
    [
      'Mechanical test plans aligned with product and process requirements',
      'Structural performance verification through measurement and analysis',
      'Selection of non destructive inspection methods for the part and process',
      'Traceable technical records for product and process qualification',
      'Testing and documentation infrastructure supporting certification activities',
    ],
    [
      'Design of molds fixtures and auxiliary equipment',
      'Manufacturing and commissioning coordination for production equipment',
      'Verification of performance repeatability and process compatibility',
      'Custom machinery solutions aligned with product and production flow',
      'Focus on maintenance access and long term production stability',
    ],
    [
      'Development of technology and capability roadmaps',
      'Process and supplier capability assessments',
      'Evaluation of technical risks together with production targets',
      'Applied technical training for engineering teams',
      'Organizational knowledge transfer and sustainable capability development',
    ],
  ],
}

const expertiseFallback: Record<Lang, Array<{ order: number; title: string; description: string }>> = {
  tr: [
    { order: 1, title: 'Kompozit Tasarım ve Dijital Mühendislik', description: 'Malzeme geometri ve yapısal performansı üretilebilir kompozit çözümlere dönüştüren bütünleşik mühendislik yaklaşımı' },
    { order: 2, title: 'Endüstrileştirme ve Otomasyon', description: 'Proses seçiminden seri üretim hattına uzanan tekrarlanabilir verimli ve ölçeklenebilir üretim sistemi geliştirme' },
    { order: 3, title: 'Malzeme ve Proses İnovasyonu', description: 'Termoset termoplastik sürdürülebilir ve geri dönüştürülmüş malzeme seçenekleri için uygulama odaklı proses geliştirme' },
    { order: 4, title: 'Test Kalifikasyon ve Sertifikasyon', description: 'Ürün ve proses performansını ölçülebilir teknik kanıtlarla doğrulayan planlı test ve kalifikasyon yaklaşımı' },
    { order: 5, title: 'Kalıp Makine ve Ekipman', description: 'Kompozit üretim akışına uygun kalıp fikstür özel makine ve üretim ekipmanı geliştirme' },
    { order: 6, title: 'Mühendislik Danışmanlığı ve Yetkinlik Geliştirme', description: 'Teknoloji yol haritasından teknik eğitime uzanan kurumsal mühendislik yetkinliği geliştirme' },
  ],
  en: [
    { order: 1, title: 'Composite Design and Digital Engineering', description: 'An integrated engineering approach transforming material geometry and structural performance into manufacturable composite solutions' },
    { order: 2, title: 'Industrialization and Automation', description: 'Development of repeatable efficient and scalable production systems from process selection to serial production lines' },
    { order: 3, title: 'Material and Process Innovation', description: 'Application focused process development for thermoset thermoplastic sustainable and recycled material options' },
    { order: 4, title: 'Testing Qualification and Certification', description: 'A planned testing and qualification approach verifying product and process performance through measurable technical evidence' },
    { order: 5, title: 'Tooling Machinery and Equipment', description: 'Development of molds fixtures custom machinery and production equipment aligned with composite manufacturing flow' },
    { order: 6, title: 'Engineering Consulting and Capability Development', description: 'Organizational engineering capability development spanning technology roadmaps assessment and technical training' },
  ],
}

function withoutPeriods(value: string) {
  return value.replace(/[.。]+/g, '').trim()
}

export function ExpertisePageClient({ locales }: { locales: Record<Lang, ManagedLocale> }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  const setLanguage = (next: Lang) => {
    localStorage.setItem('bax-language', next)
    setLang(next)
  }

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-expertise-parallax]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || scenes.length === 0) return

    let frame = 0
    const updateScenes = () => {
      frame = 0
      const viewport = window.innerHeight
      scenes.forEach((scene) => {
        const bounds = scene.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (viewport - bounds.top) / (viewport + bounds.height)))
        const focus = 1 - Math.min(1, Math.abs(progress - .5) * 2)
        scene.style.setProperty('--scene-progress', progress.toFixed(4))
        scene.style.setProperty('--scene-focus', focus.toFixed(4))
        scene.style.setProperty('--scene-media-shift', `${((progress - .5) * -11).toFixed(2)}%`)
        scene.style.setProperty('--scene-copy-shift', `${((progress - .5) * -32).toFixed(2)}px`)
        scene.style.setProperty('--scene-media-lift', `${((1 - focus) * 28).toFixed(2)}px`)
        scene.style.setProperty('--scene-media-scale', (0.96 + focus * 0.04).toFixed(4))
        scene.classList.toggle('is-scroll-active', focus > .42)
      })
    }
    const requestUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateScenes)
    }

    updateScenes()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  const items = expertiseFallback[lang].map((fallback, index) => ({
    ...fallback,
    ...locales[lang].expertise[index],
  }))

  return <main className="expertise-page">
    <CorporateHeader lang={lang} active="expertise" onLangChange={setLanguage} />

    <section className="expertise-page-hero">
      <span>{lang === 'tr' ? 'MÜHENDİSLİK YETKİNLİKLERİ' : 'ENGINEERING CAPABILITIES'}</span>
      <h1>{lang === 'tr' ? 'Uzmanlıklarımız' : 'Expertise'}</h1>
      <p>{lang === 'tr' ? 'Tasarımdan seri üretime uzanan bütünleşik kompozit mühendisliği' : 'Integrated composite engineering from design to serial production'}</p>
    </section>

    <div className="expertise-page-sections">
      {items.map((item, index) => <section id={anchors[index]} className={`expertise-page-section${expertiseVideos[index] ? ' has-video' : ''}`} data-expertise-parallax key={item.order}>
        <span className="expertise-page-index">{String(index + 1).padStart(2, '0')}</span>
        {expertiseVideos[index] && <div className="expertise-page-media">
          <video autoPlay muted loop playsInline preload="metadata" poster={expertiseVideos[index].poster} aria-hidden="true">
            <source src={expertiseVideos[index].src} type="video/mp4" />
          </video>
        </div>}
        <div className="expertise-page-copy">
          <h2>{item.title}</h2>
          <p>{withoutPeriods(item.description)}</p>
          <ul>{expertiseDetails[lang][index]?.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        </div>
      </section>)}
    </div>
    <PublicFooter lang={lang} />
  </main>
}
