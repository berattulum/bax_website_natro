'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PublicFooter } from '@/components/PublicFooter'
import { companyProfileCopy, type CompanyProfileCopy } from '@/lib/cms/company-profile-defaults'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'
import { CorporateHeader, type CorporateLang } from './CorporateHeader'

export function CompanyProfileClient({
  content,
}: {
  content?: Record<CorporateLang, CompanyProfileCopy>
}) {
  const [lang, setLang] = useSiteLanguage()
  const copy = content?.[lang] || companyProfileCopy[lang]

  return <main className="profile-page cp-page cp-page-v2">
    <CorporateHeader lang={lang} active="profile" onLangChange={setLang} />

    <section className="cpv2-hero" aria-labelledby="cpv2-title">
      <div className="cpv2-hero-copy">
        <p>{copy.badge}</p>
        <h1 id="cpv2-title">{copy.title}</h1>
        <span>{copy.subtitle}</span>
      </div>
    </section>

    <section className="cpv2-aerospace" aria-labelledby="cp-aerospace-title">
      <figure>
        <Image src="/assets/bax-facility-front-elevation-v3.png" alt={copy.facilityAlt} fill sizes="(max-width: 900px) 100vw, 42vw" />
        <figcaption>BaX Composites / Istanbul</figcaption>
      </figure>
      <div className="cpv2-aerospace-copy">
        <header>
          <p className="cp-airbus-type">{copy.aerospaceKicker}</p>
          <h2 className="cp-airbus-type" id="cp-aerospace-title">{copy.aerospaceTitle}</h2>
        </header>
        <p className="cp-airbus-type">{copy.aerospaceP1}</p>
        <p className="cp-airbus-type">{copy.aerospaceP2}</p>
      </div>
    </section>

    <section className="cpv2-sector-panels" aria-label={copy.sectorsLabel}>
      {copy.sectors.map((sector) => (
        <article key={sector.title}>
          <Image src={sector.image} alt={sector.alt} fill sizes="(max-width: 760px) 100vw, 100vw" quality={95} />
          <h2>{sector.title}</h2>
        </article>
      ))}
    </section>

    <section className="cpv2-principles" aria-labelledby="cp-principles-title">
      <header>
        <p className="cp-airbus-type">{copy.principlesKicker}</p>
        <h2 className="cp-airbus-type" id="cp-principles-title">{copy.principlesTitle}</h2>
      </header>
      <div className="cpv2-principles-copy">
        <p className="cp-airbus-type">{copy.principlesText}</p>
      </div>
    </section>

    <section className="cpv2-capabilities" aria-labelledby="cp-capabilities-title">
      <header className="cpv2-capabilities-heading">
        <p className="cp-airbus-type">{copy.capabilitiesKicker}</p>
        <h2 className="cp-airbus-type" id="cp-capabilities-title">{copy.capabilitiesTitle}</h2>
      </header>
      <div className="cpv2-capabilities-copy">
        <p className="cp-airbus-type">{copy.capabilitiesText}</p>
      </div>
    </section>

    <section className="cpv2-delivery" aria-labelledby="cp-delivery-title">
      <div className="cpv2-delivery-head">
        <header className="cpv2-section-head">
          <p>{copy.deliveryKicker}</p>
          <h2 id="cp-delivery-title">{copy.deliveryTitle}</h2>
        </header>
        <p className="cpv2-delivery-copy">{copy.deliveryText}</p>
      </div>
      <div className="cpv2-engineering-map" role="region" aria-label={copy.stagesLabel} tabIndex={0}>
        <div className="cpv2-engineering-map-inner">
          <ol className="cpv2-engineering-stages">{copy.stages.map(([title, body]) => <li key={title}><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
          <figure className="cpv2-delivery-visual"><Image src="/assets/about-us/connected-engineering-landscape.png" alt={copy.landscapeAlt} fill sizes="100vw" quality={95} /></figure>
          <ul className="cpv2-engineering-foundations">
            {copy.foundations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="cpv2-next">
      <div>
        <p>{copy.nextKicker}</p>
        <h2>{copy.nextTitle}<br />{copy.nextTitleAccent}</h2>
      </div>
      <nav>
        <Link href="/kurucu">{copy.nextFounder}<span>↗</span></Link>
        <Link href="/kurumsal-bilgiler">{copy.nextCorporate}<span>↗</span></Link>
      </nav>
    </section>

    <PublicFooter lang={lang} />
  </main>
}
