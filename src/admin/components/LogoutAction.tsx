'use client'

import React from 'react'

export default function LogoutAction() {
  return (
    <a className="bax-admin-action bax-logout-action" href="/admin/logout">
      Güvenli çıkış <span aria-hidden="true">→</span>
    </a>
  )
}
