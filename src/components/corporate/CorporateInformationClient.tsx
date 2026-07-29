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
  const [lang, setLang] = useState<CorporateLang>('tr')
  useEffect(() => { const saved = localStorage.getItem('bax-language'); if (saved === 'tr' || saved === 'en') setLang(saved) }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const t = lang === 'tr' ? {
    eyebrow: 'BAX // KURUMSAL ŞEFFAFLIK', title: 'Kurumsal Bilgiler', intro: 'BaX Kompozit A.Ş.’nin ticari kimliği ve doğrulanabilir kurumsal kayıt bilgileri.', identity: 'Ticari kimlik', offices: 'Merkez ve iletişim', head: 'Genel merkez', branch: 'Şube', verify: 'Resmî kaydı doğrulayın', verifyText: 'Güncel şirket kaydını Merkezi Kayıt Kuruluşu e-Şirket Bilgi Portalı üzerinden görüntüleyebilirsiniz.', verifyLink: 'MKK kaydını görüntüle', legal: 'KVKK ve yasal belgeler',
  } : {
    eyebrow: 'BAX // CORPORATE TRANSPARENCY', title: 'Corporate Information', intro: 'The commercial identity and verifiable corporate registration details of BaX Composites Inc.', identity: 'Corporate identity', offices: 'Offices and contact', head: 'Head office', branch: 'Branch office', verify: 'Verify the official record', verifyText: 'View the current company record through the Central Securities Depository e-Company Information Portal.', verifyLink: 'View MKK record', legal: 'Privacy and legal documents',
  }
  return <main className="profile-page corporate-info-page">
    <CorporateHeader lang={lang} active="records" />
    <section className="corporate-info-hero"><span>{t.eyebrow}</span><h1>{t.title}</h1><p>{t.intro}</p></section>
    <section className="corporate-info-content">
      <div className="corporate-info-heading"><span>01</span><h2>{t.identity}</h2></div>
      <div className="corporate-record-grid">{records.map(([tr, en, value]) => <article key={tr}><span>{lang === 'tr' ? tr : en}</span><strong>{value}</strong></article>)}</div>
      <div className="corporate-info-heading"><span>02</span><h2>{t.offices}</h2></div>
      <div className="corporate-office-grid"><article><span>{t.head}</span><p>Yıldız Teknik Üniversitesi Teknopark, Çifte Havuzlar Mah., Eski Londra Asfaltı Cad., A1 Blok No: B35, 34220 Esenler / İstanbul</p></article><article><span>{t.branch}</span><p>İkitelli OSB Mah., Metal-İş Sanayi Sitesi, No: 17/10, 34490 Başakşehir / İstanbul</p></article></div>
      <aside className="corporate-verification"><div><span>03</span><h2>{t.verify}</h2><p>{t.verifyText}</p></div><a href="https://e-sirket.mkk.com.tr/?page=company&company=10566#" target="_blank" rel="noreferrer">{t.verifyLink}<span aria-hidden="true">↗</span></a></aside>
    </section>
    <footer className="profile-footer"><span>© 2026 BaX Composites Inc.</span><Link href="/kvkk">{t.legal}</Link><Link href="/#home">baxcomposites.com</Link></footer>
  </main>
}
