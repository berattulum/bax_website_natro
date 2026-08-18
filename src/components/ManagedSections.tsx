import type { SiteUISettings } from '@/lib/cms/site-settings-defaults'
import type { CSSProperties } from 'react'

type ExpertiseItem = { order: number; title: string; description: string }
export type Partner = { name: string; caption: string; website: string; logo: string }
export type Membership = { name: string; category: string; website: string; logo: string; darkCard?: boolean }
type EcosystemItem = (Partner | Membership) & { caption: string; type: 'partner' | 'network'; alt?: string }
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
  const recycling = locale === 'tr'
    ? { eyebrow: 'DÖNGÜSEL KOMPOZİT MÜHENDİSLİĞİ', text: 'Geri dönüştürülmüş kompozitleri malzeme seçiminden doğrulanmış üretime taşıyoruz', point: 'Geri dönüştürülmüş kompozit prosesleri' }
    : { eyebrow: 'CIRCULAR COMPOSITE ENGINEERING', text: 'Moving recycled composites from material selection into verified production', point: 'Recycled composite process routes' }
  return (
    <section id="expertise" className="expertise-section scroll-reveal" aria-label={label}>
      <div className="container">
        <div className="expertise-wrapper">
          {items.map((item, index) => (
            <a className={`expertise-item${index < 4 ? ' expertise-item-featured' : ''}`} href={`/capabilities#${expertiseAnchors[index] || expertiseAnchors[0]}`} style={{ '--reveal-order': item.order } as CSSProperties} key={item.order}>
              {index === 0 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/solution-civil-aviation.webp" aria-hidden="true"><source src="/assets/solution-civil-loop.mp4" type="video/mp4" /></video>}
              {index === 1 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/industrialization-robot-start-v1.png" aria-hidden="true"><source src="/assets/industrialization-automation-loop-v1.mp4" type="video/mp4" /></video>}
              {index === 2 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/assets/material-process-dynamic-close.mp4" type="video/mp4" /></video>}
              {index === 3 && <video className="expertise-item-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/assets/testing-qualification-loop-v1.mp4" type="video/mp4" /></video>}
              <span className="expertise-item-content">
                <h3 data-i18n={`expertise${item.order}Title`}>{item.title}</h3>
                <ul className="expertise-item-points" data-i18n={`expertise${item.order}Description`}>{[...expertiseBullets(item.description, locale), ...(index === 2 ? [recycling.point] : [])].map((point) => <li key={point}>{point}</li>)}</ul>
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
        title: 'Mühendislikle bağlanan bir ekosistem',
        text: 'Endüstriyel kuruluşları araştırma ağlarını ve uluslararası programları ileri kompozit mühendisliği etrafında buluşturuyoruz',
        partners: 'Ekosistemi Keşfedin',
        networks: 'Ağlar ve Üyelikler',
        selected: 'Seçilmiş ekosistem bağlantıları',
        partnerType: 'Endüstriyel ekosistem',
      }
    : {
        eyebrow: 'ECOSYSTEM',
        title: 'Connected by engineering',
        text: 'We bring industrial organizations research networks and international programmes together around advanced composite engineering',
        partners: 'Explore the Ecosystem',
        networks: 'Networks & Memberships',
        selected: 'Selected ecosystem connections',
        partnerType: 'Industrial ecosystem',
      }
  const sampe: EcosystemItem = {
    name: 'SAMPE Europe / Türkiye',
    caption: 'ADVANCED MATERIALS SOCIETY',
    website: 'https://sampe.org/',
    logo: '/logos/memberships/sampe.svg',
    type: 'network',
    alt: 'Society for the Advancement of Material and Process Engineering — Türkiye Chapter Presidency by Hakkı Kızılok',
  }
  const membershipHighlights = memberships
    .filter((item) => item.name.trim().toLocaleLowerCase('en-US') !== 'composites united')
    .map((item) => ({ ...item, caption: item.category, type: 'network' as const }))
  const normaliseName = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en-US')
  const membership = (name: string) => membershipHighlights.find((item) => normaliseName(item.name) === normaliseName(name))
  const partner = (name: string, caption: string) => {
    const item = partners.find((candidate) => normaliseName(candidate.name) === normaliseName(name))
    return item ? { ...item, caption, type: 'partner' as const } : undefined
  }
  const isDefined = <T,>(item: T | undefined): item is T => item !== undefined
  const orderedMemberships = [membership('TOBB'), membership('İstanbul Ticaret Odası'), membership('TÜBİTAK'), membership('M-ERA.NET')].filter(isDefined)
  const orderedPartners = [
    partner('CTC', 'INDUSTRIAL ECOSYSTEM · COMPOSITE TECHNOLOGY CENTER, AN AIRBUS COMPANY'),
    partner('Toray', 'ADVANCED MATERIALS NETWORK'),
    partner('Kale', 'INDUSTRIAL TECHNOLOGY PARTNER'),
  ].filter(isDefined)
  const pinnedNames = new Set([...orderedMemberships, sampe, ...orderedPartners].map((item) => normaliseName(item.name)))
  const selected: EcosystemItem[] = [
    ...orderedMemberships,
    sampe,
    ...orderedPartners,
    ...membershipHighlights.filter((item) => !pinnedNames.has(normaliseName(item.name))),
    ...partners
      .filter((item) => !pinnedNames.has(normaliseName(item.name)))
      .map((item) => ({ ...item, caption: copy.partnerType, type: 'partner' as const })),
  ]

  const ecosystemCards = (duplicate = false) => selected.map((item) => (
    <a
      className="ecosystem-preview-card"
      href={item.website}
      target="_blank"
      rel="noopener"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
      key={`${duplicate ? 'duplicate' : 'primary'}-${item.type}-${item.name}`}
    >
      <span className="ecosystem-preview-card-logo">
        {item.logo ? <img src={item.logo} alt={item.alt || `${item.name} — ${item.caption}`} loading="lazy" decoding="async" /> : <strong aria-label={item.alt || `${item.name} — ${item.caption}`}>{item.name}</strong>}
      </span>
      <span className="ecosystem-preview-card-meta"><small>{item.caption}</small><strong>{item.name}</strong></span>
    </a>
  ))

  return (
    <section id="ecosystem" className="ecosystem-preview scroll-reveal" aria-labelledby="ecosystem-preview-title">
      <div className="container ecosystem-preview-inner">
        <div className="ecosystem-preview-copy">
          <span className="ecosystem-preview-eyebrow">{copy.eyebrow}</span>
          <h2 id="ecosystem-preview-title">{copy.title}</h2>
        </div>
        <div className="ecosystem-preview-intro">
          <p>{copy.text}</p>
          <div className="ecosystem-preview-actions">
            <a href="/is-ortakliklari">{copy.partners}<span aria-hidden="true">↗</span></a>
            <a href="/aglar-ve-uyelikler">{copy.networks}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
      <div className="ecosystem-preview-rail" aria-label={copy.selected}>
        <div className="ecosystem-preview-track">
          <div className="ecosystem-preview-track-group">{ecosystemCards()}</div>
          <div className="ecosystem-preview-track-group" aria-hidden="true">{ecosystemCards(true)}</div>
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
