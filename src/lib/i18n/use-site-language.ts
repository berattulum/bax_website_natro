'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { localeFromPath, type SiteLocale } from './site-routes'

function readStoredLocale(): SiteLocale | null {
  try {
    const stored = localStorage.getItem('bax-language')
    return stored === 'en' || stored === 'tr' ? stored : null
  } catch {
    return null
  }
}

export function useSiteLanguage(defaultLocale: SiteLocale = 'en') {
  const pathname = usePathname()
  const pathLocale = localeFromPath(pathname)
  const [locale, setLocale] = useState<SiteLocale>(pathLocale ?? defaultLocale)
  const [ready, setReady] = useState(Boolean(pathLocale))

  useEffect(() => {
    const nextLocale = pathLocale ?? readStoredLocale() ?? defaultLocale
    setLocale(nextLocale)
    setReady(true)
  }, [pathLocale, defaultLocale])

  useEffect(() => {
    if (!ready) return
    // Prefer URL locale when present so soft-nav to unprefixed paths cannot stamp `en`.
    const resolved = pathLocale ?? locale
    document.documentElement.lang = resolved
    localStorage.setItem('bax-language', resolved)
    document.cookie = `bax-locale=${resolved}; Path=/; Max-Age=31536000; SameSite=Lax`
    if (pathLocale && pathLocale !== locale) setLocale(pathLocale)
  }, [locale, pathLocale, ready])

  const changeLocale = useCallback((nextLocale: SiteLocale) => {
    setLocale(nextLocale)
  }, [])

  return [locale, changeLocale] as const
}
