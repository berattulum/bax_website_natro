'use client'

import Link from 'next/link'

export default function DraftModeControls() {
  return (
    <aside className="draft-mode-banner" role="status" aria-label="Taslak önizleme modu">
      <span className="draft-mode-dot" aria-hidden="true" />
      <span>
        <strong>Önizleme modu</strong>
        <small>Taslak içerikleri görüyorsunuz</small>
      </span>
      <Link href="/api/disable-draft?redirect=/" prefetch={false}>
        Önizlemeden çık
      </Link>
    </aside>
  )
}
