import { connection } from 'next/server'
import { draftMode } from 'next/headers'
import { ContactPageClient } from '@/components/contact/ContactPageClient'
import { contactPageCopy } from '@/lib/cms/contact-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function ContactPage() {
  await connection()
  const { isEnabled: isDraftMode } = await draftMode()
  const { tr, en } = await getHomeData({ includeDrafts: isDraftMode })
  return <ContactPageClient locales={{ tr, en }} content={contactPageCopy} />
}
