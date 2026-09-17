'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { localeFromPath, type SiteLocale } from './site-routes'

export function useSiteLanguage(defaultLocale: SiteLocale = 'en') {
  const pathname = usePathname()
  const pathLocale = localeFromPath(pathname)
  const [locale, setLocale] = useState<SiteLocale>(pathLocale ?? defaultLocale)

  useEffect(() => {
    const nextLocale = pathLocale ?? (localStorage.getItem('bax-language') as SiteLocale | null)
    if (nextLocale === 'en' || nextLocale === 'tr') setLocale(nextLocale)
  }, [pathLocale])

  useEffect(() => {
    document.documentElement.lang = locale
    localStorage.setItem('bax-language', locale)
    document.cookie = `bax-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
  }, [locale])

  const changeLocale = useCallback((nextLocale: SiteLocale) => {
    setLocale(nextLocale)
  }, [])

  return [locale, changeLocale] as const
}
