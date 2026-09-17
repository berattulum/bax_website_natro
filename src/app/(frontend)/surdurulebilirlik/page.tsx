import type { Metadata } from 'next'
import { SustainabilityClient, sustainabilityCopy } from '@/components/sustainability/SustainabilityClient'
import { getManagedGlobal } from '@/lib/cms/get-managed-pages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sustainability | BaX Composites',
  description: 'Circular composite engineering recovered carbon fibre design material improvement and responsible manufacturing at BaX Composites',
}

export default async function SustainabilityPage() {
  const page = await getManagedGlobal('sustainability-page')
  return <SustainabilityClient content={{ tr: (page.contentTr || sustainabilityCopy.tr) as typeof sustainabilityCopy.tr, en: (page.contentEn || sustainabilityCopy.en) as typeof sustainabilityCopy.en }} />
}
