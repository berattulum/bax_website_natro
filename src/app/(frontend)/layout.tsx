import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '../globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BaX Composites | Geleceği Şekillendiriyoruz',
  description:
    'Havacılık ve otomotiv için ileri kompozit mühendisliği, analiz, kalifikasyon ve endüstrileştirme çözümleri.',
  icons: {
    icon: '/images/bax-composites-logo-original.png',
    apple: '/images/bax-composites-logo-original.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/assets/aircraft-hero-poster.webp" as="image" type="image/webp" />
      </head>
      <body className={montserrat.variable}>{children}</body>
    </html>
  )
}
