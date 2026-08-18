import type { Metadata } from 'next'
import { FounderClient } from '@/components/corporate/FounderClient'

export const metadata: Metadata = {
  title: 'Hakkı Kızılok | Founder and Chairman | BaX Composites',
  description: 'Founder and Chairman of BaX Composites with aerospace composites experience and international leadership across MachFlexComp LOCO3 and SAMPE Türkiye',
  alternates: { canonical: '/kurucu' },
  openGraph: {
    title: 'Hakkı Kızılok | Founder and Chairman of BaX Composites',
    description: 'Engineering leadership across aerospace composites circular manufacturing and international R&D programmes',
    url: '/kurucu',
    type: 'profile',
    images: ['/assets/hakki-kizilok.jpeg'],
  },
}

export default function FounderPage() {
  return <FounderClient />
}
