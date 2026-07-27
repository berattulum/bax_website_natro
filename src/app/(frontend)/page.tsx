import SiteClient from '@/components/SiteClient'
import { getHomeData } from '@/lib/cms/get-home-data'

export const revalidate = 86_400

export default async function HomePage() {
  const { tr, en } = await getHomeData()
  return <SiteClient locales={{ tr, en }} />
}
