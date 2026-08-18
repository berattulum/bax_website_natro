'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CorporateHeader, type CorporateLang } from './CorporateHeader'
import { PublicFooter } from '@/components/PublicFooter'
import styles from './FounderClient.module.css'

const copy = {
  en: {
    eyebrow: 'FOUNDER AND CHAIRMAN',
    role: 'Engineering leadership in advanced composites',
    intro: 'Hakkı Kızılok founded BaX Composites in Istanbul in 2018 to connect composite design, process development, verification and industrial production within one engineering system',
    focusLabel: 'LEADERSHIP PROFILE',
    focusTitle: 'Aerospace discipline with an international industrial outlook',
    facts: [
      ['Founder of BaX Composites', 'Leads an independent engineering company serving aerospace, mobility and advanced manufacturing programmes'],
      ['Aerospace engineering background', 'Built his technical foundation around composite aerostructures, structural design and production oriented engineering'],
      ['Industrial RTM experience', 'Presented industrial RTM applications for complex aerospace structures as a Chief Design Engineer in 2014'],
      ['MachFlexComp coordinator', 'Coordinated the M ERA NET programme running from November 2023 to November 2025 with partners in Türkiye, Spain and Belgium'],
      ['LOCO3 programme leadership', 'Contributes to the Eurostars programme launched in January 2025 for recycled long carbon fibre thermoplastic components in automotive and aerospace applications'],
      ['SAMPE Türkiye President', 'Leads the SAMPE Türkiye chapter established in March 2026 to strengthen the advanced materials and process engineering community'],
      ['Circular manufacturing direction', 'Connects recovered composite materials, machining knowledge, product design and scalable manufacturing'],
      ['International collaboration', 'Builds programmes with industrial companies, research organisations and universities across European innovation networks'],
    ],
    sources: 'VERIFIED PROGRAMME RECORDS',
    mach: 'MachFlexComp official M ERA NET record',
    loco: 'LOCO3 programme announcement',
    sampe: 'SAMPE Türkiye leadership announcement',
    linkedin: 'Hakkı Kızılok on LinkedIn',
  },
  tr: {
    eyebrow: 'KURUCU VE YÖNETİM KURULU BAŞKANI',
    role: 'İleri kompozitlerde mühendislik liderliği',
    intro: 'Hakkı Kızılok BaX Composites’i kompozit tasarımı proses geliştirme doğrulama ve endüstriyel üretimi tek bir mühendislik sistemi içinde birleştirmek amacıyla 2018 yılında İstanbul’da kurdu',
    focusLabel: 'LİDERLİK PROFİLİ',
    focusTitle: 'Uluslararası endüstri bakışıyla havacılık disiplini',
    facts: [
      ['BaX Composites kurucusu', 'Havacılık mobilite ve ileri üretim programlarına hizmet veren bağımsız bir mühendislik şirketine liderlik ediyor'],
      ['Havacılık mühendisliği geçmişi', 'Teknik temelini kompozit hava aracı yapıları yapısal tasarım ve üretim odaklı mühendislik üzerine kurdu'],
      ['Endüstriyel RTM deneyimi', '2014 yılında Chief Design Engineer olarak karmaşık havacılık yapılarındaki endüstriyel RTM uygulamalarını sundu'],
      ['MachFlexComp koordinatörü', 'Kasım 2023 ile Kasım 2025 arasında Türkiye İspanya ve Belçika’dan ortakları bir araya getiren M ERA NET programını koordine etti'],
      ['LOCO3 program liderliği', 'Ocak 2025’te başlayan geri dönüştürülmüş uzun karbon fiber termoplastik parçaların otomotiv ve havacılık uygulamalarına yönelik Eurostars programına katkı sağlıyor'],
      ['SAMPE Türkiye Başkanı', 'İleri malzemeler ve proses mühendisliği topluluğunu güçlendirmek üzere Mart 2026’da kurulan SAMPE Türkiye yapılanmasına başkanlık ediyor'],
      ['Döngüsel üretim yönü', 'Geri kazanılmış kompozit malzemeleri işleme bilgisini ürün tasarımını ve ölçeklenebilir üretimi bir araya getiriyor'],
      ['Uluslararası iş birlikleri', 'Avrupa inovasyon ağlarında sanayi kuruluşları araştırma kurumları ve üniversitelerle programlar geliştiriyor'],
    ],
    sources: 'DOĞRULANMIŞ PROGRAM KAYITLARI',
    mach: 'MachFlexComp resmî M ERA NET kaydı',
    loco: 'LOCO3 program duyurusu',
    sampe: 'SAMPE Türkiye liderlik duyurusu',
    linkedin: 'Hakkı Kızılok LinkedIn profili',
  },
}

export function FounderClient() {
  const [lang, setLang] = useState<CorporateLang>('en')
  useEffect(() => {
    const saved = localStorage.getItem('bax-language')
    if (saved === 'tr' || saved === 'en') setLang(saved)
  }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const text = copy[lang]

  return <main className={styles.page}>
    <CorporateHeader lang={lang} active="founder" onLangChange={setLang} />
    <div className={styles.introBand} aria-hidden="true" />
    <section className={styles.profileHero}>
      <figure className={styles.portrait}>
        <Image src="/assets/hakki-kizilok.jpeg" alt={lang === 'tr' ? 'BaX Composites kurucusu Hakkı Kızılok' : 'Hakkı Kızılok founder of BaX Composites'} width={400} height={400} priority quality={100} />
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
        <h2 className="founder-airbus-type" id="founder-profile-title">{text.focusTitle}</h2>
      </header>
      <ul>{text.facts.map(([title, body]) => <li className="founder-airbus-type" key={title}><h3 className="founder-airbus-type">{title}</h3><p className="founder-airbus-type">{body}</p></li>)}</ul>
    </section>

    <section className={styles.evidence} aria-label={text.sources}>
      <p className="founder-airbus-type">{text.sources}</p>
      <div>
        <a className="founder-airbus-type" href="https://www.m-era.net/materipedia/2022/machflexcomp" target="_blank" rel="noreferrer"><span className="founder-airbus-type">{text.mach}</span><i>↗</i></a>
        <a className="founder-airbus-type" href="https://www.linkedin.com/posts/bax-composites-inc_recycled-thermoplastic-composite-activity-7290071524789641217-Ws19" target="_blank" rel="noreferrer"><span className="founder-airbus-type">{text.loco}</span><i>↗</i></a>
        <a className="founder-airbus-type" href="https://www.linkedin.com/posts/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0_sampet%C3%BCrkiye-sampe-sampeeurope-activity-7470793752828338177-poc6" target="_blank" rel="noreferrer"><span className="founder-airbus-type">{text.sampe}</span><i>↗</i></a>
        <a className="founder-airbus-type" href="https://www.linkedin.com/in/hakk%C4%B1-k%C4%B1z%C4%B1lok-a98321a0?originalSubdomain=tr" target="_blank" rel="noreferrer"><span className="founder-airbus-type">{text.linkedin}</span><i>↗</i></a>
      </div>
    </section>
    <PublicFooter lang={lang} />
  </main>
}
