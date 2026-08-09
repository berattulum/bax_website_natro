'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CorporateHeader, type CorporateLang } from './CorporateHeader'

const records = [
  ['Ticari unvan', 'Legal name', 'BaX Kompozit A.Ş. / BaX Composites Inc.'],
  ['MERSİS numarası', 'MERSIS number', '0491051386400001'],
  ['Vergi dairesi', 'Tax office', 'Esenler Vergi Dairesi / İstanbul'],
  ['Vergi numarası', 'Tax number', '4910513864'],
  ['D-U-N-S numarası', 'D-U-N-S number', '595606606'],
  ['Ticaret sicil numarası', 'Trade registry number', '156004-5'],
  ['Ödenmiş sermaye', 'Paid-in capital', '1.800.000,00 TL'],
] as const

export function CorporateInformationClient() {
  const [lang, setLang] = useState<CorporateLang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = lang === 'tr' ? {
    eyebrow: 'KURUMSAL BİLGİLER',
    title: <>Açık, düzenli,<br /><em>doğrulanabilir.</em></>,
    intro: 'BaX Kompozit A.Ş.’nin güncel ticari kimliği, operasyon adresleri ve resmî kayıt bağlantısı.',
    identity: 'Şirket kayıtları',
    offices: 'Operasyon noktaları',
    head: 'Genel merkez',
    branch: 'Üretim şubesi',
    verify: 'Resmî kaydı doğrulayın',
    verifyText: 'Güncel şirket kaydına Merkezi Kayıt Kuruluşu e-Şirket Bilgi Portalı üzerinden ulaşabilirsiniz.',
    verifyLink: 'MKK kaydını görüntüle',
    legal: 'KVKK ve yasal belgeler',
  } : {
    eyebrow: 'CORPORATE INFORMATION',
    title: <>Clear, structured,<br /><em>verifiable.</em></>,
    intro: 'The current commercial identity, operating addresses and official registry link of BaX Composites Inc.',
    identity: 'Company records',
    offices: 'Operating locations',
    head: 'Head office',
    branch: 'Production branch',
    verify: 'Verify the official record',
    verifyText: 'Access the current company record through the Central Securities Depository e-Company Information Portal.',
    verifyLink: 'View MKK record',
    legal: 'Privacy and legal documents',
  }

  return (
    <main className="profile-page ci-page">
      <CorporateHeader lang={lang} active="records" onLangChange={setLang} />

      <section className="ci-hero">
        <div><h1>{t.title}</h1></div>
        <p>{t.intro}</p>
      </section>

      <section className="ci-content">
        <header className="ci-section-title"><h2>{t.identity}</h2></header>
        <div className="ci-records">
          {records.map(([tr, en, value]) => (
            <article key={tr}>
              <span>{lang === 'tr' ? tr : en}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <header className="ci-section-title"><h2>{t.offices}</h2></header>
        <div className="ci-offices">
          <article><span>{t.head}</span><p>Yıldız Teknik Üniversitesi Teknopark, Çifte Havuzlar Mah., Eski Londra Asfaltı Cad., A1 Blok No: B35, 34220 Esenler / İstanbul</p></article>
          <article><span>{t.branch}</span><p>İkitelli OSB Mah., Metal-İş Sanayi Sitesi, No: 17/10, 34490 Başakşehir / İstanbul</p></article>
        </div>

        <aside className="ci-verify">
          <div><h2>{t.verify}</h2><p>{t.verifyText}</p></div>
          <a href="https://e-sirket.mkk.com.tr/" target="_blank" rel="noreferrer">{t.verifyLink}<span aria-hidden="true">↗</span></a>
        </aside>
      </section>

      <footer className="profile-footer">
        <span>© 2026 BaX Composites Inc.</span>
        <Link href="/kvkk">{t.legal}</Link>
        <Link href="/#home">baxcomposites.com</Link>
      </footer>
    </main>
  )
}
