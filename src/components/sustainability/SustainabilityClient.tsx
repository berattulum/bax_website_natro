'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cloneElement, isValidElement, useEffect, useState, type ReactElement, type ReactNode } from 'react'
import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import styles from './SustainabilityClient.module.css'

function removePeriods<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/\./g, '') as T
  if (Array.isArray(value)) return value.map(removePeriods) as T
  if (isValidElement(value)) {
    const element = value as ReactElement<{ children?: ReactNode }>
    return cloneElement(element, undefined, removePeriods(element.props.children)) as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, removePeriods(entry)])) as T
  }
  return value
}

const copy = {
  en: {
    heroKicker: 'SUSTAINABILITY BY ENGINEERING',
    heroTitle: <>Keep performance.<br /><em>Keep value in motion.</em></>,
    heroText: 'We use engineering decisions, process knowledge and lifecycle thinking to make composite performance more resource-conscious.',
    heroCta: 'Our approach',
    nav: ['Approach', 'Impact', 'Circularity', 'Evidence'],
    approachKicker: 'OUR APPROACH',
    approachTitle: 'Lifecycle thinking, not quick fixes',
    approachLead: 'Sustainability begins before a part reaches production. It starts with how material is selected, how a process is designed, how long a product performs and what can happen after its first use.',
    approachText: 'At BaX Composites, we focus on the decisions we can influence directly. We build environmental reasoning alongside mechanical performance, production stability and safety — and we prefer evidence to broad claims.',
    principles: [
      ['01', 'Measure first', 'Define boundaries and compare alternatives on a consistent basis.'],
      ['02', 'Use with intent', 'Reduce avoidable scrap and keep valuable material productive for longer.'],
      ['03', 'Design the next life', 'Consider recovery, reuse and renewed applications from the first decision.'],
      ['04', 'Protect performance', 'Advance circularity without separating it from quality and safety.'],
    ],
    focusKicker: 'THREE FOCUS AREAS',
    focusTitle: 'A practical sustainability programme',
    focusText: 'Our work is organised around the value composites can enable, the footprint of our own processes and the next productive life of material.',
    focus: [
      ['01', 'Enabling products', 'Lightweight, durable composite structures can support longer service life and more efficient systems.'],
      ['02', 'Operational footprint', 'Process energy, material yield, scrap and repeatability are addressed as manufacturing variables.'],
      ['03', 'Circular materials', 'We develop routes for recovered carbon fiber through treatment, design and verified production.'],
    ],
    enableKicker: 'WHAT COMPOSITES ENABLE',
    enableTitle: 'Performance that can reduce demand elsewhere',
    enableText: 'The most meaningful impact of a composite is often created during the life of the system it becomes part of. Lightweight structures can reduce moving mass, durable parts can extend service intervals and corrosion resistance can reduce maintenance.',
    enableNote: 'The benefit depends on the application. It should be evaluated across the full system and lifecycle, not assumed from material choice alone.',
    operationsKicker: 'OUR OPERATIONS',
    operationsTitle: 'Improve the processes we know best',
    operationsText: 'We connect sustainability work to specific engineering platforms instead of treating it as a separate layer.',
    platforms: [
      ['RTM', 'Controlled resin flow, repeatable closed-mould production and improved material yield through process design.'],
      ['TP', 'Thermoplastic routes with potential for reshaping, joining, repair and material recovery.'],
      ['RCF', 'Engineering development for treatment, design and manufacturing with recycled carbon fiber.'],
      ['LCA', 'A measurement framework for material, process energy, scrap and end-of-life scenarios.'],
    ],
    circularKicker: 'CIRCULARITY IN PRACTICE',
    circularTitle: 'Build the next material life in the right order',
    circularText: 'Circularity is not a single recycling claim. It is a sequence of traceable material decisions that must still lead to a stable, useful and verifiable product.',
    journey: [
      ['Material value', 'Understand the original material and performance before deciding where it can remain productive.'],
      ['Recovery', 'Select suitable material streams and establish traceable, controlled boundaries.'],
      ['Fiber treatment', 'Develop surface, dispersion and interface behaviour for manufacturing compatibility.'],
      ['Product design', 'Design geometry, load paths and architecture around recovered-material capability.'],
      ['Industrialization', 'Translate the material route into repeatable processing, quality control and a verified CFRP product.'],
    ],
    evidenceKicker: 'LIFE CYCLE EVIDENCE',
    evidenceTitle: 'A claim is only as strong as its boundary',
    evidenceText: 'Our LCA approach is being structured to convert process knowledge into comparable evidence. The first priority is a transparent cradle-to-gate view that can grow as reliable data becomes available.',
    evidenceStages: ['Raw material', 'Inbound transport', 'Process energy', 'Manufacturing scrap', 'Use assumptions', 'End of life'],
    evidenceNote: 'No decorative numbers. No selective boundaries. No result before the data.',
    goalsKicker: 'COLLABORATION AND SHARED GOALS',
    goalsTitle: 'Progress requires a wider value chain',
    goalsText: 'Material suppliers, research networks, customers and manufacturing partners all influence what can be measured, recovered and scaled. Our work connects most directly with four UN Sustainable Development Goals.',
    goals: [
      ['09', 'Industry, innovation and infrastructure'],
      ['12', 'Responsible consumption and production'],
      ['13', 'Climate action'],
      ['17', 'Partnerships for the goals'],
    ],
    disclaimer: 'Alignment framework only; this is not a statement of United Nations endorsement.',
    closingKicker: 'OUR COMMITMENT',
    closingTitle: <>Less assumption.<br /><em>More evidence.</em></>,
    closingText: 'We commit to learning, measuring and improving with every programme while keeping engineering performance at the centre.',
    closingCta: 'Start a responsible programme',
  },
  tr: {
    heroKicker: 'MÜHENDİSLİKLE SÜRDÜRÜLEBİLİRLİK',
    heroTitle: <>Performansı koru.<br /><em>Değeri döngüde tut.</em></>,
    heroText: 'Kompozit performansını daha bilinçli kaynak kullanımıyla buluşturmak için mühendislik kararlarından, proses bilgisinden ve yaşam döngüsü yaklaşımından yararlanıyoruz.',
    heroCta: 'Yaklaşımımız',
    nav: ['Yaklaşım', 'Etki', 'Döngüsellik', 'Kanıt'],
    approachKicker: 'YAKLAŞIMIMIZ',
    approachTitle: 'Hızlı çözümler değil, yaşam döngüsü yaklaşımı',
    approachLead: 'Sürdürülebilirlik bir parça üretime ulaşmadan önce başlar. Malzemenin nasıl seçildiği, prosesin nasıl tasarlandığı, ürünün ne kadar süre performans gösterdiği ve ilk kullanımından sonra ne olabileceğiyle şekillenir.',
    approachText: 'BaX Kompozit olarak doğrudan etkileyebildiğimiz kararlara odaklanıyoruz. Çevresel yaklaşımı mekanik performans, üretim kararlılığı ve güvenlikle birlikte kuruyor; geniş iddialar yerine kanıtı tercih ediyoruz.',
    principles: [
      ['01', 'Önce ölç', 'Sınırları tanımla ve alternatifleri tutarlı bir temelde karşılaştır.'],
      ['02', 'Bilinçli kullan', 'Önlenebilir fireyi azalt ve değerli malzemeyi daha uzun süre üretken tut.'],
      ['03', 'Sonraki yaşamı tasarla', 'Geri kazanım ve yeniden kullanımı ilk karardan itibaren değerlendir.'],
      ['04', 'Performansı koru', 'Döngüselliği kalite ve güvenlikten ayırmadan geliştir.'],
    ],
    focusKicker: 'ÜÇ ODAK ALANI',
    focusTitle: 'Uygulanabilir bir sürdürülebilirlik programı',
    focusText: 'Çalışmalarımızı kompozitlerin sağlayabileceği değer, kendi proseslerimizin ayak izi ve malzemenin bir sonraki üretken yaşamı etrafında düzenliyoruz.',
    focus: [
      ['01', 'Değer sağlayan ürünler', 'Hafif ve dayanıklı kompozit yapılar daha uzun kullanım ömrünü ve daha verimli sistemleri destekleyebilir.'],
      ['02', 'Operasyonel ayak izi', 'Proses enerjisini, malzeme verimini, fireyi ve tekrarlanabilirliği üretim değişkenleri olarak ele alıyoruz.'],
      ['03', 'Döngüsel malzemeler', 'Geri kazanılmış karbon fiber için iyileştirme, tasarım ve doğrulanmış üretim rotaları geliştiriyoruz.'],
    ],
    enableKicker: 'KOMPOZİTLERİN SAĞLADIĞI DEĞER',
    enableTitle: 'Başka noktalardaki kaynak ihtiyacını azaltabilen performans',
    enableText: 'Bir kompozitin en anlamlı etkisi çoğu zaman parçası olduğu sistemin kullanım ömründe ortaya çıkar. Hafif yapılar hareketli kütleyi azaltabilir, dayanıklı parçalar servis aralıklarını uzatabilir ve korozyon direnci bakım ihtiyacını düşürebilir.',
    enableNote: 'Fayda uygulamaya bağlıdır. Yalnızca malzeme seçiminden varsayılmamalı; bütün sistem ve yaşam döngüsü boyunca değerlendirilmelidir.',
    operationsKicker: 'OPERASYONLARIMIZ',
    operationsTitle: 'En iyi bildiğimiz prosesleri iyileştirmek',
    operationsText: 'Sürdürülebilirlik çalışmalarını ayrı bir katman olarak değil, belirli mühendislik platformlarıyla ilişkilendiriyoruz.',
    platforms: [
      ['RTM', 'Kontrollü reçine akışı, tekrarlanabilir kapalı kalıp üretimi ve proses tasarımıyla daha iyi malzeme verimi.'],
      ['TP', 'Yeniden şekillendirme, birleştirme, onarım ve malzeme geri kazanımı potansiyeli taşıyan termoplastik rotalar.'],
      ['RCF', 'Geri dönüştürülmüş karbon fiberle iyileştirme, tasarım ve üretim için mühendislik geliştirmesi.'],
      ['LCA', 'Malzeme, proses enerjisi, fire ve yaşam sonu senaryoları için ölçüm çerçevesi.'],
    ],
    circularKicker: 'UYGULAMADA DÖNGÜSELLİK',
    circularTitle: 'Bir sonraki malzeme yaşamını doğru sırayla kurmak',
    circularText: 'Döngüsellik tek bir geri dönüşüm iddiası değildir. Hâlâ kararlı, faydalı ve doğrulanabilir bir ürüne ulaşması gereken izlenebilir malzeme kararları dizisidir.',
    journey: [
      ['Malzeme değeri', 'Nerede üretken kalabileceğine karar vermeden önce ilk malzemeyi ve performansı anla.'],
      ['Geri kazanım', 'Uygun malzeme akışlarını seç ve izlenebilir, kontrollü sınırlar oluştur.'],
      ['Fiber iyileştirme', 'Üretim uyumluluğu için yüzey, dağılım ve ara yüz davranışını geliştir.'],
      ['Ürün tasarımı', 'Geometriyi, yük yollarını ve ürün mimarisini geri kazanılmış malzeme yeteneğine göre tasarla.'],
      ['Endüstriyelleştirme', 'Malzeme rotasını tekrarlanabilir proses, kalite kontrolü ve doğrulanmış bir CFRP ürününe dönüştür.'],
    ],
    evidenceKicker: 'YAŞAM DÖNGÜSÜ KANITI',
    evidenceTitle: 'Bir iddia ancak sınırları kadar güçlüdür',
    evidenceText: 'LCA yaklaşımımız proses bilgisini karşılaştırılabilir kanıta dönüştürmek üzere yapılandırılıyor. İlk öncelik, güvenilir veri arttıkça gelişebilecek şeffaf bir beşikten kapıya görünüm oluşturmak.',
    evidenceStages: ['Hammadde', 'Gelen lojistik', 'Proses enerjisi', 'Üretim firesi', 'Kullanım varsayımları', 'Yaşam sonu'],
    evidenceNote: 'Dekoratif sayı yok. Seçici sınır yok. Veriden önce sonuç yok.',
    goalsKicker: 'İŞ BİRLİĞİ VE ORTAK HEDEFLER',
    goalsTitle: 'İlerleme daha geniş bir değer zinciri gerektirir',
    goalsText: 'Malzeme tedarikçileri, araştırma ağları, müşteriler ve üretim ortakları neyin ölçülebileceğini, geri kazanılabileceğini ve ölçeklenebileceğini birlikte belirler. Çalışmalarımız dört BM Sürdürülebilir Kalkınma Amacıyla doğrudan ilişkilidir.',
    goals: [
      ['09', 'Sanayi, yenilikçilik ve altyapı'],
      ['12', 'Sorumlu üretim ve tüketim'],
      ['13', 'İklim eylemi'],
      ['17', 'Amaçlar için ortaklıklar'],
    ],
    disclaimer: 'Yalnızca uyum çerçevesidir; Birleşmiş Milletler onayı anlamına gelmez.',
    closingKicker: 'TAAHHÜDÜMÜZ',
    closingTitle: <>Daha az varsayım.<br /><em>Daha çok kanıt.</em></>,
    closingText: 'Mühendislik performansını merkezde tutarken her programda öğrenmeyi, ölçmeyi ve gelişmeyi taahhüt ediyoruz.',
    closingCta: 'Sorumlu bir program başlat',
  },
} as const

export function SustainabilityClient() {
  const [lang, setLang] = useState<CorporateLang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const c = removePeriods(copy[lang])

  return <main className={styles.page}>
    <CorporateHeader lang={lang} active="sustainability" onLangChange={setLang} />

    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        <Image src="/assets/sustainability/wind-power-landscape-zac-wolff.jpg" alt={lang === 'tr' ? 'Yeşil arazi üzerinde çalışan rüzgâr türbinleri' : 'Operating wind turbines across a green landscape'} fill priority sizes="100vw" />
      </div>
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <p className={styles.kicker}>{c.heroKicker}</p>
        <h1>{c.heroTitle}</h1>
        <div className={styles.heroFoot}><p>{c.heroText}</p><a href="#approach">{c.heroCta}<span>↓</span></a></div>
      </div>
    </section>

    <nav className={styles.sectionNav} aria-label={lang === 'tr' ? 'Sayfa bölümleri' : 'Page sections'}>
      {c.nav.map((item, index) => <a key={item} href={['#approach', '#impact', '#circularity', '#evidence'][index]}>{item}</a>)}
    </nav>

    <section className={styles.approach} id="approach">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>{c.approachKicker}</p>
        <h2>{c.approachTitle}</h2>
        <div><strong>{c.approachLead}</strong><p>{c.approachText}</p></div>
      </div>
      <div className={styles.principleList}>{c.principles.map(([key, title, text]) => <article key={key}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className={styles.focus} id="impact">
      <header><p className={styles.kicker}>{c.focusKicker}</p><h2>{c.focusTitle}</h2><p>{c.focusText}</p></header>
      <div className={styles.focusList}>{c.focus.map(([key, title, text]) => <article key={key}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className={styles.enable}>
      <div className={styles.enableImage}>
        <Image src="/assets/sustainability/cfrp-workshop-hero-v3.png" alt={lang === 'tr' ? 'Kompozit üretim atölyesinde CFRP kalıbı ve karbon fiber parça' : 'CFRP mold and carbon-fiber component in a composites workshop'} fill sizes="(max-width: 900px) 100vw, 55vw" />
      </div>
      <div className={styles.enableCopy}><p className={styles.kicker}>{c.enableKicker}</p><h2>{c.enableTitle}</h2><p>{c.enableText}</p><strong>{c.enableNote}</strong></div>
    </section>

    <section className={styles.circular} id="circularity">
      <div className={styles.circularHead}><p className={styles.kicker}>{c.circularKicker}</p><h2>{c.circularTitle}</h2><p>{c.circularText}</p></div>
      <div className={styles.circularVisual}><Image src="/assets/sustainability/reclaimed-carbon-material-stages-v3.png" alt={lang === 'tr' ? 'Karbon fiber fire, kırpıntı ve geri kazanılmış elyaf aşamaları' : 'Carbon-fiber offcuts, shredded material and reclaimed fiber stages'} fill sizes="100vw" /></div>
      <div className={styles.journeyList}>{c.journey.map(([title, text], index) => <article key={title} className={index === 4 ? styles.industrialization : ''}>
        <div><h3>{title}</h3><p>{text}</p></div>
        {index === 4 && <div className={styles.journeyProduct}><Image src="/assets/sustainability/cfrp-structural-panel-v3.png" alt={lang === 'tr' ? 'Endüstriyelleştirme aşamasında üretilmiş CFRP yapısal parça' : 'CFRP structural component produced at the industrialization stage'} fill sizes="(max-width: 900px) 100vw, 40vw" /></div>}
      </article>)}</div>
    </section>

    <section className={styles.evidence} id="evidence">
      <div className={styles.evidenceVisual}><video autoPlay muted loop playsInline preload="metadata" poster="/assets/sustainability/precision-manufacturing-poster.jpg"><source src="/assets/sustainability/precision-manufacturing.mp4" type="video/mp4" /></video><span>LCA</span></div>
      <div className={styles.evidenceCopy}><p className={styles.kicker}>{c.evidenceKicker}</p><h2>{c.evidenceTitle}</h2><p>{c.evidenceText}</p><ol>{c.evidenceStages.map((stage) => <li key={stage}>{stage}</li>)}</ol><strong>{c.evidenceNote}</strong></div>
    </section>

    <section className={styles.goals}>
      <div className={styles.goalsIntro}><p className={styles.kicker}>{c.goalsKicker}</p><h2>{c.goalsTitle}</h2><p>{c.goalsText}</p></div>
      <div className={styles.goalList}>{c.goals.map(([no, title]) => <a key={no} href={`https://sdgs.un.org/goals/goal${Number(no)}`} target="_blank" rel="noreferrer"><span>{no}</span><strong>{title}</strong><i>↗</i></a>)}</div>
      <p className={styles.disclaimer}>{c.disclaimer}</p>
    </section>

    <section className={styles.closing}>
      <p className={styles.kicker}>{c.closingKicker}</p><h2>{c.closingTitle}</h2>
      <div><p>{c.closingText}</p><Link href="/iletisim">{c.closingCta}<span>↗</span></Link></div>
    </section>

    <PublicFooter lang={lang} />
  </main>
}
