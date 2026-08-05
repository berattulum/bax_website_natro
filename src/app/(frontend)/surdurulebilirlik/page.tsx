import type { Metadata } from 'next'
import { SustainabilityClient } from '@/components/sustainability/SustainabilityClient'

export const metadata: Metadata = {
  title: 'Sürdürülebilirlik | BaX Composites',
  description: 'BaX Composites’in malzeme verimliliği, yaşam döngüsü yaklaşımı ve sorumlu ileri kompozit mühendisliği ilkeleri.',
}

export default function SustainabilityPage() {
  return <SustainabilityClient />
}
