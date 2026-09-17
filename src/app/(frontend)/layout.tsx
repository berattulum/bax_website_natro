import '../globals.css'
import '../typography.css'
import { headers } from 'next/headers'

import { PublicRootLayout, publicMetadata } from '@/components/PublicRootLayout'
import { routeFromPath } from '@/lib/i18n/site-routes'

export async function generateMetadata() {
  const requestHeaders = await headers()
  const publicPath = requestHeaders.get('x-bax-public-path') || '/en'
  const route = routeFromPath(publicPath)?.[1]
  if (!route) return publicMetadata
  return {
    ...publicMetadata,
    alternates: {
      canonical: publicPath,
      languages: { en: route.paths.en, tr: route.paths.tr, 'x-default': route.paths.en },
    },
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PublicRootLayout>{children}</PublicRootLayout>
}
