'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ResearchProjects.module.css'

type Lang = 'tr' | 'en'

const content = {
  en: {
    eyebrow: 'Research & Innovation',
    title: <>Flagship R&amp;D Projects</>,
    intro: 'International research programs connecting circular material science with automotive and aerospace industrialization',
    open: 'Open official source',
    projects: [
      {
        code: 'LOCO3',
        index: '01',
        framework: 'EUROSTARS 3 · CALL 6',
        status: 'Funded',
        title: 'Low CO₂ Composite Components',
        summary: 'An international R&D project advancing recycled thermoplastic composite routes for automotive and aerospace applications',
        details: [
          ['Eurostars ID', '5826'],
          ['National reference', 'TÜBİTAK 9249509 · announced by BaX'],
          ['Material route', 'Recycled thermoplastic composites'],
          ['Applications', 'Automotive · Aerospace'],
        ],
        footer: 'BaX Kompozit AŞ · Saxion / TPAC · SPIRAL RTC',
        href: 'https://www.eurekanetwork.org/wp-content/uploads/2026/01/participants-in-eurostars-3-projects.pdf',
      },
      {
        code: 'MachFlexComp',
        index: '02',
        framework: 'M-ERA.NET · CALL 2022',
        status: '2023–2025 · TRL 3–6',
        title: 'Machining of Flexible Recycled Composite Components',
        summary: 'A six-partner project improving the machining integrity of flexible recycled composites through vibration control, optimised PCD tooling, robotic machining and 3D cutting models',
        details: [
          ['Coordinator', 'Hakkı Kızılok · BaX Composites Inc'],
          ['Project funding', '€693,146'],
          ['Technical route', 'Adaptive fixturing · PCD tools · Robotic machining'],
          ['Applications', 'Electric vehicles · Air mobility · Urban furniture'],
        ],
        footer: 'BaX · Koç University · Zubiola · Aratz · UMONS · Sobelcomp',
        href: 'https://www.m-era.net/materipedia/2022/machflexcomp',
      },
    ],
  },
  tr: {
    eyebrow: 'Araştırma ve İnovasyon',
    title: <>Amiral Gemisi Ar Ge Projeleri</>,
    intro: 'Döngüsel malzeme bilimini otomotiv ve havacılık endüstriyelleştirmesiyle buluşturan uluslararası araştırma programları',
    open: 'Resmî kaynağı aç',
    projects: [
      {
        code: 'LOCO3',
        index: '01',
        framework: 'EUROSTARS 3 · ÇAĞRI 6',
        status: 'Fonlandı',
        title: 'Düşük CO₂ Kompozit Bileşenler',
        summary: 'Otomotiv ve havacılık uygulamaları için geri dönüştürülmüş termoplastik kompozit rotalarını geliştiren uluslararası Ar-Ge projesi',
        details: [
          ['Eurostars kimliği', '5826'],
          ['Ulusal referans', 'TÜBİTAK 9249509 · BaX duyurusu'],
          ['Malzeme rotası', 'Geri dönüştürülmüş termoplastik kompozitler'],
          ['Uygulamalar', 'Otomotiv · Havacılık'],
        ],
        footer: 'BaX Kompozit AŞ · Saxion / TPAC · SPIRAL RTC',
        href: 'https://www.eurekanetwork.org/wp-content/uploads/2026/01/participants-in-eurostars-3-projects.pdf',
      },
      {
        code: 'MachFlexComp',
        index: '02',
        framework: 'M-ERA.NET · ÇAĞRI 2022',
        status: '2023–2025 · TRL 3–6',
        title: 'Esnek Geri Dönüştürülmüş Kompozit Bileşenlerin İşlenmesi',
        summary: 'Titreşim kontrolü, optimize PCD takımlar, robotik işleme ve üç boyutlu kesme modelleriyle esnek geri dönüştürülmüş kompozitlerin işleme bütünlüğünü geliştiren altı ortaklı proje',
        details: [
          ['Koordinatör', 'Hakkı Kızılok · BaX Composites Inc'],
          ['Proje fonu', '693.146 €'],
          ['Teknik rota', 'Uyarlanabilir bağlama · PCD takımlar · Robotik işleme'],
          ['Uygulamalar', 'Elektrikli araçlar · Hava mobilitesi · Kent mobilyaları'],
        ],
        footer: 'BaX · Koç Üniversitesi · Zubiola · Aratz · UMONS · Sobelcomp',
        href: 'https://www.m-era.net/materipedia/2022/machflexcomp',
      },
    ],
  },
}

export function ResearchProjects({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const copy = content[lang]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return <section id="loco3" ref={sectionRef} className={`${styles.section}${visible ? ` ${styles.visible}` : ''}`} aria-labelledby="research-projects-title">
    <div className={styles.ambient} aria-hidden="true"><i /><i /><i /></div>
    <header className={styles.heading}>
      <div><p className={styles.eyebrow}>{copy.eyebrow}</p><h2 id="research-projects-title">{copy.title}</h2></div>
      <p className={styles.intro}>{copy.intro}</p>
    </header>
    <div className={styles.grid}>
      {copy.projects.map((project, projectIndex) => <article className={`${styles.card} ${projectIndex === 0 ? styles.fromLeft : styles.fromRight}`} key={project.code}>
        <div className={styles.cardTop}>
          <span className={styles.index}>{project.index}</span>
          <span className={styles.framework}>{project.framework}</span>
        </div>
        <div className={styles.cardBody}>
          <header><h3>{project.code}</h3><span>{project.status}</span></header>
          <h4>{project.title}</h4>
          <p className={styles.summary}>{project.summary}</p>
          <dl>{project.details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <footer><span>{project.footer}</span><a href={project.href} target="_blank" rel="noreferrer">{copy.open}<i aria-hidden="true">↗</i></a></footer>
        </div>
      </article>)}
    </div>
  </section>
}
