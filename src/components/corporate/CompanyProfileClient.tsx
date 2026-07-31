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

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const locale = locales[lang]
  const d = locale.dictionary
  const process = locale.ui.process.steps
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
  }

  return (
    <main className="profile-page cp-page">
      <CorporateHeader lang={lang} active="profile" />

      <section className="cp-hero">
        <Image
          src="/assets/bax-facility-exterior.jpg"
          alt={lang === 'tr' ? 'BaX Composites üretim tesisi' : 'BaX Composites production facility'}
          fill
          priority
          sizes="100vw"
          quality={75}
        />
        <div className="cp-hero-shade" />
        <div className="cp-hero-content">
          <h1>{text.heroTitle}</h1>
        </div>
      </section>

      <section className="cp-intro">
        <div className="cp-intro-title">
          <h2>{text.statement}</h2>
        </div>
        <div className="cp-intro-copy">
          <p className="cp-lead">{d.aboutDescription}</p>
          <p>{d.aboutGoal}</p>
          <dl>
            <div><dt>01</dt><dd>{text.founded}</dd></div>
            <div><dt>02</dt><dd>{text.capability}</dd></div>
            <div><dt>03</dt><dd>{text.sectors}</dd></div>
          </dl>
        </div>
      </section>

      <section className="cp-flow">
        <header>
          <h2>{text.flowTitle}</h2>
          <p>{text.flowIntro}</p>
        </header>
        <ol>
          {process.map(([title, description]) => (
            <li key={title}>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cp-next">
        <div><h2>{text.closing}</h2></div>
        <Link href="/kurumsal-bilgiler">{text.records}<span aria-hidden="true">↗</span></Link>
      </section>

      <footer className="profile-footer">
        <span>© 2026 BaX Composites Inc.</span>
        <Link href="/kvkk">{text.legal}</Link>
        <Link href="/#home">baxcomposites.com</Link>
      </footer>
    </main>
  )
}
