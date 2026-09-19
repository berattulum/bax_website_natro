'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import type { ManagedLocale } from '@/components/ManagedSections'
import styles from './ContactPageClient.module.css'
import { contactPageCopy, type ContactPageCopy } from '@/lib/cms/contact-page-defaults'
import { hrefFor } from '@/lib/i18n/site-routes'
import { useSiteLanguage } from '@/lib/i18n/use-site-language'

type TurnstileApi = {
  render: (container: HTMLElement, options: {
    sitekey: string
    action: string
    theme: 'light'
    callback: (token: string) => void
    'expired-callback': () => void
    'error-callback': () => void
  }) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

export function ContactPageClient({
  locales,
  content,
}: {
  locales: Record<CorporateLang, ManagedLocale>
  content?: Record<CorporateLang, ContactPageCopy>
}) {
  const [lang, setLang] = useSiteLanguage()
  const [status, setStatus] = useState<'idle' | 'sending' | 'received' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileContainer = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const t = content?.[lang] || contactPageCopy[lang]
  const dictionary = locales[lang].dictionary

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    const turnstile = (window as Window & { turnstile?: TurnstileApi }).turnstile
    if (!turnstileReady || !siteKey || !turnstile || !turnstileContainer.current) return

    turnstileWidgetId.current = turnstile.render(turnstileContainer.current, {
      sitekey: siteKey,
      action: 'contact_form',
      theme: 'light',
      callback: setTurnstileToken,
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => { setTurnstileToken(''); setStatus('failed') },
    })

    return () => {
      if (turnstileWidgetId.current) turnstile.remove(turnstileWidgetId.current)
      turnstileWidgetId.current = null
      setTurnstileToken('')
    }
  }, [turnstileReady])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMessage(lang === 'tr' ? 'Güvenlik doğrulaması tamamlanmadı.' : 'Security check is incomplete.')
      setStatus('failed')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          company: String(data.get('company') || '').trim(),
          email: String(data.get('email') || '').trim(),
          phone: String(data.get('phone') || '').trim(),
          subject: String(data.get('subject') || '').trim(),
          message: String(data.get('message') || '').trim(),
          consent: data.get('consent') === 'on',
          baxHp: data.get('bax_hp') === 'on',
          turnstileToken: turnstileToken || '',
        }),
      })
      const payload = await response.json().catch(() => null) as { error?: string; message?: string } | null
      if (!response.ok) {
        setErrorMessage(payload?.error || t.failed)
        throw new Error(payload?.error || 'Contact request failed')
      }
      form.reset()
      if (turnstileWidgetId.current) (window as Window & { turnstile?: TurnstileApi }).turnstile?.reset(turnstileWidgetId.current)
      setTurnstileToken('')
      setStatus('received')
    } catch {
      setStatus('failed')
      setErrorMessage((current) => current || t.failed)
    }
  }

  return <div className={styles.page}>
    {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setTurnstileReady(true)} />}
    <CorporateHeader lang={lang} active="contact" onLangChange={setLang} />

    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <span>{t.eyebrow}</span>
            <h1>{t.title}</h1>
          </div>
          <p>{t.intro}</p>
        </div>
      </section>

      <section className={styles.contactBody}>
        <div className={styles.contactInner}>
          <header className={styles.sectionHeading}>
            <span>{lang === 'tr' ? 'PROJE İLETİŞİMİ' : 'PROJECT CONTACT'}</span>
            <h2>{t.formTitle}</h2>
            <p>{t.formIntro}</p>
          </header>

          <div className={styles.contactGrid}>
            <form className={styles.form} onSubmit={submit}>
              <input type="checkbox" name="bax_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />
              <fieldset className={styles.types}>
                <legend>{t.requestType}</legend>
                <div>{t.requestTypes.map((item) => <label key={item}><input type="radio" name="subject" value={item} required /><span>{item}</span></label>)}</div>
              </fieldset>
              <label className={styles.field}><span>{t.name}</span><input name="name" autoComplete="name" required /></label>
              <label className={styles.field}><span>{t.company}</span><input name="company" autoComplete="organization" /></label>
              <label className={styles.field}><span>{t.email}</span><input type="email" name="email" autoComplete="email" required /></label>
              <label className={styles.field}><span>{t.phone}</span><input type="tel" name="phone" autoComplete="tel" /></label>
              <label className={`${styles.field} ${styles.wide}`}><span>{t.message}</span><textarea name="message" rows={5} minLength={10} required placeholder={t.messagePlaceholder} /></label>
              <label className={`${styles.consent} ${styles.wide}`}><input type="checkbox" name="consent" required /><span>{t.consent} <Link href={hrefFor('privacy', lang)}>{t.privacy}</Link>.</span></label>
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <div ref={turnstileContainer} className={styles.wide} />}
              <div className={`${styles.submit} ${styles.wide}`}>
                <p role="status" aria-live="polite" data-status={status}>{status === 'received' ? t.received : status === 'failed' ? (errorMessage || t.failed) : ''}</p>
                <button type="submit" disabled={status === 'sending' || Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}><span>{status === 'sending' ? t.sending : t.send}</span><b aria-hidden="true">↗</b></button>
              </div>
            </form>

            <aside className={styles.directory}>
              <section>
                <span>{t.direct}</span>
                <a href={`mailto:${dictionary.email}`}><small>E-MAIL</small><strong>{dictionary.email}</strong><b aria-hidden="true">↗</b></a>
                <a href={`tel:${(dictionary.phone || '').replace(/[^+\d]/g, '')}`}><small>{lang === 'tr' ? 'TELEFON' : 'PHONE'}</small><strong>{dictionary.phone}</strong><b aria-hidden="true">↗</b></a>
              </section>
              <section>
                <span>{t.offices}</span>
                <article><small>{t.headOffice}</small><p>{dictionary.headOffice}</p></article>
                <article><small>{t.branchOffice}</small><p>{dictionary.branchOffice}</p></article>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>

    <PublicFooter lang={lang} />
  </div>
}
