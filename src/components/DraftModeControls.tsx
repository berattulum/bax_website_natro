'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

export default function DraftModeControls() {
  const router = useRouter()
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const serverURL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
  const refreshPreview = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    // Payload autosaves after 800 ms. Refresh just afterwards so the Server
    // Component reads the latest draft instead of the previous database state.
    refreshTimer.current = setTimeout(() => router.refresh(), 1_050)
  }, [router])

  useEffect(
    () => () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
    },
    [],
  )

  return (
    <>
      <RefreshRouteOnSave
        refresh={refreshPreview}
        serverURL={serverURL.replace(/\/$/, '')}
      />
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
    </>
  )
}
