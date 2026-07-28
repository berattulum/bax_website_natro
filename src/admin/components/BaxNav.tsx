'use client'

import React, { useState } from 'react'

type NavItemProps = {
  copy: string
  href: string
  label: string
  marker: string
}

const NavItem = ({ copy, href, label, marker }: NavItemProps) => (
  <a className="bax-nav__item" href={href} title={label}>
    <span className="bax-nav__marker" aria-hidden="true">
      {marker}
    </span>
    <span className="bax-nav__item-copy">
      <b>{label}</b>
      <small>{copy}</small>
    </span>
    <span className="bax-nav__arrow" aria-hidden="true">
      ›
    </span>
  </a>
)

export default function BaxNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`bax-nav${collapsed ? ' is-collapsed' : ''}`}>
      <div className="bax-nav__brand-row">
        <a className="bax-nav__brand" href="/admin" aria-label="BaX içerik merkezi">
          <img alt="BaX Composites" src="/images/bax-composites-logo-original.png" />
          <span>Content operations</span>
        </a>
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
          className="bax-nav__toggle"
          onClick={() => setCollapsed((value) => !value)}
          type="button"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <div className="bax-nav__scroll">
        <section>
          <h2>Çalışma alanı</h2>
          <NavItem copy="Genel görünüm" href="/admin" label="İçerik merkezi" marker="00" />
          <NavItem
            copy="Yeni sekmede aç"
            href="/"
            label="Canlı web sitesi"
            marker="↗"
          />
        </section>

        <section>
          <h2>Web sitesi</h2>
          <NavItem
            copy="Metinler · düzen · SEO"
            href="/admin/globals/site-content?locale=tr"
            label="Ana sayfa ve kurumsal"
            marker="01"
          />
          <NavItem
            copy="Header · footer · form · butonlar"
            href="/admin/globals/site-settings?locale=tr"
            label="Arayüz ve sistem metinleri"
            marker="02"
          />
          <NavItem
            copy="Yetkinlik kartları"
            href="/admin/collections/expertise-items"
            label="Uzmanlıklar"
            marker="03"
          />
          <NavItem
            copy="Referanslar ve logolar"
            href="/admin/collections/partners"
            label="İş ortakları"
            marker="04"
          />
          <NavItem
            copy="Kurumsal ağlar"
            href="/admin/collections/memberships"
            label="Üyelikler"
            marker="05"
          />
        </section>

        <section>
          <h2>Operasyon</h2>
          <NavItem
            copy="Gelen kutusu ve takip"
            href="/admin/collections/messages"
            label="Proje talepleri"
            marker="06"
          />
          <NavItem
            copy="Görsel · video · belge"
            href="/admin/collections/media"
            label="Medya kütüphanesi"
            marker="07"
          />
        </section>

        <section>
          <h2>Sistem</h2>
          <NavItem
            copy="Erişim yönetimi"
            href="/admin/collections/users"
            label="Kullanıcı ve yetkiler"
            marker="08"
          />
        </section>
      </div>
    </aside>
  )
}
