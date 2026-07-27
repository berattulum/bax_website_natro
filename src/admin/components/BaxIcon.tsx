import Image from 'next/image'
import './admin-brand.scss'

export default function BaxIcon() {
  return (
    <div className="bax-admin-icon" aria-label="BaX Composites">
      <Image src="/images/bax-composites-logo-original.png" alt="BaX Composites" width={1526} height={781} />
    </div>
  )
}
