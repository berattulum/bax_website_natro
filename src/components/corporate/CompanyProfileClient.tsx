'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ManagedLocale } from '@/components/ManagedSections'
import { CorporateHeader, type CorporateLang } from './CorporateHeader'

export function CompanyProfileClient({ locales }: { locales: Record<CorporateLang, ManagedLocale> }) {
  const [lang, setLang] = useState<CorporateLang>('tr')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  function changeLanguage(next: CorporateLang) {
    setLang(next)
    localStorage.setItem('bax-language', next)
    document.documentElement.lang = next
  }

  const locale = locales[lang]
  const d = locale.dictionary
  const process = locale.ui.process.steps
  const text = lang === 'tr' ? {
    heroLabel: 'BAX // ŞİRKET PROFİLİ',
    heroTitle: <>Kompozitin geleceğini<br />mühendislikle şekillendiriyoruz.</>,
    heroText: 'Tasarımdan doğrulamaya, proses geliştirmeden seri üretime uzanan uçtan uca kabiliyet.',
    founded: 'İstanbul’da kuruldu',
    identity: 'İLERİ KOMPOZİT MÜHENDİSLİĞİ',
    journey: '2018’DEN GÜNÜMÜZE',
    stages: [['2018', 'Kuruluş'], ['Gelişim', 'Tasarım ve analiz kabiliyeti'], ['Endüstriyelleşme', 'Proses ve üretim altyapısı'], ['Bugün', 'Uçtan uca kompozit çözümleri']],
    model: 'NASIL ÇALIŞIYORUZ?',
    modelTitle: <>Fikirden güvenilir<br />üretime.</>,
    transparency: 'KURUMSAL ŞEFFAFLIK',
    closing: <>Doğrulanabilir bilgiler.<br />Açık iletişim.</>,
    records: 'Kurumsal bilgileri inceleyin',
    legal: 'KVKK ve yasal belgeler',
  } : {
    heroLabel: 'BAX // COMPANY PROFILE',
    heroTitle: <>Engineering the future<br />of composites.</>,
    heroText: 'End-to-end capability from design and validation to process development and serial production.',
    founded: 'Founded in Istanbul',
    identity: 'ADVANCED COMPOSITE ENGINEERING',
    journey: 'FROM 2018 TO TODAY',
    stages: [['2018', 'Foundation'], ['Development', 'Design and analysis capability'], ['Industrialization', 'Process and production infrastructure'], ['Today', 'End-to-end composite solutions']],
    model: 'HOW WE WORK',
    modelTitle: <>From concept to reliable<br />production.</>,
    transparency: 'CORPORATE TRANSPARENCY',
    closing: <>Verifiable information.<br />Clear communication.</>,
    records: 'View corporate information',
    legal: 'Privacy and legal documents',
  }

  return (
    <main className="profile-page">
      <CorporateHeader lang={lang} onLanguageChange={changeLanguage} active="profile" />
      <section className="profile-hero">
        <Image src="/assets/carbon-futuristic-hero.webp" alt="" fill priority sizes="100vw" />
        <div className="profile-hero-shade" />
        <div className="profile-hero-content"><span>{text.heroLabel}</span><h1>{text.heroTitle}</h1><p>{text.heroText}</p></div>
        <aside className="profile-hero-identity"><span>{text.identity}</span><p>{d.aboutDescription}</p></aside>
      </section>
      <section className="profile-intro">
        <div className="profile-intro-index"><span>2018</span><small>{text.founded}</small></div>
        <div className="profile-intro-copy"><span className="profile-kicker">{text.identity}</span><h2>{d.aboutTitle?.replace(/<br\s*\/?>/gi, ' ')}</h2><p>{d.aboutGoal}</p></div>
      </section>
      <section className="profile-timeline" aria-labelledby="profile-timeline-title"><div className="profile-timeline-heading"><span className="profile-kicker">{text.journey}</span><h2 id="profile-timeline-title">{lang === 'tr' ? 'Sürekli gelişen mühendislik kabiliyeti.' : 'Engineering capability in continuous development.'}</h2></div><ol>{text.stages.map(([period, label], index) => <li key={period}><span className="profile-timeline-index">{String(index + 1).padStart(2, '0')}</span><strong>{period}</strong><p>{label}</p></li>)}</ol></section>
      <section className="profile-method">
        <div className="profile-method-heading"><span className="profile-kicker">{text.model}</span><h2>{text.modelTitle}</h2></div>
        <ol>{process.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
      </section>
      <section className="profile-closing"><div><span className="profile-kicker">{text.transparency}</span><h2>{text.closing}</h2></div><Link href="/kurumsal-bilgiler">{text.records}<span aria-hidden="true">↗</span></Link></section>
      <footer className="profile-footer"><span>© 2026 BaX Composites Inc.</span><Link href="/kvkk">{text.legal}</Link><Link href="/#home">baxcomposites.com</Link></footer>
    </main>
  )
}
