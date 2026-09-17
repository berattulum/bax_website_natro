import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const publicMetadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: 'BaX Composites | Advanced Composite Engineering',
  description: 'Advanced composite engineering design verification and industrialization solutions for aerospace mobility and sustainable manufacturing',
  icons: { icon: '/images/bax-composites-logo-original.png', apple: '/images/bax-composites-logo-original.png' },
  applicationName: 'BaX Composites',
  authors: [{ name: 'BaX Composites', url: siteURL }],
  creator: 'BaX Composites',
  publisher: 'BaX Composites',
  formatDetection: { email: false, address: false, telephone: false },
}

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BaX Composites Inc.',
  url: siteURL,
  logo: new URL('/images/bax-composites-logo-original.png', siteURL).toString(),
  email: 'info@baxcomposites.com',
  telephone: '+90 212 565 00 08',
  foundingDate: '2018',
  address: { '@type': 'PostalAddress', addressLocality: 'İstanbul', addressCountry: 'TR' },
}

export function PublicRootLayout({ children, locale = 'en' }: { children: React.ReactNode; locale?: 'en' | 'tr' }) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/aircraft-hero-keyframe-v2.png" as="image" type="image/png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, '\\u003c') }} />
      </head>
      <body className={montserrat.variable}>{children}</body>
    </html>
  )
}
