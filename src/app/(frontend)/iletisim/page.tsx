import { connection } from 'next/server'
import { ContactPageClient } from '@/components/contact/ContactPageClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function ContactPage() {
  await connection()
  const { tr, en } = await getHomeData()
  return <ContactPageClient locales={{ tr, en }} />
}
