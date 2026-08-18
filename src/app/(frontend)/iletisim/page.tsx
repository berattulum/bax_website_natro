import type { Metadata } from 'next'
import { connection } from 'next/server'

import { ContactPageClient } from '@/components/contact/ContactPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const metadata: Metadata = {
  title: 'Contact | BaX Composites',
  description: 'Contact the BaX Composites engineering team for composite design analysis verification and manufacturing programmes',
  alternates: { canonical: '/iletisim' },
}

export default async function ContactPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <ContactPageClient locales={{ tr, en }} />
}
