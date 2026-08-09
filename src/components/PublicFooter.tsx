import Image from 'next/image'
import Link from 'next/link'

type FooterLang = 'tr' | 'en'

export function PublicFooter({ lang = 'en' }: { lang?: FooterLang }) {
  const t = lang === 'tr' ? {
    navigation: 'Navigasyon', contact: 'İletişim', head: 'Genel Merkez', branch: 'Şube',
    about: 'Hakkımızda', expertise: 'Uzmanlık', ecosystem: 'Ekosistem', sustainability: 'Sürdürülebilirlik', contactLink: 'İletişim',
    description: <>İleri kompozit mühendisliği<br />Tasarımdan endüstrileşmeye</>,
    corporate: 'Kurumsal Bilgiler', privacy: 'Aydınlatma Metni', cookies: 'Çerez Politikası', application: 'Başvuru Formu', rights: 'Tüm hakları saklıdır',
  } : {
    navigation: 'Navigation', contact: 'Contact', head: 'Head Office', branch: 'Branch Office',
    about: 'About Us', expertise: 'Expertise', ecosystem: 'Ecosystem', sustainability: 'Sustainability', contactLink: 'Contact',
    description: <>Advanced composite engineering<br />From design to industrialization</>,
    corporate: 'Corporate Information', privacy: 'Privacy Notice', cookies: 'Cookie Policy', application: 'Application Form', rights: 'All rights reserved',
  }

  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <Link href="/#home" className="footer-logo" aria-label="BaX Composites">
          <Image className="brand-logo brand-logo-footer" src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} />
        </Link>
        <p>{t.description}</p>
      </div>
      <div role="navigation" aria-label={t.navigation}>
        <h3>{t.navigation}</h3>
        <Link href="/sirket-profili">{t.about}</Link>
        <Link href="/expertise">{t.expertise}</Link>
        <Link href="/is-ortakliklari">{t.ecosystem}</Link>
        <Link href="/surdurulebilirlik">{t.sustainability}</Link>
        <Link href="/iletisim">{t.contactLink}</Link>
      </div>
      <div><h3>{t.contact}</h3><a href="mailto:info@baxcomposites.com">info@baxcomposites.com</a><a href="tel:+902125650008">+90 (212) 565 00 08</a></div>
      <div className="footer-address"><h3>{t.head}</h3><p>Yıldız Technical University Technopark<br />Çifte Havuzlar District, Eski Londra Asfaltı Avenue<br />A1 Block No: B35, 34220 Esenler / İstanbul</p></div>
      <div className="footer-address"><h3>{t.branch}</h3><p>İkitelli Organized Industrial Zone, Metal-İş Industrial Site<br />No: 17/10, 34490 Başakşehir / İstanbul</p></div>
    </div>
    <div className="container footer-bottom">
      <span>© 2026 BaX Composites Inc</span>
      <nav className="footer-legal" aria-label={t.corporate}><Link href="/kurumsal-bilgiler">{t.corporate}</Link><Link href="/kvkk/aydinlatma-metni">{t.privacy}</Link><Link href="/cerez-politikasi">{t.cookies}</Link><Link href="/kvkk/basvuru">{t.application}</Link></nav>
      <span>{t.rights}</span>
    </div>
  </footer>
}
