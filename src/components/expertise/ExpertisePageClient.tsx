'use client'

import { useEffect, useState } from 'react'
import type { ManagedLocale } from '@/components/ManagedSections'
import { CorporateHeader } from '@/components/corporate/CorporateHeader'

type Lang = 'tr' | 'en'

const anchors = [
  'composite-design',
  'industrialization-automation',
  'material-process-innovation',
  'testing-qualification-certification',
  'tooling-machinery-equipment',
  'engineering-consulting',
] as const

export function ExpertisePageClient({ locales }: { locales: Record<Lang, ManagedLocale> }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  const setLanguage = (next: Lang) => {
    localStorage.setItem('bax-language', next)
    setLang(next)
  }

  const items = locales[lang].expertise

  return <main className="expertise-page">
    <CorporateHeader lang={lang} active="expertise" onLangChange={setLanguage} />

    <section className="expertise-page-hero">
      <span>{lang === 'tr' ? 'MÜHENDİSLİK YETKİNLİKLERİ' : 'ENGINEERING CAPABILITIES'}</span>
      <h1>{lang === 'tr' ? 'Uzmanlıklarımız' : 'Expertise'}</h1>
      <p>{lang === 'tr' ? 'Tasarımdan seri üretime uzanan bütünleşik kompozit mühendisliği' : 'Integrated composite engineering from design to serial production'}</p>
    </section>

    <div className="expertise-page-sections">
      {items.map((item, index) => <section id={anchors[index]} className="expertise-page-section" key={item.order}>
        <span className="expertise-page-index">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      </section>)}
    </div>
  </main>
}
