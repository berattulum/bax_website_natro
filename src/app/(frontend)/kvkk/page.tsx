import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PublicFooter } from '@/components/PublicFooter'
import styles from '@/components/institutional/InstitutionalSimple.module.css'

export const metadata: Metadata = {
  title: 'Privacy and Legal Documents | BaX Composites',
  description: 'BaX Composites personal data protection notices cookie policy and data subject application documents.',
  alternates: { canonical: '/kvkk' },
}

const documents = [
  {
    index: '01',
    title: 'Kişisel Verilerin Korunması',
    description: 'Müşteri kişisel verilerinin işlenmesi, aktarılması ve ilgili kişi hakları hakkında aydınlatma.',
    href: '/kvkk/aydinlatma-metni',
    label: 'Aydınlatma metnini incele',
  },
  {
    index: '02',
    title: 'Çerez Politikası',
    description: 'Web sitesi ziyaretleri sırasında kullanılan çerezler ve kullanıcı tercihleri hakkında bilgi.',
    href: '/cerez-politikasi',
    label: 'Çerez politikasını incele',
  },
  {
    index: '03',
    title: 'KVKK Başvuru Formu',
    description: '6698 sayılı Kanun kapsamındaki hakların kullanılması için başvuru yöntemleri ve form.',
    href: '/kvkk/basvuru',
    label: 'Başvuru yöntemlerini incele',
  },
]

export default function KvkkHubPage() {
  return (
    <main className={styles.page}>
      <header className={styles.legalHeader}>
        <Link href="/#home" className={styles.legalBrand} aria-label="BaX Composites ana sayfa">
          <Image src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority />
        </Link>
        <span>Kurumsal bilgi merkezi</span>
        <Link href="/#home" className={styles.homeLink}>Ana siteye dön <span aria-hidden="true">↗</span></Link>
      </header>
      <section className={styles.legalHero}>
        <div><p className={styles.heroLead}>ŞEFFAFLIK · GÜVEN · ERİŞİLEBİLİRLİK</p><h1>KVKK ve<br />yasal belgeler</h1></div>
        <div className={styles.heroIntro}><p>Kişisel verilerin korunmasına ilişkin metinlere, çerez politikamıza ve başvuru kanallarına tek noktadan erişin</p></div>
      </section>

      <section className={styles.documentGrid} aria-label="Yasal belgeler">
        {documents.map((document) => (
          <Link href={document.href} className={styles.documentCard} key={document.href}>
            <span>{document.index}</span>
            <div>
              <h2>{document.title}</h2>
              <p>{document.description}</p>
            </div>
            <span>{document.label} <b aria-hidden="true">↗</b></span>
          </Link>
        ))}
      </section>

      <div className={styles.note}>
        <span>Sunum notu</span>
        <p>Bu sayfalarda mevcut şirket belgeleri sunulmaktadır. Nihai yayın öncesinde içerikler güncel iş süreçleri ve hukuk görüşü doğrultusunda revize edilecektir.</p>
      </div>

      <PublicFooter lang="tr" />
    </main>
  )
}
