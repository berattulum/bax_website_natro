import { NextRequest, NextResponse } from 'next/server'

import { localeFromPath, routeFromPath, type SiteLocale } from '@/lib/i18n/site-routes'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathLocale = localeFromPath(pathname)

  if (pathLocale) {
    const route = routeFromPath(pathname)
    if (!route) return NextResponse.next()
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-bax-public-path', pathname)
    const destination = request.nextUrl.clone()
    destination.pathname = route[1].legacy
    const response = NextResponse.rewrite(destination, { request: { headers: requestHeaders } })
    response.cookies.set('bax-locale', pathLocale, { maxAge: 31_536_000, sameSite: 'lax' })
    return response
  }

  const route = routeFromPath(pathname)
  if (!route) return NextResponse.next()

  const savedLocale = request.cookies.get('bax-locale')?.value
  const locale: SiteLocale = savedLocale === 'tr' ? 'tr' : 'en'
  return NextResponse.redirect(new URL(route[1].paths[locale], request.url), 308)
}

export const config = {
  matcher: ['/((?!studio|admin|api|_next|assets|images|logos|favicon.ico|robots.txt|sitemap.xml).*)'],
}
