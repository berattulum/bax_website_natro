import '../globals.css'
import '../typography.css'
import { headers } from 'next/headers'

import { PublicRootLayout } from '@/components/PublicRootLayout'
import { localeFromPath } from '@/lib/i18n/site-routes'
import { buildRouteMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const requestHeaders = await headers()
  const publicPath = requestHeaders.get('x-bax-public-path') || '/en'
  return buildRouteMetadata(publicPath)
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers()
  const publicPath = requestHeaders.get('x-bax-public-path') || '/en'
  const locale = localeFromPath(publicPath) || 'en'
  return <PublicRootLayout locale={locale}>{children}</PublicRootLayout>
}
