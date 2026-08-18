import styles from './TrustBar.module.css'

const organisations = [
  { name: 'TÜBİTAK', label: 'Scientific and Technological Research Council of Türkiye', alt: 'TÜBİTAK — Scientific and Technological Research Council of Türkiye', src: '/logos/tubitak.png' },
  { name: 'Eureka', label: 'Eurostars 3 Innovation Network', alt: 'Eureka Network — Eurostars 3 Innovation Network', src: '/logos/eureka.svg' },
  { name: 'M-ERA.NET', label: 'European Advanced Materials Science Network', alt: 'M-ERA.NET — European Advanced Materials Science Network', src: '/logos/m-era-net-official.jpeg' },
  { name: 'Anadolu Isuzu', label: 'Automotive Industrial Partner', alt: 'Anadolu Isuzu — Automotive Industrial Partner', src: '/logos/anadolu-isuzu.svg' },
  { name: 'TUSAŞ', label: 'Aerospace Ecosystem Reference', alt: 'TUSAŞ — Aerospace Ecosystem Reference', src: '/logos/tusas.png' },
] as const

export function TrustBar() {
  return <section className={styles.bar} aria-labelledby="trust-bar-title">
    <div className={`container ${styles.inner}`}>
      <p id="trust-bar-title" className={styles.title}>Trusted by Global R&amp;D &amp; Funding Networks</p>
      <ul className={styles.organisations}>
        {organisations.map(({ name, label, alt, src }) => <li key={name}>
          <div className={styles.logo}>
            <img src={src} alt={alt} />
          </div>
          <span>{label}</span>
        </li>)}
      </ul>
    </div>
  </section>
}
