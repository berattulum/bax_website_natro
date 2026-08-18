import type { Metadata } from 'next'
import { SustainabilityClient } from '@/components/sustainability/SustainabilityClient'

export const metadata: Metadata = {
  title: 'Sustainability | BaX Composites',
  description: 'Circular composite engineering recovered carbon fibre design material improvement and responsible manufacturing at BaX Composites',
  alternates: { canonical: '/surdurulebilirlik' },
}

export default function SustainabilityPage() {
  return <SustainabilityClient />
}
