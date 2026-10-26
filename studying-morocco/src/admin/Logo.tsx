import { BrandMark } from '@/components/brand/BrandMark'

const brand = { primary: '#0F6E5F', accent: '#D4A24C', inner: '#FBF8F2' }

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <BrandMark size={56} {...brand} />
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>Studying in Morocco</div>
        <div style={{ fontSize: 15, opacity: 0.75 }}>الدراسة في المغرب · KNO Academy</div>
      </div>
    </div>
  )
}

export function Icon() {
  return <BrandMark size={28} {...brand} />
}
