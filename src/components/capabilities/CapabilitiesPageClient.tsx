'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { ManagedLocale } from '@/components/ManagedSections'
import { CorporateHeader } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import styles from './CapabilitiesPageClient.module.css'

type Lang = 'tr' | 'en'

const anchors = [
  'composite-design',
  'industrialization-automation',
  'material-process-innovation',
  'testing-qualification-certification',
  'tooling-machinery-equipment',
  'engineering-consulting',
] as const

const expertiseVideos: Array<{ src?: string; poster: string }> = [
  { src: '/assets/solution-civil-loop.mp4', poster: '/assets/solution-civil-aviation.webp' },
  { src: '/assets/industrialization-automation-loop-v1.mp4', poster: '/assets/industrialization-robot-start-v1.png' },
  { src: '/assets/material-process-dynamic-close.mp4', poster: '/assets/loco3-process/02-low-shear-extrusion-sheet-v1.png' },
  { src: '/assets/testing-qualification-loop-v1.mp4', poster: '/assets/capability-transition/04-structural-test-validation.png' },
  { poster: '/assets/capability-transition/03-robotic-flexible-composite-machining.png' },
  { poster: '/assets/capability-transition/01-structural-design-analysis.png' },
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

const capabilityOutputs: Record<Lang, string[][]> = {
  tr: [
    ['Tasarım temeli ve gereksinim matrisi', 'Analiz sonuçları ve doğrulama planı', 'Üretime aktarılabilir teknik veri paketi'],
    ['Proses akış ve kapasite kurgusu', 'Hat hücre ve otomasyon konsepti', 'Devreye alma ve üretim serbest bırakma kriterleri'],
    ['Malzeme ve proses seçim raporu', 'Proses penceresi ve numune planı', 'Prototip ve ölçek büyütme teknik kaydı'],
    ['Test planı ve kabul kriterleri', 'Ölçüm test ve muayene kanıtları', 'Kalifikasyon ve sertifikasyon destek dosyası'],
    ['Kalıp fikstür ve ekipman tasarım paketi', 'İmalat ve devreye alma gereksinimleri', 'Performans ve tekrarlanabilirlik kabul kaydı'],
    ['Teknoloji ve yetkinlik yol haritası', 'Teknik risk ve tedarikçi değerlendirmesi', 'Eğitim ve kurumsal bilgi aktarım planı'],
  ],
  en: [
    ['Design basis and requirements matrix', 'Analysis results and verification plan', 'Production-transferable technical data package'],
    ['Process flow and capacity architecture', 'Line cell and automation concept', 'Commissioning and production-release criteria'],
    ['Material and process selection report', 'Process window and specimen plan', 'Prototype and scale-up technical record'],
    ['Test plan and acceptance criteria', 'Measurement test and inspection evidence', 'Qualification and certification support file'],
    ['Tool fixture and equipment design package', 'Manufacturing and commissioning requirements', 'Performance and repeatability acceptance record'],
    ['Technology and capability roadmap', 'Technical risk and supplier assessment', 'Training and organizational knowledge-transfer plan'],
  ],
}

const capabilityConnections: Record<Lang, string[]> = {
  tr: [
    'Malzeme seçimi · Yapısal gereksinimler · Üretilebilirlik · Doğrulama',
    'Proses geliştirme · Takımlama · Otomasyon · Kalite kontrol',
    'Termosetler · Termoplastikler · Geri dönüştürülmüş karbon fiber · LCA girdileri',
    'Analiz korelasyonu · Mekanik test · NDT · Teknik dokümantasyon',
    'Ürün geometrisi · Proses penceresi · Operatör erişimi · Bakım gereksinimleri',
    'Teknoloji seçimi · Organizasyon · Tedarik zinciri · Uygulamalı eğitim',
  ],
  en: [
    'Material selection · Structural requirements · Manufacturability · Verification',
    'Process development · Tooling · Automation · Quality control',
    'Thermosets · Thermoplastics · Recycled carbon fibre · LCA inputs',
    'Analysis correlation · Mechanical testing · NDT · Technical documentation',
    'Product geometry · Process window · Operator access · Maintenance requirements',
    'Technology selection · Organization · Supply chain · Applied training',
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

export function CapabilitiesPageClient({ locales }: { locales: Record<Lang, ManagedLocale> }) {
  const [lang, setLang] = useState<Lang>('en')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  const setLanguage = (next: Lang) => {
    localStorage.setItem('bax-language', next)
    setLang(next)
  }

  useEffect(() => {
    const index = anchors.indexOf(window.location.hash.slice(1) as typeof anchors[number])
    if (index >= 0) setActiveIndex(index)
  }, [])

  const items = expertiseFallback[lang].map((fallback, index) => ({
    ...fallback,
    ...locales[lang].expertise[index],
  }))
  const activeItem = items[activeIndex]
  const activeVideo = expertiseVideos[activeIndex]

  const selectCapability = (index: number) => {
    setActiveIndex(index)
    window.history.replaceState(null, '', `#${anchors[index]}`)
  }

  const labels = lang === 'tr' ? {
    heroEyebrow: 'BAX COMPOSITES / YETKİNLİKLER', heroTitle: 'Mühendislik kararlarından doğrulanmış üretime', heroBody: 'İleri ve geri dönüştürülmüş kompozitler için tasarım malzeme proses doğrulama ve sanayileştirme tek bir teknik sorumluluk altında ilerler',
    explorerEyebrow: 'BAĞLANTILI MÜHENDİSLİK SİSTEMİ', explorerTitle: 'Yetkinliklerimiz üretim hedefi etrafında birlikte çalışır', explorerBody: 'Her alanı teknik kapsamı somut teslim çıktıları ve diğer mühendislik disiplinleriyle bağlantısı üzerinden inceleyin', scope: 'TEKNİK KAPSAM', outputs: 'TESLİM ÇIKTILARI', connections: 'BAĞLANTILI ALANLAR', systemEyebrow: 'PROJE TESLİM SİSTEMİ', systemTitle: 'Gereksinimden üretim serbest bırakmaya', systemBody: 'Her aşama tanımlı bir teknik karar doğrulanabilir kanıt ve sonraki aşamaya aktarılabilir çıktı üretir', evidenceEyebrow: 'DOĞRULANMIŞ PROGRAM KAYITLARI', evidenceTitle: 'Yetkinlikleri destekleyen uluslararası programlar', evidenceBody: 'BaX’ın geri dönüştürülmüş kompozitler esnek işleme ve düşük karbonlu parça geliştirme çalışmalarını doğrulayan resmi program kayıtları', cta: 'Projeniz için doğru teknik başlangıç noktasını birlikte belirleyelim', ctaLink: 'PROJENİZİ GÖRÜŞELİM', source: 'RESMİ KAYDI İNCELE',
  } : {
    heroEyebrow: 'BAX COMPOSITES / CAPABILITIES', heroTitle: 'From engineering decisions to verified production', heroBody: 'Design material process verification and industrialization for advanced and recycled composites progress under one technical responsibility',
    explorerEyebrow: 'CONNECTED ENGINEERING SYSTEM', explorerTitle: 'Capabilities working together around production intent', explorerBody: 'Explore each area through its technical scope tangible deliverables and connection to the wider engineering system', scope: 'TECHNICAL SCOPE', outputs: 'DELIVERABLES', connections: 'CONNECTED DOMAINS', systemEyebrow: 'PROJECT DELIVERY SYSTEM', systemTitle: 'From requirements to production release', systemBody: 'Every stage produces a defined technical decision verifiable evidence and an output ready for the next stage', evidenceEyebrow: 'VERIFIED PROGRAMME RECORDS', evidenceTitle: 'International programmes supporting our capability', evidenceBody: 'Official programme records connecting BaX with recycled composites flexible machining and low carbon component development', cta: 'Let us define the right technical starting point for your programme', ctaLink: 'DISCUSS YOUR PROJECT', source: 'VIEW OFFICIAL RECORD',
  }

  const stages = lang === 'tr'
    ? [['01', 'Tanımla', 'Uygulama gereksinimleri yük durumları malzeme hedefleri ve üretim kısıtları'], ['02', 'Tasarla', 'Malzeme yapı kalıp ve proses kararları tek sistem içinde geliştirilir'], ['03', 'Proses geliştir', 'Proses penceresi takım ve üretim yöntemi tekrarlanabilirlik için olgunlaştırılır'], ['04', 'Doğrula', 'Analiz test ölçüm ve muayene sonuçları izlenebilir teknik kanıta dönüşür'], ['05', 'Yaşam döngüsünü ölç', 'Malzeme enerji kaynak ve kullanım sonu verileri LCA kararlarını besler'], ['06', 'Sanayileştir', 'Otomasyon proses kontrol ve kalite gereksinimleri üretime aktarılır']]
    : [['01', 'Define', 'Application requirements load cases material targets and manufacturing constraints'], ['02', 'Engineer', 'Material structure tooling and process decisions developed as one system'], ['03', 'Develop process', 'Process window tooling and manufacturing method matured for repeatability'], ['04', 'Verify', 'Analysis testing measurement and inspection become traceable technical evidence'], ['05', 'Measure lifecycle', 'Material energy resource and end of life data inform LCA decisions'], ['06', 'Industrialize', 'Automation process control and quality requirements transferred into production']]

  return <main className={styles.page}>
    <CorporateHeader lang={lang} active="capabilities" onLangChange={setLanguage} />

    <section className={styles.hero}>
      <span>{labels.heroEyebrow}</span><h1>{labels.heroTitle}</h1><p>{labels.heroBody}</p>
    </section>

    <section className={styles.explorer} aria-label={lang === 'tr' ? 'Mühendislik yetkinlikleri' : 'Engineering capabilities'}>
      <header className={styles.sectionHeader}><span>{labels.explorerEyebrow}</span><h2>{labels.explorerTitle}</h2><p>{labels.explorerBody}</p></header>
      <div className={styles.tabs} role="tablist" aria-label={lang === 'tr' ? 'Yetkinlik seçin' : 'Choose a capability'}>
        {items.map((item, index) => <button
          id={`capability-tab-${index}`}
          className={index === activeIndex ? styles.activeTab : ''}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-controls="capability-panel"
          onClick={() => selectCapability(index)}
          key={item.order}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item.title}</strong>
        </button>)}
      </div>

      <article id="capability-panel" className={styles.panel} role="tabpanel" aria-labelledby={`capability-tab-${activeIndex}`}>
        <div className={styles.media} key={`media-${activeIndex}`}>
          {activeVideo.src ? <video autoPlay muted loop playsInline preload="metadata" poster={activeVideo.poster} aria-hidden="true"><source src={activeVideo.src} type="video/mp4" /></video> : <Image src={activeVideo.poster} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" />}
          <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        </div>
        <div className={styles.copy} key={`copy-${activeIndex}`}>
          <span>{lang === 'tr' ? 'YETKİNLİK ALANI' : 'CAPABILITY AREA'} · {String(activeIndex + 1).padStart(2, '0')}</span>
          <h3>{activeItem.title}</h3><p className={styles.summary}>{withoutPeriods(activeItem.description)}</p>
          <div className={styles.details}><div><h4>{labels.scope}</h4><ul>{expertiseDetails[lang][activeIndex]?.map((detail) => <li key={detail}>{detail}</li>)}</ul></div><div><h4>{labels.outputs}</h4><ol>{capabilityOutputs[lang][activeIndex]?.map((output, index) => <li key={output}><span>{String(index + 1).padStart(2, '0')}</span>{output}</li>)}</ol></div></div>
          <div className={styles.connection}><span>{labels.connections}</span><p>{capabilityConnections[lang][activeIndex]}</p></div>
        </div>
      </article>
    </section>
    <section className={styles.system}><header><span>{labels.systemEyebrow}</span><h2>{labels.systemTitle}</h2><p>{labels.systemBody}</p></header><div className={styles.stages}>{stages.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className={styles.evidence}><header><span>{labels.evidenceEyebrow}</span><h2>{labels.evidenceTitle}</h2><p>{labels.evidenceBody}</p></header><div className={styles.evidenceLinks}>
      <a href="https://www.m-era.net/materipedia/2022/machflexcomp" target="_blank" rel="noreferrer"><span>M-ERA.NET · MACHFLEXCOMP</span><strong>{lang === 'tr' ? 'Geri dönüştürülmüş kompozitlerin esnek ve robotik işlenmesi' : 'Flexible and robotic machining of recycled composites'}</strong><em>{labels.source} ↗</em></a>
      <a href="https://www.eurekanetwork.org/wp-content/uploads/2026/01/participants-in-eurostars-3-projects.pdf" target="_blank" rel="noreferrer"><span>EUROSTARS · LOCO3</span><strong>{lang === 'tr' ? 'Düşük CO₂ kompozit bileşen geliştirme programı' : 'Low CO₂ composite component development programme'}</strong><em>{labels.source} ↗</em></a>
    </div></section>
    <section className={styles.cta}><h2>{labels.cta}</h2><a href="mailto:info@baxcomposites.com">{labels.ctaLink} ↗</a></section>
    <PublicFooter lang={lang} />
  </main>
}
