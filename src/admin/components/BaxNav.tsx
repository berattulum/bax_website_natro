'use client'

import { usePathname } from 'next/navigation'

type NavItem = {
  href: string
  label: string
  detail: string
  match?: string
  external?: boolean
}

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Çalışma alanı',
    items: [
      { href: '/admin', label: 'İçerik merkezi', detail: 'Genel görünüm', match: '/admin' },
      { href: '/', label: 'Canlı web sitesi', detail: 'Yeni sekmede aç', external: true },
    ],
  },
  {
    label: 'Web sitesi',
    items: [
      {
        href: '/admin/globals/site-content',
        label: 'Ana sayfa ve kurumsal',
        detail: 'Metinler · düzen · SEO',
        match: '/admin/globals/site-content',
      },
      {
        href: '/admin/collections/expertise-items',
        label: 'Uzmanlıklar',
        detail: 'Yetkinlik kartları',
        match: '/admin/collections/expertise-items',
      },
      {
        href: '/admin/collections/partners',
        label: 'İş ortakları',
        detail: 'Referanslar ve logolar',
        match: '/admin/collections/partners',
      },
      {
        href: '/admin/collections/memberships',
        label: 'Üyelikler',
        detail: 'Kurumsal ağlar',
        match: '/admin/collections/memberships',
      },
    ],
  },
  {
    label: 'Operasyon',
    items: [
      {
        href: '/admin/collections/messages',
        label: 'Proje talepleri',
        detail: 'Gelen kutusu ve takip',
        match: '/admin/collections/messages',
      },
      {
        href: '/admin/collections/media',
        label: 'Medya kütüphanesi',
        detail: 'Görsel · video · belge',
        match: '/admin/collections/media',
      },
    ],
  },
  {
    label: 'Sistem',
    items: [
      {
        href: '/admin/collections/users',
        label: 'Kullanıcı ve yetkiler',
        detail: 'Erişim yönetimi',
        match: '/admin/collections/users',
      },
    ],
  },
]

export default function BaxNav() {
  const pathname = usePathname()

  return (
    <aside className="bax-nav">
      <a className="bax-nav__brand" href="/admin" aria-label="BaX içerik merkezi">
        <img src="/brand/bax-composites-original.svg" alt="BaX Composites" />
        <span>CONTENT OPERATIONS</span>
      </a>

      <nav aria-label="Yönetim paneli">
        {groups.map((group) => (
          <section key={group.label}>
            <h2>{group.label}</h2>
            {group.items.map((item) => {
              const active =
                item.match === '/admin'
                  ? pathname === '/admin' || pathname === '/admin/'
                  : Boolean(item.match && pathname.startsWith(item.match))

              return (
                <a
                  className={active ? 'is-active' : undefined}
                  href={item.href}
                  key={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                >
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <b aria-hidden="true">{item.external ? '↗' : '›'}</b>
                </a>
              )
            })}
          </section>
        ))}
      </nav>

      <a className="bax-nav__logout" href="/admin/logout">
        Güvenli çıkış <span aria-hidden="true">→</span>
      </a>
    </aside>
  )
}
