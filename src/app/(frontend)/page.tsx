import { connection } from 'next/server'

import SiteClient from '@/components/SiteClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export default async function HomePage() {
  // Railway's private Postgres hostname only resolves inside a running service,
  // not in the isolated build environment. Defer the first CMS read to request
  // time; getHomeData still persists the result in Next's tagged data cache.
  await connection()

  const { tr, en } = await getHomeData()
  return <SiteClient locales={{ tr, en }} />
}
