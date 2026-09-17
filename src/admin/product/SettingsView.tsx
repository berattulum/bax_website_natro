import type { AdminViewServerProps } from 'payload'

import ProductShell from './ProductShell'
import { requireProductUser } from './product-auth'

const settings = [
  { index: '01', title: 'Navigasyon', description: 'Header bağlantıları, menü metinleri ve dil seçenekleri.', href: '/admin/globals/site-settings?locale=tr' },
  { index: '02', title: 'İletişim', description: 'Kurumsal iletişim bilgileri, ofisler ve form metinleri.', href: '/admin/globals/site-content?locale=tr' },
  { index: '03', title: 'Footer ve Yasal', description: 'Footer içeriği, yasal bağlantılar ve belge adresleri.', href: '/admin/globals/site-settings?locale=tr' },
  { index: '04', title: 'SEO Varsayılanları', description: 'Site genelinde kullanılan başlık ve açıklama ayarları.', href: '/admin/globals/site-content?locale=tr' },
]

export default function SettingsView({ initPageResult }: AdminViewServerProps) {
  const user = requireProductUser(initPageResult)
  return (
    <ProductShell userEmail={user.email}>
      <main className="bx-screen">
        <header className="bx-screen__heading"><div><span>Site geneli</span><h1>Site Ayarları</h1><p>Sayfa içeriği olmayan, tüm web sitesini etkileyen yapılandırmalar.</p></div></header>
        <section className="bx-settings" aria-label="Ayar kategorileri">
          {settings.map((item) => <a href={item.href} key={item.index}><span>{item.index}</span><div><h2>{item.title}</h2><p>{item.description}</p></div><b aria-hidden="true">→</b></a>)}
        </section>
      </main>
    </ProductShell>
  )
}
