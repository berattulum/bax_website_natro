import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'

import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Şirket Profili | BaX Composites',
  description: 'BaX Composites’in ileri kompozit mühendisliği, üretim yaklaşımı ve kurumsal profili.',
}

export default async function CompanyProfilePage() {
  await connection()
  const { tr } = await getHomeData()
  const content = tr.dictionary
  const process = tr.ui.process.steps

  return (
    <main className="profile-page">
      <header className="profile-header">
        <Link href="/#home" className="profile-brand" aria-label="BaX Composites ana sayfa">
          <Image src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} priority />
        </Link>
        <nav aria-label="Kurumsal sayfalar">
          <Link className="is-active" href="/sirket-profili">Şirket Profili</Link>
          <Link href="/kurumsal-bilgiler">Kurumsal Bilgiler</Link>
          <Link href="/#contact">İletişim</Link>
        </nav>
        <Link className="profile-home-link" href="/#home">Ana sayfa <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="profile-hero">
        <Image src="/assets/carbon-futuristic-hero.webp" alt="" fill priority sizes="100vw" />
        <div className="profile-hero-shade" />
        <div className="profile-hero-content">
          <span>BAX // ŞİRKET PROFİLİ</span>
          <h1>Kompozitin geleceğini<br />mühendislikle şekillendiriyoruz.</h1>
          <p>Tasarımdan doğrulamaya, proses geliştirmeden seri üretime uzanan uçtan uca kabiliyet.</p>
        </div>
      </section>

      <section className="profile-intro">
        <div className="profile-intro-index"><span>2018</span><small>İstanbul’da kuruldu</small></div>
        <div className="profile-intro-copy">
          <span className="profile-kicker">BİZ KİMİZ?</span>
          <h2>{content.aboutTitle?.replace(/<br\s*\/?>/gi, ' ')}</h2>
          <p>{content.aboutDescription}</p>
          <p>{content.aboutGoal}</p>
        </div>
      </section>

      <section className="profile-method">
        <div className="profile-method-heading">
          <span className="profile-kicker">ÇALIŞMA MODELİMİZ</span>
          <h2>Fikirden güvenilir<br />üretime.</h2>
        </div>
        <ol>
          {process.map(([title, description], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="profile-closing">
        <div>
          <span className="profile-kicker">KURUMSAL ŞEFFAFLIK</span>
          <h2>Doğrulanabilir bilgiler.<br />Açık iletişim.</h2>
        </div>
        <Link href="/kurumsal-bilgiler">Kurumsal bilgileri inceleyin <span aria-hidden="true">↗</span></Link>
      </section>

      <footer className="profile-footer">
        <span>© 2026 BaX Composites Inc.</span>
        <Link href="/kvkk">KVKK ve yasal belgeler</Link>
        <Link href="/#home">baxcomposites.com</Link>
      </footer>
    </main>
  )
}
