'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ManagedLocale } from '@/components/ManagedSections'
import { CorporateHeader, type CorporateLang } from './CorporateHeader'

export function CompanyProfileClient({ locales }: { locales: Record<CorporateLang, ManagedLocale> }) {
  const [lang, setLang] = useState<CorporateLang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const locale = locales[lang]
  const d = locale.dictionary
  const process = locale.ui.process.steps
  const withoutStops = (value: string) => value.replace(/\.{1,}/g, '')
  const text = lang === 'tr' ? {
    heroTitle: 'Şirket Profili',
    heroKicker: 'İLERİ KOMPOZİT MÜHENDİSLİĞİ',
    statement: <>Malzeme potansiyelini<br /><em>üretilebilir değere</em><br />dönüştürüyoruz</>,
    founded: '2018’de İstanbul’da kuruldu',
    capability: 'Tasarımdan seri üretime',
    sectors: 'Havacılık · Savunma · Mobilite',
    flow: 'Mühendislik akışı',
    flowTitle: <>Tek ekip<br /><em>Kesintisiz süreç</em></>,
    flowIntro: 'Tasarım kararlarını üretim gerçekleriyle aynı akışta buluşturuyor, her aşamayı doğrulanabilir çıktılarla ilerletiyoruz.',
    closingKicker: 'KURUMSAL ŞEFFAFLIK',
    closing: <>Güvenilir mühendislik,<br /><em>açık bilgiyle başlar.</em></>,
    records: 'Kurumsal bilgileri inceleyin',
    legal: 'KVKK ve yasal belgeler',
    leadershipKicker: 'KURUCU / MÜHENDİSLİK LİDERLİĞİ',
    leadershipTitle: 'Teknik yön, işin merkezinde kalır.',
    leadershipBody: 'BaX Composites kurucusu Hakkı Kızılok; ileri kompozitler, RTM uygulamaları ve üretim odaklı proje geliştirme deneyimiyle şirketin mühendislik yaklaşımına liderlik eder.',
    leadershipProject: 'MachFlexComp Proje Koordinatörü',
    portraitPending: 'Portre alanı',
  } : {
    heroTitle: 'Company Profile',
    heroKicker: 'ADVANCED COMPOSITE ENGINEERING',
    statement: <>Transforming material potential<br />into <em>manufacturable value</em></>,
    founded: 'Founded in Istanbul in 2018',
    capability: 'From design to serial production',
    sectors: 'Aviation · Defense · Mobility',
    flow: 'Engineering flow',
    flowTitle: <>One team<br /><em>One continuous process</em></>,
    flowIntro: 'We bring design decisions and production realities into one workflow, advancing every stage through verifiable outputs.',
    closingKicker: 'CORPORATE TRANSPARENCY',
    closing: <>Reliable engineering begins<br /><em>with clear information.</em></>,
    records: 'View corporate information',
    legal: 'Privacy and legal documents',
    leadershipKicker: 'FOUNDER / ENGINEERING LEADERSHIP',
    leadershipTitle: 'Technical direction stays close to the work.',
    leadershipBody: 'BaX Composites founder Hakkı Kızılok leads the company’s engineering approach through experience in advanced composites, RTM applications and manufacturing-led project development.',
    leadershipProject: 'MachFlexComp Project Coordinator',
    portraitPending: 'Portrait reserved',
  }

  return (
    <main className="profile-page cp-page">
      <CorporateHeader lang={lang} active="profile" onLangChange={setLang} />

      <section className="cp-hero">
        <Image
          src="/assets/bax-facility-front-elevation-v3.png"
          alt={lang === 'tr' ? 'BaX Composites üretim tesisi' : 'BaX Composites production facility'}
          fill
          priority
          sizes="100vw"
          quality={75}
        />
        <div className="cp-hero-shade" />
        <div className="cp-hero-content">
          <span>{text.heroKicker}</span>
          <h1>{text.heroTitle}</h1>
        </div>
        <div className="cp-hero-facts" aria-label={lang === 'tr' ? 'Şirket özeti' : 'Company summary'}>
          <p>{text.capability}</p>
          <dl>
            <div><dt>2018</dt><dd>{lang === 'tr' ? 'İstanbul' : 'Istanbul'}</dd></div>
            <div><dt>03</dt><dd>{lang === 'tr' ? 'Odak sektör' : 'Focus sectors'}</dd></div>
          </dl>
        </div>
        <p className="cp-hero-caption">BaX Composites / Istanbul</p>
      </section>

      <div className="cp-story cp-story-legacy">
      <section className="cp-intro">
        <div className="cp-intro-title">
          <h2>{text.statement}</h2>
        </div>
        <div className="cp-intro-copy">
          <p className="cp-lead">{withoutStops(d.aboutDescription)}</p>
          <p>{withoutStops(d.aboutGoal)}</p>
          <dl>
            <div><dt>01</dt><dd>{text.founded}</dd></div>
            <div><dt>02</dt><dd>{text.capability}</dd></div>
            <div><dt>03</dt><dd>{text.sectors}</dd></div>
          </dl>
        </div>
      </section>

      <section className="cp-leadership" aria-labelledby="cp-leadership-title">
        <div className="cp-leadership-portrait" aria-label={text.portraitPending}>
          <span>HK</span>
          <small>{text.portraitPending}</small>
        </div>
        <div className="cp-leadership-copy">
          <p>{text.leadershipKicker}</p>
          <h2 id="cp-leadership-title">{text.leadershipTitle}</h2>
          <div className="cp-leadership-name"><strong>Hakkı Kızılok</strong><span>Founder &amp; Chairman</span></div>
          <p className="cp-leadership-body">{withoutStops(text.leadershipBody)}</p>
          <div className="cp-leadership-meta"><span>{text.leadershipProject}</span><a href="https://tr.linkedin.com/in/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        </div>
      </section>

      <section className="cp-flow">
        <header>
          <h2>{text.flowTitle}</h2>
          <p>{withoutStops(text.flowIntro)}</p>
        </header>
        <ol>
          {process.map(([title, description]) => (
            <li key={title}>
              <div><h3>{title}</h3><p>{withoutStops(description)}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cp-next">
        <div><h2>{text.closing}</h2></div>
        <Link href="/kurumsal-bilgiler">{text.records}<span aria-hidden="true">↗</span></Link>
      </section>

      </div>

      <div className="cp-story-simple">
        <section className="cp-simple-overview" aria-labelledby="cp-simple-story-title">
          <header>
            <span>{lang === 'tr' ? 'BİZİM HİKÂYEMİZ' : 'OUR STORY'}</span>
            <h2 id="cp-simple-story-title">{lang === 'tr' ? 'BaX Composites' : 'BaX Composites'}</h2>
            <p>{lang === 'tr' ? 'İleri kompozit mühendisliğini tasarımdan seri üretime taşıyoruz' : 'We carry advanced composite engineering from design into serial production'}</p>
          </header>
          <div className="cp-simple-columns">
            <article>
              <h3>{lang === 'tr' ? 'Şirket hikâyesi' : 'Company story'}</h3>
              <p>{withoutStops(d.aboutDescription)}</p>
            </article>
            <article>
              <h3>{lang === 'tr' ? 'Mühendislik yaklaşımı' : 'Engineering approach'}</h3>
              <p>{withoutStops(d.aboutGoal)}</p>
            </article>
            <article>
              <h3>{lang === 'tr' ? 'Odak alanları' : 'Focus areas'}</h3>
              <ul>
                <li>{text.capability}</li>
                <li>{text.sectors}</li>
                <li>{lang === 'tr' ? 'Sürdürülebilir malzeme ve üretim' : 'Sustainable material and manufacturing'}</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="cp-simple-founder" aria-labelledby="cp-simple-founder-title">
          <div className="cp-simple-founder-portrait" aria-label={text.portraitPending}>
            <span>HK</span>
            <small>{text.portraitPending}</small>
          </div>
          <div className="cp-simple-founder-copy">
            <span>{lang === 'tr' ? 'KURUCU' : 'FOUNDER'}</span>
            <h2 id="cp-simple-founder-title">Hakkı Kızılok</h2>
            <strong>Founder &amp; Chairman</strong>
            <p>{withoutStops(text.leadershipBody)}</p>
            <div><span>{text.leadershipProject}</span><a href="https://tr.linkedin.com/in/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
          </div>
        </section>

        <section className="cp-simple-process" aria-labelledby="cp-simple-process-title">
          <header>
            <span>{lang === 'tr' ? 'ÇALIŞMA BİÇİMİMİZ' : 'HOW WE WORK'}</span>
            <h2 id="cp-simple-process-title">{lang === 'tr' ? 'Tek ekip ve açık bir süreç' : 'One team and a clear process'}</h2>
          </header>
          <ol>
            {process.map(([title, description]) => <li key={title}><h3>{title}</h3><p>{withoutStops(description)}</p></li>)}
          </ol>
        </section>

        <section className="cp-simple-next">
          <div><span>{lang === 'tr' ? 'KURUMSAL BİLGİLER' : 'CORPORATE INFORMATION'}</span><h2>{lang === 'tr' ? 'Doğrulanabilir ve açık bilgi' : 'Clear and verifiable information'}</h2></div>
          <Link href="/kurumsal-bilgiler">{text.records}<span aria-hidden="true">↗</span></Link>
        </section>
      </div>

      <footer className="profile-footer">
        <span>© 2026 BaX Composites Inc</span>
        <Link href="/kvkk">{text.legal}</Link>
        <Link href="/#home">baxcomposites.com</Link>
      </footer>
    </main>
  )
}
