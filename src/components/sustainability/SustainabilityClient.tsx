'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import styles from './SustainabilityClient.module.css'
import { PublicFooter } from '@/components/PublicFooter'

const copy = {
  en: {
    heroKicker: 'SUSTAINABILITY BY ENGINEERING',
    heroTitle: <>Keep performance<br /><em>Keep value in motion</em></>,
    heroText: 'We engineer composite systems to use material with greater intent across design manufacturing and the next material life',
    heroCta: 'Explore our commitment',
    heroTags: ['RTM', 'Thermoplastics', 'Recycled carbon fiber', 'Life cycle thinking'],
    introKicker: 'OUR POSITION',
    introTitle: <>Sustainability begins<br />before production</>,
    introText: 'For BaX Composites sustainability is a design and manufacturing discipline We focus on the decisions we can influence directly and build evidence before making environmental claims',
    commitments: [
      ['Measure before we claim', 'Define boundaries collect process data and compare alternatives on a consistent basis'],
      ['Use material with intent', 'Reduce avoidable scrap and keep high value material in productive use for longer'],
      ['Design the next life', 'Consider recovery reuse and renewed applications from the first design decision'],
      ['Protect performance', 'Advance circularity together with mechanical quality process stability and safety'],
    ],
    positionKicker: 'WHERE WE ARE',
    positionTitle: 'A practical path built around the processes we know',
    platforms: [
      ['01', 'RTM', 'Controlled resin flow repeatable closed mould processing and opportunities to improve material use through process design'],
      ['02', 'TP', 'Thermoplastic composite routes with the potential for reshaping joining repair and material recovery depending on the selected system'],
      ['03', 'RCF', 'A focused engineering programme for design treatment and manufacturing with recycled carbon fiber'],
      ['04', 'LCA', 'A measurement framework under development to compare material process energy scrap and end of life scenarios'],
    ],
    systemKicker: 'RECYCLED CARBON FIBER',
    systemTitle: 'One material journey built in the right order',
    journey: [
      ['Virgin carbon fiber', 'Understand the original material value before deciding how it can remain productive'],
      ['Material recovery', 'Recover carbon fiber from suitable material streams with traceability and controlled boundaries'],
      ['Fiber treatment', 'Develop surface dispersion and interface behaviour for manufacturing compatibility'],
      ['Recycled carbon fiber utilization', 'Design load paths geometry and product architecture around recovered material capability'],
      ['Life cycle assessment', 'Measure material process energy scrap and end of life scenarios before making environmental claims'],
    ],
    journeyProgress: 'Material journey',
    engineeringDetail: 'Engineering the next material life',
    steps: [
      ['01', 'Design for recycled carbon fiber utilization', 'Begin with geometry load paths fiber placement and product architecture so recovered material can create meaningful value'],
      ['02', 'Treatment of recycled carbon fiber for enhanced mechanical and manufacturing characteristics', 'Develop surface dispersion and interface behaviour to support mechanical performance and process compatibility'],
      ['03', 'Manufacturing products with recycled carbon fiber', 'Translate material knowledge into repeatable processing quality control and product verification'],
    ],
    lcaKicker: 'LIFE CYCLE ASSESSMENT',
    lcaTitle: <>A claim is only as strong<br />as its boundary</>,
    lcaText: 'Our LCA approach is being structured to turn process knowledge into comparable evidence The first priority is a transparent cradle to gate view that can grow with reliable data',
    lcaStages: ['Raw material', 'Inbound transport', 'Process energy', 'Manufacturing scrap', 'Product use assumptions', 'End of life scenario'],
    lcaNote: 'No decorative numbers No selective boundaries No result before the data',
    sdgKicker: 'UNITED NATIONS 2030 AGENDA',
    sdgTitle: '17 shared goals with four clear connections to our work',
    sdgText: 'The 17 Sustainable Development Goals are integrated and indivisible Our work is most directly connected to industrial innovation responsible production climate informed decisions and partnerships',
    goals: [
      ['09', 'Industry innovation and infrastructure', 'Process innovation resource efficiency and more sustainable industrial capability'],
      ['12', 'Responsible consumption and production', 'Efficient material use waste reduction traceability and circular product thinking'],
      ['13', 'Climate action', 'Life cycle evidence that supports lower impact material and process decisions'],
      ['17', 'Partnerships for the goals', 'Collaboration across material suppliers research networks customers and manufacturing partners'],
    ],
    sdgDisclaimer: 'Alignment framework only and not a statement of United Nations endorsement',
    whyKicker: 'WHY IT MATTERS',
    whyTitle: <>Because material value<br /><em>should not disappear</em></>,
    whyText: 'Pollution resource loss and climate pressure are engineering constraints as much as environmental ones Better systems begin with honest boundaries careful material choices and processes that can be verified',
    penguin: 'And yes the penguins are part of the equation too',
    principles: [['Measurable', 'Comparable process and material data'], ['Traceable', 'Information continuity from source to part'], ['Verifiable', 'Quality and environmental reasoning together'], ['Scalable', 'A route from development to serial production']],
    closingKicker: 'OUR COMMITMENT',
    closingTitle: <>Less assumption<br /><em>More evidence</em><br />Better material decisions</>,
    closingText: 'We commit to learning measuring and improving with every programme while keeping engineering performance at the centre',
    closingCta: 'Start a responsible programme',
    back: 'Return home',
  },
  tr: {
    heroKicker: 'MÜHENDİSLİKLE SÜRDÜRÜLEBİLİRLİK',
    heroTitle: <>Performansı koru<br /><em>Değeri döngüde tut</em></>,
    heroText: 'Kompozit sistemleri malzemeyi tasarımdan üretime ve bir sonraki malzeme yaşamına kadar daha bilinçli kullanmak için geliştiriyoruz',
    heroCta: 'Taahhüdümüzü keşfet',
    heroTags: ['RTM', 'Termoplastikler', 'Geri dönüştürülmüş karbon fiber', 'Yaşam döngüsü yaklaşımı'],
    introKicker: 'KONUMUMUZ',
    introTitle: <>Sürdürülebilirlik<br />üretimden önce başlar</>,
    introText: 'BaX Kompozit için sürdürülebilirlik bir tasarım ve üretim disiplinidir Doğrudan etkileyebildiğimiz kararlara odaklanır ve çevresel iddialardan önce kanıt oluştururuz',
    commitments: [
      ['İddia etmeden önce ölç', 'Sınırları belirle proses verisini topla ve alternatifleri tutarlı bir temelde karşılaştır'],
      ['Malzemeyi bilinçli kullan', 'Önlenebilir firesi azalt ve yüksek değerli malzemeyi daha uzun süre üretken kullanımda tut'],
      ['Sonraki yaşamı tasarla', 'Geri kazanımı yeniden kullanımı ve yeni uygulamaları ilk tasarım kararından itibaren düşün'],
      ['Performansı koru', 'Döngüselliği mekanik kalite proses kararlılığı ve güvenlikle birlikte geliştir'],
    ],
    positionKicker: 'BUGÜN NEREDEYİZ',
    positionTitle: 'Bildiğimiz proseslerin üzerine kurulan gerçekçi bir yol',
    platforms: [
      ['01', 'RTM', 'Kontrollü reçine akışı tekrarlanabilir kapalı kalıp üretimi ve proses tasarımıyla malzeme kullanımını iyileştirme fırsatları'],
      ['02', 'TP', 'Seçilen sisteme bağlı olarak yeniden şekillendirme birleştirme onarım ve malzeme geri kazanımı potansiyeli taşıyan termoplastik kompozit rotaları'],
      ['03', 'RCF', 'Geri dönüştürülmüş karbon fiberle tasarım iyileştirme ve üretime odaklanan mühendislik programı'],
      ['04', 'LCA', 'Malzeme proses enerji fire ve yaşam sonu senaryolarını karşılaştırmak için geliştirilmekte olan ölçüm çerçevesi'],
    ],
    systemKicker: 'GERİ DÖNÜŞTÜRÜLMÜŞ KARBON FİBER',
    systemTitle: 'Doğru sırayla kurulan tek bir malzeme yolculuğu',
    journey: [
      ['Birincil karbon fiber', 'Bir sonraki kullanım kararından önce malzemenin ilk değerini ve performansını anla'],
      ['Malzeme geri kazanımı', 'Uygun malzeme akışlarından karbon fiberi izlenebilir ve kontrollü sınırlarla geri kazan'],
      ['Fiber iyileştirme', 'Üretim uyumluluğu için yüzey dağılım ve ara yüz davranışını geliştir'],
      ['Geri dönüştürülmüş karbon fiber kullanımı', 'Yük yollarını geometriyi ve ürün mimarisini geri kazanılmış malzeme yeteneğine göre tasarla'],
      ['Yaşam döngüsü değerlendirmesi', 'Çevresel iddiadan önce malzeme proses enerji fire ve yaşam sonu senaryolarını ölç'],
    ],
    journeyProgress: 'Malzeme yolculuğu',
    engineeringDetail: 'Bir sonraki malzeme yaşamını mühendislikle kurmak',
    steps: [
      ['01', 'Geri dönüştürülmüş karbon fiber kullanımı için tasarım', 'Geri kazanılmış malzemenin anlamlı değer üretmesi için geometri yük yolları fiber yerleşimi ve ürün mimarisiyle başla'],
      ['02', 'Mekanik ve üretim özelliklerini geliştirmek için geri dönüştürülmüş karbon fiberin iyileştirilmesi', 'Mekanik performansı ve proses uyumluluğunu desteklemek için yüzey dağılım ve ara yüz davranışını geliştir'],
      ['03', 'Geri dönüştürülmüş karbon fiberle ürün üretimi', 'Malzeme bilgisini tekrarlanabilir proses kalite kontrolü ve ürün doğrulamasına dönüştür'],
    ],
    lcaKicker: 'YAŞAM DÖNGÜSÜ DEĞERLENDİRMESİ',
    lcaTitle: <>Bir iddia ancak<br />sınırları kadar güçlüdür</>,
    lcaText: 'LCA yaklaşımımız proses bilgisini karşılaştırılabilir kanıta dönüştürmek üzere yapılandırılıyor İlk öncelik güvenilir veriyle büyüyebilen şeffaf bir beşikten kapıya görünüm oluşturmak',
    lcaStages: ['Hammadde', 'Gelen lojistik', 'Proses enerjisi', 'Üretim firesi', 'Ürün kullanım varsayımları', 'Yaşam sonu senaryosu'],
    lcaNote: 'Dekoratif sayı yok Seçici sınır yok Veriden önce sonuç yok',
    sdgKicker: 'BİRLEŞMİŞ MİLLETLER 2030 GÜNDEMİ',
    sdgTitle: '17 ortak hedef ve çalışmalarımızla dört açık bağlantı',
    sdgText: '17 Sürdürülebilir Kalkınma Amacı bütünleşik ve bölünmezdir Çalışmalarımız sanayi inovasyonu sorumlu üretim iklim odaklı kararlar ve ortaklıklarla doğrudan ilişkilidir',
    goals: [
      ['09', 'Sanayi yenilikçilik ve altyapı', 'Proses inovasyonu kaynak verimliliği ve daha sürdürülebilir sanayi yetkinliği'],
      ['12', 'Sorumlu üretim ve tüketim', 'Verimli malzeme kullanımı fire azaltımı izlenebilirlik ve döngüsel ürün düşüncesi'],
      ['13', 'İklim eylemi', 'Daha düşük etkili malzeme ve proses kararlarını destekleyen yaşam döngüsü kanıtı'],
      ['17', 'Amaçlar için ortaklıklar', 'Malzeme tedarikçileri araştırma ağları müşteriler ve üretim ortakları arasında iş birliği'],
    ],
    sdgDisclaimer: 'Yalnızca uyum çerçevesidir ve Birleşmiş Milletler onayı anlamına gelmez',
    whyKicker: 'NEDEN ÖNEMLİ',
    whyTitle: <>Çünkü malzeme değeri<br /><em>kaybolmamalı</em></>,
    whyText: 'Kirlilik kaynak kaybı ve iklim baskısı çevresel olduğu kadar mühendislik kısıtlarıdır Daha iyi sistemler dürüst sınırlar dikkatli malzeme kararları ve doğrulanabilir proseslerle başlar',
    penguin: 'Ve evet penguenler de bu denklemin içinde',
    principles: [['Ölçülebilir', 'Karşılaştırılabilir proses ve malzeme verisi'], ['İzlenebilir', 'Kaynaktan parçaya bilgi sürekliliği'], ['Doğrulanabilir', 'Kalite ve çevresel yaklaşım birlikte'], ['Ölçeklenebilir', 'Geliştirmeden seri üretime uzanan rota']],
    closingKicker: 'TAAHHÜDÜMÜZ',
    closingTitle: <>Daha az varsayım<br /><em>Daha çok kanıt</em><br />Daha iyi malzeme kararları</>,
    closingText: 'Mühendislik performansını merkezde tutarken her programda öğrenmeyi ölçmeyi ve gelişmeyi taahhüt ediyoruz',
    closingCta: 'Sorumlu bir program başlat',
    back: 'Ana sayfaya dön',
  },
} as const

export function SustainabilityClient() {
  const [lang, setLang] = useState<CorporateLang>('en')
  const [journeyStep, setJourneyStep] = useState(0)
  const journeyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  useEffect(() => {
    const updateJourney = () => {
      const section = journeyRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      setJourneyStep(Math.min(4, Math.floor(progress * 5)))
    }
    updateJourney()
    window.addEventListener('scroll', updateJourney, { passive: true })
    window.addEventListener('resize', updateJourney)
    return () => {
      window.removeEventListener('scroll', updateJourney)
      window.removeEventListener('resize', updateJourney)
    }
  }, [])
  const c = copy[lang]

  return <main className={styles.page}>
    <CorporateHeader lang={lang} active="sustainability" onLangChange={setLang} />

    <section className={styles.hero}>
      <Image src="/assets/carbon-futuristic-hero.webp" alt="" fill priority sizes="100vw" />
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <p className={styles.kicker}>{c.heroKicker}</p>
        <h1>{c.heroTitle}</h1>
        <div className={styles.heroBottom}>
          <p>{c.heroText}</p>
          <a href="#commitment">{c.heroCta}<span>↓</span></a>
        </div>
        <ul>{c.heroTags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </section>

    <section className={styles.intro} id="commitment">
      <div className={styles.introLead}>
        <p className={styles.kicker}>{c.introKicker}</p>
        <h2>{c.introTitle}</h2>
        <p>{c.introText}</p>
      </div>
      <div className={styles.commitGrid}>
        {c.commitments.map(([title, text], index) => <article key={title}>
          <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p>
        </article>)}
      </div>
    </section>

    <section className={styles.position}>
      <header><p className={styles.kicker}>{c.positionKicker}</p><h2>{c.positionTitle}</h2></header>
      <div className={styles.platformGrid}>
        {c.platforms.map(([no, title, text], index) => <article key={title} className={index === 2 ? styles.highlightPlatform : ''}>
          <span>{no}</span><strong>{title}</strong><p>{text}</p>
        </article>)}
      </div>
    </section>

    <section className={styles.material}>
      <div className={styles.materialHead}>
        <p className={styles.kicker}>{c.systemKicker}</p>
        <h2>{c.systemTitle}</h2>
      </div>
      <div className={styles.journeyStage} ref={journeyRef}>
        <div className={styles.journeySticky}>
          <Image src="/assets/sustainability/recovered-carbon-fiber-b.png" alt="Recovered carbon fiber weave" fill sizes="100vw" />
          <div className={styles.journeyShade} />
          <div className={styles.journeyInterface}>
            <div className={styles.journeyCounter}>
              <span>{c.journeyProgress}</span>
              <strong>0{journeyStep + 1}</strong>
              <i>05</i>
            </div>
            <div className={styles.journeyCopy} aria-live="polite">
              {c.journey.map(([title, text], index) => <article key={title} className={index === journeyStep ? styles.activeJourney : ''} aria-hidden={index !== journeyStep}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>)}
            </div>
            <div className={styles.journeyRail} aria-hidden="true">
              <span style={{ height: `${((journeyStep + 1) / 5) * 100}%` }} />
              {c.journey.map(([,], index) => <i key={index} className={index <= journeyStep ? styles.passedJourney : ''} />)}
            </div>
          </div>
          <div className={styles.journeyTone} style={{ opacity: journeyStep / 4 }} />
          <a className={styles.journeySource} href="https://www.mdpi.com/2313-4321/7/2/22" target="_blank" rel="noreferrer">Grebeneva et al 2022 · CC BY 4 0</a>
        </div>
      </div>
      <p className={styles.detailLabel}>{c.engineeringDetail}</p>
      <div className={styles.steps}>
        {c.steps.map(([no, title, text]) => <article key={no}>
          <span>{no}</span><div><h3>{title}</h3><p>{text}</p></div>
        </article>)}
      </div>
    </section>

    <section className={styles.lca}>
      <div className={styles.lcaVisual}>
        <video autoPlay muted loop playsInline preload="metadata" poster="/assets/sustainability/precision-manufacturing-poster.jpg"><source src="/assets/sustainability/precision-manufacturing.mp4" type="video/mp4" /></video>
        <div className={styles.lcaRing}><b>LCA</b><span>Measure → Compare → Improve</span></div>
      </div>
      <div className={styles.lcaCopy}>
        <p className={styles.kicker}>{c.lcaKicker}</p>
        <h2>{c.lcaTitle}</h2>
        <p>{c.lcaText}</p>
        <ol>{c.lcaStages.map((stage, index) => <li key={stage}><span>0{index + 1}</span>{stage}</li>)}</ol>
        <strong>{c.lcaNote}</strong>
      </div>
    </section>

    <section className={styles.sdg}>
      <header>
        <div><p className={styles.kicker}>{c.sdgKicker}</p><h2>{c.sdgTitle}</h2></div>
        <p>{c.sdgText}</p>
      </header>
      <div className={styles.goalGrid}>
        {c.goals.map(([no, title, text]) => <a key={no} href={`https://sdgs.un.org/goals/goal${Number(no)}`} target="_blank" rel="noreferrer">
          <span>{no}</span><h3>{title}</h3><p>{text}</p><i>↗</i>
        </a>)}
      </div>
      <div className={styles.allGoals} aria-label="The 17 Sustainable Development Goals">
        {Array.from({ length: 17 }, (_, i) => <span key={i} className={[9, 12, 13, 17].includes(i + 1) ? styles.activeGoal : ''}>{String(i + 1).padStart(2, '0')}</span>)}
      </div>
      <p className={styles.disclaimer}>{c.sdgDisclaimer}</p>
    </section>

    <section className={styles.why}>
      <Image src="/assets/sustainability/robotic-validation-poster.jpg" alt="" fill sizes="100vw" />
      <div className={styles.whyShade} />
      <div className={styles.whyCopy}>
        <p className={styles.kicker}>{c.whyKicker}</p><h2>{c.whyTitle}</h2><p>{c.whyText}</p><span>{c.penguin}</span>
      </div>
      <div className={styles.principles}>{c.principles.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</div>
    </section>

    <section className={styles.closing}>
      <p className={styles.kicker}>{c.closingKicker}</p><h2>{c.closingTitle}</h2>
      <div><p>{c.closingText}</p><Link href="/iletisim">{c.closingCta}<span>↗</span></Link></div>
    </section>

    <PublicFooter lang={lang} />
  </main>
}
