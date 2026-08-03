import type { Metadata } from 'next'
import { connection } from 'next/server'

import { ContactPageClient } from '@/components/contact/ContactPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'İletişim | BaX Composites',
  description: 'Kompozit tasarım, analiz, doğrulama ve üretim projeleriniz için BaX Composites mühendislik ekibiyle iletişime geçin.',
  alternates: { canonical: '/iletisim' },
}

export default async function ContactPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <ContactPageClient locales={{ tr, en }} />
}
