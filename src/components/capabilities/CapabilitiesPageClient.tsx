'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { ManagedLocale } from '@/components/ManagedSections'
import { CorporateHeader } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { capabilitiesPageCopy, type CapabilitiesPageCopy } from '@/lib/cms/capabilities-page-defaults'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'
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

function withoutPeriods(value: string) {
  return value.replace(/[.。]+/g, '').trim()
}

export function CapabilitiesPageClient({
  locales,
  content,
}: {
  locales: Record<Lang, ManagedLocale>
  content?: Record<Lang, CapabilitiesPageCopy>
}) {
  const [lang, setLanguage] = useSiteLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const page = content?.[lang] || capabilitiesPageCopy[lang]

  useEffect(() => {
    const index = anchors.indexOf(window.location.hash.slice(1) as typeof anchors[number])
    if (index >= 0) setActiveIndex(index)
  }, [])

  const items = page.fallback.map((fallback, index) => ({
    ...fallback,
    ...locales[lang].expertise[index],
  }))
  const activeItem = items[activeIndex]
  const activeVideo = page.videos[activeIndex]
  const labels = page.labels

  const selectCapability = (index: number) => {
    setActiveIndex(index)
    window.history.replaceState(null, '', `#${anchors[index]}`)
  }

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
          <strong>{item.title}</strong>
        </button>)}
      </div>

      <article id="capability-panel" className={styles.panel} role="tabpanel" aria-labelledby={`capability-tab-${activeIndex}`}>
        <div className={styles.media} key={`media-${activeIndex}`}>
          {activeVideo.src ? <video autoPlay muted loop playsInline preload="metadata" poster={activeVideo.poster} aria-hidden="true"><source src={activeVideo.src} type="video/mp4" /></video> : <Image src={activeVideo.poster} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" />}
        </div>
        <div className={styles.copy} key={`copy-${activeIndex}`}>
          <span>{lang === 'tr' ? 'YETKİNLİK ALANI' : 'CAPABILITY AREA'}</span>
          <h3>{activeItem.title}</h3><p className={styles.summary}>{withoutPeriods(activeItem.description)}</p>
          <div className={styles.details}><div><h4>{labels.scope}</h4><ul>{page.details[activeIndex]?.map((detail) => <li key={detail}>{detail}</li>)}</ul></div><div><h4>{labels.outputs}</h4><ol>{page.outputsList[activeIndex]?.map((output) => <li key={output}>{output}</li>)}</ol></div></div>
          <div className={styles.connection}><span>{labels.connections}</span><p>{page.connections[activeIndex]}</p></div>
        </div>
      </article>
    </section>
    <section className={styles.system}><header><span>{labels.systemEyebrow}</span><h2>{labels.systemTitle}</h2><p>{labels.systemBody}</p></header><div className={styles.stages}>{page.stages.map(([number, title, description]) => <article key={number}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className={styles.evidence}><header><span>{labels.evidenceEyebrow}</span><h2>{labels.evidenceTitle}</h2><p>{labels.evidenceBody}</p></header><div className={styles.evidenceLinks}>
      <a href="https://www.m-era.net/materipedia/2022/machflexcomp" target="_blank" rel="noreferrer"><span>M-ERA.NET · MACHFLEXCOMP</span><strong>{page.evidence.machTitle}</strong><em>{labels.source} ↗</em></a>
      <a href="https://www.eurekanetwork.org/wp-content/uploads/2026/01/participants-in-eurostars-3-projects.pdf" target="_blank" rel="noreferrer"><span>EUROSTARS · LOCO3</span><strong>{page.evidence.locoTitle}</strong><em>{labels.source} ↗</em></a>
    </div></section>
    <section className={styles.cta}><h2>{labels.cta}</h2><a href="mailto:info@baxcomposites.com">{labels.ctaLink} ↗</a></section>
    <PublicFooter lang={lang} />
  </main>
}
