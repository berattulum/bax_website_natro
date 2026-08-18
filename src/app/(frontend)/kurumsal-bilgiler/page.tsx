import type { Metadata } from 'next'
import { CorporateInformationClient } from '@/components/corporate/CorporateInformationClient'

export const metadata: Metadata = {
  title: 'Corporate Information | BaX Composites',
  description: 'BaX Composites legal entity registration tax D U N S and corporate identification information',
  alternates: { canonical: '/kurumsal-bilgiler' },
}

export default function CorporateInformationPage() {
  return <CorporateInformationClient />
}
