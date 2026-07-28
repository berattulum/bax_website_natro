import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'KVKK ve Yasal Belgeler | BaX Composites',
  description: 'BaX Composites kişisel verilerin korunması, çerez politikası ve başvuru belgeleri.',
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
    <main className="legal-hub">
      <header className="legal-header">
        <Link href="/#home" className="legal-brand" aria-label="BaX Composites ana sayfa">
          <Image src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority />
        </Link>
        <span className="legal-hub-label">Kurumsal bilgi merkezi</span>
        <Link href="/#home" className="legal-home-link">Ana siteye dön <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="legal-hub-hero">
        <span className="legal-eyebrow">ŞEFFAFLIK · GÜVEN · ERİŞİLEBİLİRLİK</span>
        <h1>KVKK ve<br />yasal belgeler</h1>
        <p>Kişisel verilerin korunmasına ilişkin metinlere, çerez politikamıza ve başvuru kanallarına tek noktadan erişin.</p>
      </section>

      <section className="legal-card-grid" aria-label="Yasal belgeler">
        {documents.map((document) => (
          <Link href={document.href} className="legal-card" key={document.href}>
            <span className="legal-card-index">{document.index}</span>
            <div>
              <h2>{document.title}</h2>
              <p>{document.description}</p>
            </div>
            <span className="legal-card-link">{document.label} <b aria-hidden="true">↗</b></span>
          </Link>
        ))}
      </section>

      <div className="legal-preview-note">
        <span>Sunum notu</span>
        <p>Bu sayfalarda mevcut şirket belgeleri sunulmaktadır. Nihai yayın öncesinde içerikler güncel iş süreçleri ve hukuk görüşü doğrultusunda revize edilecektir.</p>
      </div>

      <footer className="legal-footer">
        <span>© 2026 BaX Composites Inc.</span>
        <span>İleri kompozit mühendisliği</span>
        <Link href="/#contact">İletişim</Link>
      </footer>
    </main>
  )
}
