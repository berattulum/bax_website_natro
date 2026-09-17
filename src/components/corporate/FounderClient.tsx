'use client'

import Image from 'next/image'
import { CorporateHeader } from './CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { founderCopy, type FounderPageCopy } from '@/lib/cms/founder-page-defaults'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'
import styles from './FounderClient.module.css'

export { founderCopy }

export function FounderClient({
  content = founderCopy,
}: {
  content?: Record<'tr' | 'en', FounderPageCopy>
}) {
  const [lang, setLang] = useSiteLanguage()
  const text = content?.[lang] && 'eyebrow' in content[lang] ? content[lang] : founderCopy[lang]

  return (
    <main className={styles.page}>
      <CorporateHeader lang={lang} active="founder" onLangChange={setLang} />
      <div className={styles.introBand} aria-hidden="true" />
      <section className={styles.profileHero}>
        <figure className={styles.portrait}>
          <Image
            src="/assets/hakki-kizilok.jpeg"
            alt={
              lang === 'tr'
                ? 'BaX Composites kurucusu Hakkı Kızılok'
                : 'Hakkı Kızılok founder of BaX Composites'
            }
            width={400}
            height={400}
            priority
            quality={100}
          />
        </figure>
        <div className={styles.profileCopy}>
          <p className={`${styles.eyebrow} founder-airbus-type`}>{text.eyebrow}</p>
          <h1 className="founder-airbus-type">Hakkı Kızılok</h1>
          <h2 className="founder-airbus-type">{text.role}</h2>
          <p className={`${styles.intro} founder-airbus-type`}>{text.intro}</p>
        </div>
      </section>

      <section className={styles.details} aria-labelledby="founder-profile-title">
        <header>
          <p className="founder-airbus-type">{text.focusLabel}</p>
          <h2 className="founder-airbus-type" id="founder-profile-title">
            {text.focusTitle}
          </h2>
        </header>
        <ul>
          {text.facts.map(([title, body]) => (
            <li className="founder-airbus-type" key={title}>
              <h3 className="founder-airbus-type">{title}</h3>
              <p className="founder-airbus-type">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.evidence} aria-label={text.sources}>
        <p className="founder-airbus-type">{text.sources}</p>
        <div>
          <a
            className="founder-airbus-type"
            href="https://www.m-era.net/materipedia/2022/machflexcomp"
            target="_blank"
            rel="noreferrer"
          >
            <span className="founder-airbus-type">{text.mach}</span>
            <i>↗</i>
          </a>
          <a
            className="founder-airbus-type"
            href="https://www.linkedin.com/posts/bax-composites-inc_recycled-thermoplastic-composite-activity-7290071524789641217-Ws19"
            target="_blank"
            rel="noreferrer"
          >
            <span className="founder-airbus-type">{text.loco}</span>
            <i>↗</i>
          </a>
          <a
            className="founder-airbus-type"
            href="https://www.linkedin.com/posts/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0_sampet%C3%BCrkiye-sampe-sampeeurope-activity-7470793752828338177-poc6"
            target="_blank"
            rel="noreferrer"
          >
            <span className="founder-airbus-type">{text.sampe}</span>
            <i>↗</i>
          </a>
          <a
            className="founder-airbus-type"
            href="https://www.linkedin.com/in/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0?originalSubdomain=tr"
            target="_blank"
            rel="noreferrer"
          >
            <span className="founder-airbus-type">{text.linkedin}</span>
            <i>↗</i>
          </a>
        </div>
      </section>
      <PublicFooter lang={lang} />
    </main>
  )
}
