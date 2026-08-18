'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ManagedLocale } from '@/components/ManagedSections'
import { PublicFooter } from '@/components/PublicFooter'
import { CorporateHeader, type CorporateLang } from './CorporateHeader'

export function CompanyProfileClient({ locales }: { locales: Record<CorporateLang, ManagedLocale> }) {
  const [lang, setLang] = useState<CorporateLang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const connectedStages = lang === 'tr' ? [
    ['01', 'GERİ KAZAN', 'Döngüsel karbon elyaf ve üretim atıkları sisteme girer'],
    ['02', 'KARAKTERİZE ET', 'Malzeme verisi yapı ve davranışı ölçülebilir hale getirir'],
    ['03', 'MÜHENDİSLİĞİNİ YAP', 'Yapılar performans hedeflerine göre tasarlanır ve optimize edilir'],
    ['04', 'PROSESİ GELİŞTİR', 'Prosesler tekrarlanabilirlik ve kalite için geliştirilir'],
    ['05', 'DOĞRULA', 'Performans izlenebilir mühendislik kanıtlarıyla doğrulanır'],
    ['06', 'LCA', 'Yaşam döngüsü kanıtları daha doğru teknik kararlara yön verir'],
    ['07', 'SANAYİLEŞTİR', 'Kontrollü ölçekleme tutarlı ve üretime hazır sonuçlar sağlar'],
  ] : [
    ['01', 'RECOVER', 'Circular carbon fibre and production waste enter the system'],
    ['02', 'CHARACTERIZE', 'Material intelligence quantifies structure and behaviour'],
    ['03', 'ENGINEER', 'Structures are designed and optimized for performance'],
    ['04', 'DEVELOP PROCESS', 'Processes are engineered for repeatability and quality'],
    ['05', 'VERIFY', 'Performance is proven with traceable engineering evidence'],
    ['06', 'LCA', 'Lifecycle evidence informs better technical decisions'],
    ['07', 'INDUSTRIALIZE', 'Controlled scale-up delivers consistent production-ready outcomes'],
  ]

  /*
  const delivery = lang === 'tr' ? [
    { index: '01', title: 'Tanımla', text: 'Uygulama gereksinimleri, yük durumları, malzeme hedefleri ve üretim sınırları', output: 'Tasarım temeli' },
    { index: '02', title: 'Mühendisliğini yap', text: 'Malzeme, yapı, takım ve proses kararlarının birlikte geliştirilmesi', output: 'Doğrulanmış proses penceresi' },
    { index: '03', title: 'Doğrula', text: 'Analiz, test, ölçüm ve kalifikasyon sonuçlarının izlenebilir hale getirilmesi', output: 'Test kanıtı' },
    { index: '04', title: 'Sanayileştir', text: 'Otomasyon, proses kontrolü ve kalite gereksinimlerinin üretime aktarılması', output: 'Üretim onayı' },
  ] : [
    { index: '01', title: 'Define', text: 'Application requirements, load cases, material targets and manufacturing constraints', output: 'Design basis' },
    { index: '02', title: 'Engineer', text: 'Material, structure, tooling and process decisions developed as one system', output: 'Verified process window' },
    { index: '03', title: 'Verify', text: 'Analysis, testing, measurement and qualification made traceable', output: 'Test evidence' },
    { index: '04', title: 'Industrialize', text: 'Automation, process control and quality requirements transferred into production', output: 'Production release' },
  ]
  const lifecycle = lang === 'tr' ? [
    ['01', 'GERİ KAZAN', 'Üretim atığını yüksek değerli bir malzeme girdisi olarak tanımla'],
    ['02', 'YENİDEN İŞLE', 'Lif değerini koruyan kontrollü proses rotası geliştir'],
    ['03', 'DOĞRULA', 'Malzeme ve bileşen performansını ölçülebilir kanıtlarla doğrula'],
    ['04', 'YAŞAM DÖNGÜSÜNÜ ÖLÇ', 'Enerji, kaynak kullanımı ve kullanım sonu senaryolarını karşılaştır'],
    ['05', 'SANAYİLEŞTİR', 'Sonuçları tekrarlanabilir ve ölçeklenebilir üretime aktar'],
  ] : [
    ['01', 'RECOVER', 'Recognize production waste as a high-value material input'],
    ['02', 'REPROCESS', 'Develop a controlled route that preserves fibre value'],
    ['03', 'VERIFY', 'Validate material and component performance with measurable evidence'],
    ['04', 'MEASURE LIFECYCLE IMPACT', 'Compare energy, resource use and end-of-life scenarios'],
    ['05', 'INDUSTRIALIZE', 'Transfer the evidence into repeatable and scalable production'],
  ]
  */
  return <main className="profile-page cp-page cp-page-v2">
    <CorporateHeader lang={lang} active="profile" onLangChange={setLang} />

    <section className="cpv2-hero" aria-labelledby="cpv2-title">
      <div className="cpv2-hero-copy">
        <p>{lang === 'tr' ? 'BAX COMPOSITES / İSTANBUL' : 'BAX COMPOSITES / ISTANBUL'}</p>
        <h1 id="cpv2-title">{lang === 'tr' ? 'Şirket profili' : 'Company profile'}</h1>
        <span>{lang === 'tr' ? 'İleri ve geri dönüştürülmüş kompozit mühendisliği' : 'Advanced and recycled composite engineering'}</span>
      </div>
    </section>

    <section className="cpv2-aerospace" aria-labelledby="cp-aerospace-title">
      <figure>
        <Image src="/assets/bax-facility-front-elevation-v3.png" alt={lang === 'tr' ? 'BaX Composites İstanbul üretim tesisi' : 'BaX Composites production facility in Istanbul'} fill sizes="(max-width: 900px) 100vw, 42vw" />
        <figcaption>BaX Composites / Istanbul</figcaption>
      </figure>
      <div className="cpv2-aerospace-copy">
        <header>
          <p className="cp-airbus-type">{lang === 'tr' ? 'HAVACILIK KÖKENLİ MÜHENDİSLİK' : 'AEROSPACE ENGINEERING HERITAGE'}</p>
          <h2 className="cp-airbus-type" id="cp-aerospace-title">{lang === 'tr' ? 'Havacılık disiplini endüstriyel ölçekte' : 'Aerospace discipline at industrial scale'}</h2>
        </header>
        <p className="cp-airbus-type">{lang === 'tr' ? 'BaX Composites, 2018 yılında İstanbul’da havacılık ve savunma kökenli mühendislik birikimi üzerine kurulmuş bir ileri kompozit mühendisliği ve üretim şirketidir  Çok disiplinli mühendislik ekibi, tasarım ve analiz kararlarını malzeme, proses, test ve sanayileştirme yetkinlikleriyle tek bir teknik sorumluluk altında birleştirir' : 'BaX Composites is an Istanbul-based advanced composites engineering and manufacturing company founded in 2018 on an aerospace and defense engineering background  Its multidisciplinary engineering team connects design and analysis decisions with material, process, testing and industrialization capabilities under one technical responsibility'}</p>
        <p className="cp-airbus-type">{lang === 'tr' ? 'Yapısal performansın analiz edildiği, üretim proseslerinin doğrulandığı ve teknik kararların izlenebilir çıktılara dönüştürüldüğü bu yaklaşımı havacılık, savunma, otomotiv ve ileri mobilite programlarına taşıyoruz  Kesintisiz mühendislik zincirimiz kavramsal tasarımdan kalifikasyon ve seri üretim sistemlerine kadar uzanır' : 'We carry this discipline—where structural performance is analyzed, manufacturing processes are verified and technical decisions become traceable outputs—into aerospace, defense, automotive and advanced mobility programmes  Our continuous engineering chain extends from conceptual design to qualification and serial production systems'}</p>
      </div>
    </section>

    <section className="cpv2-sector-panels" aria-label={lang === 'tr' ? 'BaX uygulama alanları' : 'BaX application fields'}>
      <article>
        <Image src="/assets/about-us/panel-aerospace-composites-v2.png" alt={lang === 'tr' ? 'Havacılık için karbon fiber kompozit gövde yapısı' : 'Carbon-fibre composite fuselage structure for aerospace'} fill sizes="(max-width: 760px) 100vw, 100vw" quality={95} />
        <h2>{lang === 'tr' ? 'Havacılık' : 'Aerospace'}</h2>
      </article>
      <article>
        <Image src="/assets/about-us/panel-electric-mobility-v2.png" alt={lang === 'tr' ? 'Kompozit batarya muhafazalı elektrikli araç platformu' : 'Electric vehicle platform with a composite battery enclosure'} fill sizes="(max-width: 760px) 100vw, 100vw" quality={95} />
        <h2>{lang === 'tr' ? 'Elektrikli mobilite' : 'Electric mobility'}</h2>
      </article>
      <article>
        <Image src="/assets/about-us/panel-battery-structures-v2.png" alt={lang === 'tr' ? 'Kompozit batarya kapağı ölçüm ve doğrulama işlemi' : 'Composite battery cover inspection and verification'} fill sizes="(max-width: 760px) 100vw, 100vw" quality={95} />
        <h2>{lang === 'tr' ? 'Batarya yapıları' : 'Battery structures'}</h2>
      </article>
    </section>

    <section className="cpv2-principles" aria-labelledby="cp-principles-title">
      <header>
        <p className="cp-airbus-type">{lang === 'tr' ? 'KURUMSAL YAKLAŞIM' : 'CORPORATE DIRECTION'}</p>
        <h2 className="cp-airbus-type" id="cp-principles-title">{lang === 'tr' ? 'Mühendisliğimizin temelindeki ilkeler' : 'The principles behind our engineering'}</h2>
      </header>
      <div className="cpv2-principles-copy">
        <p className="cp-airbus-type">{lang === 'tr' ? 'BaX Composites, ileri ve geri dönüştürülmüş kompozitlerde teknik kararları ölçülebilir endüstriyel değere dönüştüren güvenilir bir mühendislik ortağı olmayı amaçlar  Üretilebilir ve ölçeklenebilir çözümler geliştirmek için tasarım, analiz, malzeme ve proses geliştirme, doğrulama ve sanayileştirmeyi tek bir teknik sorumluluk altında birleştiririz  Çalışmalarımıza güven, teknik açıklık, sorumluluk, adalet ve bilgiye dayalı karar alma yön verir; bu ilkeler ortaklıklarımızda, izlenebilir program kayıtlarımızda ve kaynakları daha verimli kullanan üretim rotalarımızda karşılık bulur' : 'BaX Composites aims to be a trusted engineering partner in advanced and recycled composites, transforming technical decisions into measurable industrial value  We bring design, analysis, material and process development, verification and industrialization under one technical responsibility to deliver manufacturable and scalable solutions  Our work is guided by trust, technical clarity, responsibility, fairness and decisions grounded in knowledge—principles reflected in our partnerships, traceable programme records and more resource-efficient production routes'}</p>
      </div>
    </section>

    <section className="cpv2-capabilities" aria-labelledby="cp-capabilities-title">
      <header className="cpv2-capabilities-heading">
        <p className="cp-airbus-type">{lang === 'tr' ? 'UYGULAMADA YETKİNLİK' : 'CAPABILITIES IN PRACTICE'}</p>
        <h2 className="cp-airbus-type" id="cp-capabilities-title">{lang === 'tr' ? 'Doğrulanmış çalışmalarla ortaya konan mühendislik yetkinliği' : 'Engineering capability demonstrated through verified work'}</h2>
      </header>
      <div className="cpv2-capabilities-copy">
        <p className="cp-airbus-type">{lang === 'tr' ? 'BaX Composites, kompozit ürün geliştirmeyi birbirinden kopuk hizmetler dizisi olarak değil, tek bir mühendislik sorumluluğu olarak ele alır  Tasarım ve analiz kararları malzeme seçimi, proses geliştirme, takım tasarımı, ölçüm, test ve kalifikasyon sonuçlarıyla birlikte değerlendirilir  Her aşamada elde edilen teknik veriler bir sonraki üretim kararının temelini oluşturur; böylece geliştirilen çözüm yalnızca teorik olarak doğru değil, üretilebilir, doğrulanabilir ve program gereksinimlerine göre ölçeklenebilir hale gelir' : 'BaX Composites approaches composite product development as one engineering responsibility rather than a sequence of disconnected services  Design and analysis decisions are evaluated together with material selection, process development, tooling, measurement, testing and qualification results  Technical evidence generated at each stage informs the next production decision, enabling solutions that are not only technically sound but also manufacturable, verifiable and scalable to programme requirements'}</p>
      </div>
    </section>

    <section className="cpv2-delivery" aria-labelledby="cp-delivery-title">
      <div className="cpv2-delivery-head">
        <header className="cpv2-section-head">
          <p>{lang === 'tr' ? 'BÜTÜNLEŞİK MÜHENDİSLİK SİSTEMİ' : 'CONNECTED ENGINEERING SYSTEM'}</p>
          <h2 id="cp-delivery-title">{lang === 'tr' ? 'Malzeme potansiyelinden doğrulanmış üretime' : 'From material potential to verified production'}</h2>
        </header>
        <p className="cpv2-delivery-copy">{lang === 'tr' ? 'Tasarım, proses, doğrulama ve yaşam döngüsü kanıtları tek bir teknik sorumluluk altında ilerler' : 'Design, process, verification and lifecycle evidence advance within one technical responsibility'}</p>
      </div>
      <div className="cpv2-engineering-map">
        <div className="cpv2-engineering-map-inner">
          <ol className="cpv2-engineering-stages">{connectedStages.map(([index, title, body]) => <li key={index}><span>{index}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
          <figure className="cpv2-delivery-visual"><Image src="/assets/about-us/connected-engineering-landscape.png" alt={lang === 'tr' ? 'Geri kazanımdan sanayileştirmeye uzanan BaX bütünleşik mühendislik akışı' : 'BaX connected engineering flow from recovery to industrialization'} fill sizes="100vw" quality={95} /></figure>
          <ul className="cpv2-engineering-foundations">
            <li>{lang === 'tr' ? 'Tek teknik sorumluluk' : 'One technical responsibility'}</li>
            <li>{lang === 'tr' ? 'İzlenebilir mühendislik kanıtı' : 'Traceable engineering evidence'}</li>
            <li>{lang === 'tr' ? 'Üretilebilir ve ölçeklenebilir sonuçlar' : 'Manufacturable and scalable outcomes'}</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Previous delivery and lifecycle layouts intentionally removed: the connected visual now carries both narratives. */}
    {false && <section className="cpv2-delivery-legacy" aria-hidden="true">
      <div className="cpv2-section-head">
        <p>{lang === 'tr' ? 'PROJE TESLİMAT SİSTEMİ' : 'PROJECT DELIVERY SYSTEM'}</p>
        <h2 id="cp-delivery-title">{lang === 'tr' ? <>Gereksinimlerden<br />üretim onayına</> : <>From requirements<br />to production release</>}</h2>
        <span>{lang === 'tr' ? 'Her aşama tanımlı bir teknik karar ve incelenebilir bir çıktı üretir' : 'Every stage produces a defined technical decision and an inspectable output'}</span>
      </div>
      <figure><Image src="/assets/about-us/about-project-delivery-v2-no-people.png" alt={lang === 'tr' ? 'Tasarım, doğrulama ve üretim sistemi' : 'Design, verification and production system'} fill sizes="100vw" /></figure>
      <ol />
    </section>}

    {false && <section className="cpv2-lifecycle" aria-labelledby="cp-lifecycle-title">
      <div className="cpv2-lifecycle-copy">
        <p>{lang === 'tr' ? 'DÖNGÜSEL MÜHENDİSLİK / LCA' : 'CIRCULAR ENGINEERING / LCA'}</p>
        <h2 id="cp-lifecycle-title">{lang === 'tr' ? <>Sürdürülebilirlik<br />ölçülebilir bir<br />mühendislik kararıdır</> : <>Sustainability is<br />a measurable<br />engineering decision</>}</h2>
        <p>{lang === 'tr' ? 'BaX için sürdürülebilirlik yalnız geri dönüştürülmüş malzeme kullanmak değildir  Üretim atığının geri kazanılması, lif değerinin korunması, proses enerjisinin ve kaynak kullanımının ölçülmesi, performansın doğrulanması ve sonucun endüstriyel ölçekte tekrarlanabilmesi aynı karar zincirinin parçalarıdır' : 'For BaX, sustainability is more than using recycled material  Recovering production waste, preserving fibre value, measuring process energy and resource use, verifying performance and repeating the result at industrial scale are parts of one decision chain'}</p>
      </div>
      <figure><Image src="/assets/about-us/about-life-cycle-assessment-v2-no-people.png" alt={lang === 'tr' ? 'Kompozit malzemenin yaşam döngüsü değerlendirme sırası' : 'Composite material sequence for life cycle assessment'} fill sizes="(max-width: 900px) 100vw, 56vw" unoptimized /></figure>
      <ol />
    </section>}

    <section className="cpv2-next">
      <div><p>{lang === 'tr' ? 'KURUMSAL ŞEFFAFLIK' : 'CORPORATE TRANSPARENCY'}</p><h2>{lang === 'tr' ? <>Güvenilir mühendislik<br />açık bilgiyle başlar</> : <>Reliable engineering begins<br />with clear information</>}</h2></div>
      <nav><Link href="/kurucu">{lang === 'tr' ? 'Kurucuyu tanıyın' : 'Meet the founder'}<span>↗</span></Link><Link href="/kurumsal-bilgiler">{lang === 'tr' ? 'Kurumsal bilgileri inceleyin' : 'View corporate information'}<span>↗</span></Link></nav>
    </section>

    <PublicFooter lang={lang} />
  </main>
}
