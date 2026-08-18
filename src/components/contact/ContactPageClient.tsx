'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { CorporateHeader, type CorporateLang } from '@/components/corporate/CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import type { ManagedLocale } from '@/components/ManagedSections'
import styles from './ContactPageClient.module.css'

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

const copy = {
  tr: {
    eyebrow: 'İLETİŞİM / PROJE TALEBİ',
    title: 'Bir sonraki yapısal çözümü birlikte geliştirelim.',
    intro: 'Tasarım, analiz, doğrulama veya seri üretim ihtiyacınızı paylaşın. Talebinizi doğru mühendislik ekibine yönlendirelim.',
    formTitle: 'Projenizi bize anlatın',
    formIntro: 'Kısa bilgiler ilk teknik değerlendirme için yeterlidir.',
    requestType: 'Talep türü',
    requestTypes: ['Proje geliştirme', 'İş ortaklığı', 'Tedarik ve üretim', 'Genel iletişim'],
    name: 'Ad soyad', company: 'Şirket / kurum', email: 'Kurumsal e-posta', phone: 'Telefon',
    message: 'İhtiyacınız veya proje kapsamı',
    messagePlaceholder: 'Sektör, parça veya sistem, proje aşaması, hedeflenen performans ve zaman planını kısaca paylaşabilirsiniz.',
    consent: 'İletişim amacıyla bilgilerimin işlenmesini kabul ediyorum.',
    privacy: 'KVKK aydınlatma metni',
    send: 'TALEBİ GÖNDER', sending: 'GÖNDERİLİYOR…', received: 'Talebiniz alındı. Ekibimiz sizinle iletişime geçecek.', failed: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
    direct: 'Doğrudan iletişim', offices: 'Ofislerimiz', headOffice: 'Genel merkez', branchOffice: 'Şube',
    process: 'Talebiniz nasıl ilerler?',
    steps: [
      ['01', 'Talep alınır', 'Mesajınız güvenli biçimde kayıt altına alınır.'],
      ['02', 'Teknik inceleme', 'İhtiyaç ilgili mühendislik ve üretim ekibine yönlendirilir.'],
      ['03', 'İlk görüşme', 'Kapsamı netleştirmek için sizinle iletişime geçilir.'],
    ],
    back: 'Ana sayfaya dön',
  },
  en: {
    eyebrow: 'CONTACT / PROJECT ENQUIRY',
    title: 'Let’s develop the next structural solution together.',
    intro: 'Share your design, analysis, validation or serial manufacturing needs. We will route your enquiry to the right engineering team.',
    formTitle: 'Tell us about your project',
    formIntro: 'A short brief is enough for the initial technical review.',
    requestType: 'Enquiry type',
    requestTypes: ['Project development', 'Partnership', 'Supply and manufacturing', 'General enquiry'],
    name: 'Full name', company: 'Company / organization', email: 'Business email', phone: 'Phone',
    message: 'Your need or project scope',
    messagePlaceholder: 'You can briefly share the sector, part or system, project stage, performance targets and expected timeline.',
    consent: 'I consent to the processing of my information for communication purposes.',
    privacy: 'Privacy notice',
    send: 'SEND ENQUIRY', sending: 'SENDING…', received: 'Your enquiry has been received. Our team will contact you.', failed: 'Your message could not be sent. Please try again.',
    direct: 'Direct contact', offices: 'Our offices', headOffice: 'Head office', branchOffice: 'Branch office',
    process: 'What happens next?',
    steps: [
      ['01', 'Enquiry received', 'Your message is securely recorded.'],
      ['02', 'Technical review', 'Your needs are routed to the relevant engineering and production team.'],
      ['03', 'Initial discussion', 'We contact you to clarify the scope.'],
    ],
    back: 'Return to homepage',
  },
} as const

export function ContactPageClient({ locales }: { locales: Record<CorporateLang, ManagedLocale> }) {
  const [lang, setLang] = useState<CorporateLang>('en')
  const [status, setStatus] = useState<'idle' | 'sending' | 'received' | 'failed'>('idle')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileContainer = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const t = copy[lang]
  const dictionary = locales[lang].dictionary

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

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
      setStatus('failed')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          name: data.get('name'), company: data.get('company'), email: data.get('email'), phone: data.get('phone'),
          subject: data.get('subject'), message: data.get('message'), consent: data.get('consent') === 'on',
          website: data.get('website') || '', turnstileToken,
        }),
      })
      if (!response.ok) throw new Error('Contact request failed')
      form.reset()
      if (turnstileWidgetId.current) (window as Window & { turnstile?: TurnstileApi }).turnstile?.reset(turnstileWidgetId.current)
      setTurnstileToken('')
      setStatus('received')
    } catch {
      setStatus('failed')
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
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />
              <fieldset className={styles.types}>
                <legend>{t.requestType}</legend>
                <div>{t.requestTypes.map((item) => <label key={item}><input type="radio" name="subject" value={item} required /><span>{item}</span></label>)}</div>
              </fieldset>
              <label className={styles.field}><span>{t.name}</span><input name="name" autoComplete="name" required /></label>
              <label className={styles.field}><span>{t.company}</span><input name="company" autoComplete="organization" /></label>
              <label className={styles.field}><span>{t.email}</span><input type="email" name="email" autoComplete="email" required /></label>
              <label className={styles.field}><span>{t.phone}</span><input type="tel" name="phone" autoComplete="tel" /></label>
              <label className={`${styles.field} ${styles.wide}`}><span>{t.message}</span><textarea name="message" rows={5} minLength={10} required placeholder={t.messagePlaceholder} /></label>
              <label className={`${styles.consent} ${styles.wide}`}><input type="checkbox" name="consent" required /><span>{t.consent} <Link href="/kvkk/aydinlatma-metni">{t.privacy}</Link>.</span></label>
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <div ref={turnstileContainer} className={styles.wide} />}
              <div className={`${styles.submit} ${styles.wide}`}>
                <p role="status" aria-live="polite" data-status={status}>{status === 'received' ? t.received : status === 'failed' ? t.failed : ''}</p>
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
