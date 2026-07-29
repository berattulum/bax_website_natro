import type { Metadata } from 'next'
import { CorporateInformationClient } from '@/components/corporate/CorporateInformationClient'

export const metadata: Metadata = {
  title: 'Kurumsal Bilgiler | BaX Composites',
  description: 'BaX Kompozit A.Ş. ticari unvan, MERSİS, vergi, D-U-N-S ve ticaret sicil bilgileri.',
}

export default function CorporateInformationPage() {
  return <CorporateInformationClient />
}
