'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type ProductShellProps = {
  children: ReactNode
  userEmail?: string
}

const navigation = [
  { href: '/admin', label: 'Genel Bakış', marker: '01' },
  { href: '/admin/pages', label: 'Sayfalar', marker: '02' },
  { href: '/admin/library', label: 'İçerik Kütüphanesi', marker: '03' },
  { href: '/admin/inbox', label: 'Mesajlar', marker: '04' },
  { href: '/admin/assets', label: 'Medya', marker: '05' },
  { href: '/admin/settings', label: 'Site Ayarları', marker: '06' },
  { href: '/admin/team', label: 'Kullanıcılar', marker: '07' },
]

export default function ProductShell({ children, userEmail }: ProductShellProps) {
  const pathname = usePathname()

  return (
    <div className="bx-product">
      <aside className="bx-product__rail">
        <a className="bx-product__brand" href="/admin" aria-label="BaX İçerik Merkezi">
          <Image
            alt="BaX Composites"
            height={781}
            priority
            src="/images/bax-composites-logo-original.png"
            width={1526}
          />
          <span>İçerik Merkezi</span>
        </a>

        <nav className="bx-product__navigation" aria-label="Yönetim menüsü">
          {navigation.map((item) => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            return (
              <a aria-current={active ? 'page' : undefined} href={item.href} key={item.href}>
                <span aria-hidden="true">{item.marker}</span>
                <strong>{item.label}</strong>
              </a>
            )
          })}
        </nav>

        <div className="bx-product__account">
          <span>{userEmail?.slice(0, 1).toUpperCase() || 'B'}</span>
          <div>
            <strong>Yönetici</strong>
            <small>{userEmail || 'BaX Composites'}</small>
          </div>
          <a href="/admin/logout" aria-label="Çıkış yap">↗</a>
        </div>
      </aside>

      <div className="bx-product__workspace">
        <header className="bx-product__topbar">
          <p>BaX Composites / Web sitesi yönetimi</p>
          <a href="/" rel="noreferrer" target="_blank">Canlı site <span aria-hidden="true">↗</span></a>
        </header>
        {children}
      </div>
    </div>
  )
}
