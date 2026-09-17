'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { CorporateHeader } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { sustainabilityCopy } from '@/lib/cms/sustainability-page-defaults'
import styles from './SustainabilityClient.module.css'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'

export { sustainabilityCopy }

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

export function SustainabilityClient({ content = sustainabilityCopy }: { content?: typeof sustainabilityCopy }) {
  const [lang, setLang] = useSiteLanguage()
  const localeCopy = content?.[lang] ?? sustainabilityCopy[lang]
  const c = removePeriods(localeCopy && 'heroKicker' in localeCopy ? localeCopy : sustainabilityCopy[lang])

  return <main className={styles.page}>
    <CorporateHeader lang={lang} active="sustainability" onLangChange={setLang} />

    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        <Image src="/assets/sustainability/wind-power-landscape-zac-wolff.jpg" alt={lang === 'tr' ? 'Yeşil arazi üzerinde çalışan rüzgâr türbinleri' : 'Operating wind turbines across a green landscape'} fill priority sizes="100vw" />
      </div>
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <p className={styles.kicker}>{c.heroKicker}</p>
        <h1>{c.heroTitle[0]}<br /><em>{c.heroTitle[1]}</em></h1>
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
      <p className={styles.kicker}>{c.closingKicker}</p><h2>{c.closingTitle[0]}<br /><em>{c.closingTitle[1]}</em></h2>
      <div><p>{c.closingText}</p><Link href="/iletisim">{c.closingCta}<span>↗</span></Link></div>
    </section>

    <PublicFooter lang={lang} />
  </main>
}
