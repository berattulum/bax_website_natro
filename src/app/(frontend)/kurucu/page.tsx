import type { Metadata } from 'next'
import { FounderClient, founderCopy } from '@/components/corporate/FounderClient'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hakkı Kızılok | Founder and Chairman | BaX Composites',
  description: 'Founder and Chairman of BaX Composites with aerospace composites experience and international leadership across MachFlexComp LOCO3 and SAMPE Türkiye',
  openGraph: {
    title: 'Hakkı Kızılok | Founder and Chairman of BaX Composites',
    description: 'Engineering leadership across aerospace composites circular manufacturing and international R&D programmes',
    url: '/kurucu',
    type: 'profile',
    images: ['/assets/hakki-kizilok.jpeg'],
  },
}

export default async function FounderPage() {
  const page = await getManagedGlobal('founder-page')
  return <FounderClient content={{ tr: (page.contentTr || founderCopy.tr) as typeof founderCopy.tr, en: (page.contentEn || founderCopy.en) as typeof founderCopy.en }} />
}
