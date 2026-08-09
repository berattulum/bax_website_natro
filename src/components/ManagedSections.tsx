import type { SiteUISettings } from '@/lib/cms/site-settings-defaults'
import type { CSSProperties } from 'react'

type ExpertiseItem = { order: number; title: string; description: string }
export type Partner = { name: string; caption: string; website: string; logo: string }
export type Membership = { name: string; category: string; website: string; logo: string; darkCard?: boolean }
export type SectionKey = 'about' | 'designNarrative' | 'expertise' | 'manufacturingNarrative' | 'process' | 'principles' | 'solutions' | 'partners' | 'memberships' | 'contact'
export type SectionLayoutItem = { section: SectionKey; enabled: boolean }

function SafeHeading({ text }: { text?: string }) {
  const lines = (text || '').replace(/<\/?span>/gi, '').split(/<br\s*\/?>/gi)
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>)}</>
}

function expertiseBullets(description: string, locale: 'tr' | 'en') {
  return description
    .replace(/[.。]+$/g, '')
    .split(',')
    .map((item) => item.trim().replace(/^(?:and|ve)\s+/i, ''))
    .filter(Boolean)
    .map((item) => `${item.charAt(0).toLocaleUpperCase(locale === 'tr' ? 'tr-TR' : 'en-US')}${item.slice(1)}`)
}

const expertiseAnchors = [
  'composite-design',
  'industrialization-automation',
  'material-process-innovation',
  'testing-qualification-certification',
  'tooling-machinery-equipment',
  'engineering-consulting',
] as const

export function ExpertiseSection({ items, label, locale = 'en' }: { items: ExpertiseItem[]; label: string; locale?: 'tr' | 'en' }) {
  return (
    <section id="expertise" className="expertise-section scroll-reveal" aria-label={label}>
      <div className="container">
        <div className="expertise-wrapper">
          {items.map((item, index) => (
            <a className={`expertise-item${index < 4 ? ' expertise-item-featured' : ''}`} href={`/expertise#${expertiseAnchors[index] || expertiseAnchors[0]}`} style={{ '--reveal-order': item.order } as CSSProperties} key={item.order}>
              {index === 0 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/solution-civil-aviation.webp" aria-hidden="true"><source src="/assets/solution-civil-loop.mp4" type="video/mp4" /></video>}
              {index === 1 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/industrialization-robot-start-v1.png" aria-hidden="true"><source src="/assets/industrialization-automation-loop-v1.mp4" type="video/mp4" /></video>}
              {index === 2 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/assets/material-process-innovation-loop-v1.mp4" type="video/mp4" /></video>}
              {index === 3 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/assets/testing-qualification-loop-v1.mp4" type="video/mp4" /></video>}
              <span className="expertise-item-content">
                <h3 data-i18n={`expertise${item.order}Title`}>{item.title}</h3>
                <ul className="expertise-item-points" data-i18n={`expertise${item.order}Description`}>{expertiseBullets(item.description, locale).map((point) => <li key={point}>{point}</li>)}</ul>
                <span className="expertise-item-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ReferencesSection({ title, description, note, items }: { title: string; description: string; note: string; items: Partner[] }) {
  return (
    <section id="references" className="references-section" aria-labelledby="references-title">
      <div className="container">
        <div className="references-heading">
          <div><h2 id="references-title" data-i18n="referencesTitle"><SafeHeading text={title} /></h2></div>
          <p data-i18n="referencesText">{description}</p>
        </div>
        <div className="logo-grid" aria-label="Referans kurumlar">
          {items.map((item) => (
            <a className="logo-card" href={item.website} target="_blank" rel="noopener" key={item.name}>
              {/* Payload validates and owns these uploaded image URLs. */}
              {item.logo ? <img src={item.logo} alt="" loading="lazy" decoding="async" /> : <strong className="logo-fallback">{item.name}</strong>}
              <span>{item.caption || item.name}</span>
            </a>
          ))}
        </div>
        <p className="references-note" data-i18n="referencesNote">{note}</p>
      </div>
    </section>
  )
}

export function MembershipsSection({ title, description, items }: { title: string; description: string; items: Membership[] }) {
  return (
    <section id="memberships" className="memberships-section" aria-labelledby="memberships-title">
      <div className="container">
        <div className="memberships-heading">
          <div><h2 id="memberships-title" data-i18n="membershipsTitle"><SafeHeading text={title} /></h2></div>
          <p data-i18n="membershipsText">{description}</p>
        </div>
        <div className="membership-grid">
          {items.map((item) => (
            <a className={`membership-card${item.darkCard ? ' membership-card-dark' : ''}`} href={item.website} target="_blank" rel="noopener" key={item.name}>
              <span className="membership-logo"><img src={item.logo} alt="" loading="lazy" decoding="async" /></span>
              <span className="membership-meta"><strong>{item.name}</strong><small>{item.category}</small></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EcosystemPreview({
  lang,
  partners,
  memberships,
}: {
  lang: 'tr' | 'en'
  partners: Partner[]
  memberships: Membership[]
}) {
  const copy = lang === 'tr'
    ? {
        eyebrow: 'EKOSİSTEM',
        title: 'Mühendisliğin güçlü bağlantıları',
        text: 'İleri kompozit çözümlerimizi stratejik iş ortaklıkları, araştırma ağları ve uluslararası teknoloji ekosistemiyle güçlendiriyoruz.',
        partners: 'İş Ortaklıklarını Keşfedin',
        networks: 'Ağlar ve Üyelikler',
        selected: 'Seçilmiş ekosistem bağlantıları',
      }
    : {
        eyebrow: 'ECOSYSTEM',
        title: 'Strong connections for advanced engineering',
        text: 'We strengthen advanced-composite solutions through strategic partnerships, research networks and the international technology ecosystem.',
        partners: 'Explore Partnerships',
        networks: 'Networks & Memberships',
        selected: 'Selected ecosystem connections',
      }
  const selected = [
    ...partners.slice(0, 4).map((item) => ({ ...item, type: 'partner' as const })),
    ...memberships.slice(0, 2).map((item) => ({ ...item, caption: item.category, type: 'network' as const })),
  ]

  return (
    <section id="ecosystem" className="ecosystem-preview scroll-reveal" aria-labelledby="ecosystem-preview-title">
      <div className="container ecosystem-preview-inner">
        <div className="ecosystem-preview-copy">
          <h2 id="ecosystem-preview-title">{copy.title}</h2>
          <p>{copy.text}</p>
          <div className="ecosystem-preview-actions">
            <a href="/is-ortakliklari">{copy.partners}<span aria-hidden="true">↗</span></a>
            <a href="/aglar-ve-uyelikler">{copy.networks}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="ecosystem-preview-logos" aria-label={copy.selected}>
          {selected.map((item) => (
            <a href={item.website} target="_blank" rel="noopener" key={`${item.type}-${item.name}`}>
              {item.logo ? <img src={item.logo} alt="" loading="lazy" decoding="async" /> : <strong>{item.name}</strong>}
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export type ManagedLocale = {
  dictionary: Record<string, string>
  seo: { title: string; description: string }
  ui: SiteUISettings
  expertise: ExpertiseItem[]
  partners: Partner[]
  memberships: Membership[]
  sectionLayout: SectionLayoutItem[]
}
