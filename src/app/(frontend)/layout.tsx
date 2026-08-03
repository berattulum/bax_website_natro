import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '../globals.css'
import '../contact-navigation.css'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: 'BaX Composites | Geleceği Şekillendiriyoruz',
  description:
    'Havacılık ve otomotiv için ileri kompozit mühendisliği, analiz, kalifikasyon ve endüstrileştirme çözümleri.',
  icons: {
    icon: '/images/bax-composites-logo-original.png',
    apple: '/images/bax-composites-logo-original.png',
  },
  applicationName: 'BaX Composites',
  authors: [{ name: 'BaX Composites', url: siteURL }],
  creator: 'BaX Composites',
  publisher: 'BaX Composites',
  formatDetection: { email: false, address: false, telephone: false },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BaX Composites Inc.',
    url: siteURL,
    logo: new URL('/images/bax-composites-logo-original.png', siteURL).toString(),
    email: 'info@baxcomposites.com',
    telephone: '+90 212 565 00 08',
    foundingDate: '2018',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/aircraft-hero-keyframe-v2.png" as="image" type="image/png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, '\\u003c') }} />
      </head>
      <body className={montserrat.variable}>{children}</body>
    </html>
  )
}
