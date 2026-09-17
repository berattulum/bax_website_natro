import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { buildRouteMetadata } from '@/lib/seo'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const publicMetadata: Metadata = buildRouteMetadata('/en')

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BaX Composites Inc.',
  url: siteURL,
  logo: new URL('/images/bax-composites-logo-original.png', siteURL).toString(),
  email: 'info@baxcomposites.com',
  telephone: '+90 212 565 00 08',
  foundingDate: '2018',
  sameAs: ['https://baxcomposites.com'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Yıldız Technical University Technopark, A1 Block No: B35',
    addressLocality: 'İstanbul',
    addressCountry: 'TR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+90-212-565-00-08',
    contactType: 'customer service',
    areaServed: ['TR', 'EU'],
    availableLanguage: ['Turkish', 'English'],
  },
}

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BaX Composites',
  url: siteURL,
  inLanguage: ['en', 'tr'],
  publisher: { '@type': 'Organization', name: 'BaX Composites Inc.' },
}

export function PublicRootLayout({ children, locale = 'en' }: { children: React.ReactNode; locale?: 'en' | 'tr' }) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#00205b" />
        <meta name="geo.region" content="TR-34" />
        <meta name="geo.placename" content="Istanbul" />
        <link rel="preload" href="/assets/aircraft-hero-keyframe-v2.png" as="image" type="image/png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData).replace(/</g, '\\u003c') }} />
      </head>
      <body className={montserrat.variable}>{children}</body>
    </html>
  )
}
