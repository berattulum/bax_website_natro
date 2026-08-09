import type { Metadata } from 'next'
import { SustainabilityClient } from '@/components/sustainability/SustainabilityClient'

export const metadata: Metadata = {
  title: 'Sürdürülebilirlik | BaX Composites',
  description: 'BaX Composites döngüsel kompozit mühendisliği, geri dönüştürülmüş karbon fiber tasarımı, malzeme iyileştirme ve üretim yaklaşımı.',
}

export default function SustainabilityPage() {
  return <SustainabilityClient />
}
