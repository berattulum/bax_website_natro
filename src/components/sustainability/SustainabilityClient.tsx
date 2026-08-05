'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import styles from './SustainabilityClient.module.css'

const content = {
  tr: {
    eyebrow: 'SORUMLU İLERİ KOMPOZİT MÜHENDİSLİĞİ',
    title: <>Performansı geliştirirken<br /><em>kaynakları gözetiyoruz.</em></>,
    intro: 'Sürdürülebilirliği tek bir malzeme seçimi olarak değil; tasarım kararından üretim planına, kullanım ömründen sonraki adıma kadar uzanan bir mühendislik disiplini olarak ele alıyoruz.',
    principlesLabel: 'YAKLAŞIMIMIZ', principlesTitle: 'Daha az kaynakla daha yüksek mühendislik değeri',
    principles: [
      ['01', 'Malzeme verimliliği', 'Doğru malzemeyi doğru bölgede kullanarak gereksiz kütleyi, fireyi ve proses yükünü azaltmayı hedefliyoruz.'],
      ['02', 'Üretilebilir tasarım', 'Tasarım ve proses kararlarını birlikte ele alarak tekrarlanabilir, ölçülebilir ve verimli üretim akışları geliştiriyoruz.'],
      ['03', 'Yaşam döngüsü bakışı', 'Performans, dayanım, bakım ve kullanım ömrü sonrası seçenekleri ürün geliştirme sürecinin başından itibaren değerlendiriyoruz.'],
    ],
    lifecycleLabel: 'YAŞAM DÖNGÜSÜ', lifecycleTitle: 'Her kararın sonraki aşamaya etkisini düşünüyoruz.',
    lifecycle: ['Gereksinim', 'Malzeme ve tasarım', 'Proses geliştirme', 'Üretim ve kalite', 'Kullanım ömrü', 'Geri kazanım seçenekleri'],
    commitmentLabel: 'GELİŞEN YOL HARİTASI', commitmentTitle: 'Ölçülebilir ilerleme, açık sorumluluk.',
    commitmentText: 'Malzeme kullanımı, proses verimliliği ve atık azaltımı için izlenebilir veriler oluşturmayı; hedeflerimizi doğrulanabilir göstergelerle geliştirmeyi amaçlıyoruz. İddialarımızı ölçüm ve teknik kanıtla desteklemeden yayınlamıyoruz.',
    contact: 'Sürdürülebilirlik yaklaşımımızı konuşalım', back: 'Ana sayfaya dön',
  },
  en: {
    eyebrow: 'RESPONSIBLE ADVANCED COMPOSITE ENGINEERING',
    title: <>Advancing performance while<br /><em>respecting resources.</em></>,
    intro: 'We approach sustainability as an engineering discipline spanning design decisions, production planning, service life and the next use—not as a single material choice.',
    principlesLabel: 'OUR APPROACH', principlesTitle: 'Greater engineering value with fewer resources',
    principles: [
      ['01', 'Material efficiency', 'We aim to reduce unnecessary mass, scrap and process load by placing the right material exactly where it is needed.'],
      ['02', 'Design for manufacturing', 'We develop repeatable, measurable and efficient production flows by considering design and process decisions together.'],
      ['03', 'Lifecycle perspective', 'Performance, durability, maintenance and end-of-life options are considered from the beginning of product development.'],
    ],
    lifecycleLabel: 'LIFECYCLE', lifecycleTitle: 'Considering how every decision shapes the next stage.',
    lifecycle: ['Requirements', 'Material and design', 'Process development', 'Production and quality', 'Service life', 'Recovery options'],
    commitmentLabel: 'EVOLVING ROADMAP', commitmentTitle: 'Measurable progress, clear accountability.',
    commitmentText: 'We aim to establish traceable data for material use, process efficiency and waste reduction, and to develop our targets through verifiable indicators. We do not publish claims without measurement and technical evidence.',
    contact: 'Discuss our sustainability approach', back: 'Return to homepage',
  },
} as const

export function SustainabilityClient() {
  const [lang, setLang] = useState<CorporateLang>('tr')
  useEffect(() => { const saved = localStorage.getItem('bax-language'); if (saved === 'tr' || saved === 'en') setLang(saved) }, [])
  useEffect(() => { document.documentElement.lang = lang; localStorage.setItem('bax-language', lang) }, [lang])
  const copy = content[lang]

  return <main className={styles.page}>
    <CorporateHeader lang={lang} active="sustainability" onLangChange={setLang} />
    <section className={styles.hero}>
      <div className={styles.heroTexture} aria-hidden="true" /><div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroContent}><p>{copy.eyebrow}</p><h1>{copy.title}</h1><div className={styles.heroIntro}><span aria-hidden="true" /><p>{copy.intro}</p></div></div>
    </section>
    <section className={styles.principles}>
      <header><p>{copy.principlesLabel}</p><h2>{copy.principlesTitle}</h2></header>
      <div className={styles.principleGrid}>{copy.principles.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>
    <section className={styles.lifecycle}>
      <header><p>{copy.lifecycleLabel}</p><h2>{copy.lifecycleTitle}</h2></header>
      <ol>{copy.lifecycle.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></li>)}</ol>
    </section>
    <section className={styles.commitment}>
      <div><p>{copy.commitmentLabel}</p><h2>{copy.commitmentTitle}</h2></div>
      <div><p>{copy.commitmentText}</p><Link href="/iletisim">{copy.contact}<span aria-hidden="true">↗</span></Link></div>
    </section>
    <footer className={styles.footer}><span>© 2026 BaX Composites Inc.</span><Link href="/#home">{copy.back}</Link><Link href="/#home">baxcomposites.com</Link></footer>
  </main>
}
