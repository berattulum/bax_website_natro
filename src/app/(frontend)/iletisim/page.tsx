import { connection } from 'next/server'
import { ContactPageClient } from '@/components/contact/ContactPageClient'
import { contactPageCopy } from '@/lib/cms/contact-page-defaults'
import { getHomeData } from '@/lib/cms/get-home-data'
import { coalesceManagedContent, getManagedGlobal } from '@/lib/cms/get-managed-pages'

export default async function ContactPage() {
  await connection()
  const [{ tr, en }, page] = await Promise.all([
    getHomeData(),
    getManagedGlobal('contact-page').catch(() => null),
  ])
  return (
    <ContactPageClient
      locales={{ tr, en }}
      content={{
        tr: coalesceManagedContent(page?.contentTr, contactPageCopy.tr),
        en: coalesceManagedContent(page?.contentEn, contactPageCopy.en),
      }}
    />
  )
}
