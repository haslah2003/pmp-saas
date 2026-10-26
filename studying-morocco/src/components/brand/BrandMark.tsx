type BrandMarkProps = {
  size?: number
  primary?: string
  accent?: string
  inner?: string
  className?: string
  title?: string
}

/**
 * Brand mark: an eight-pointed khatam star (a staple of Moroccan zellige)
 * framing a horseshoe arch — the gateway to study in Morocco.
 */
export function BrandMark({
  size = 40,
  primary = 'var(--color-primary, #0F6E5F)',
  accent = 'var(--color-accent, #D4A24C)',
  inner = 'var(--color-canvas, #FBF8F2)',
  className,
  title,
}: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="9" y="9" width="30" height="30" rx="3.5" fill={primary} />
      <rect x="9" y="9" width="30" height="30" rx="3.5" fill={primary} transform="rotate(45 24 24)" />
      <path d="M18.6 36 V27.6 A7 7 0 1 1 29.4 27.6 V36 Z" fill={inner} />
      <g transform="translate(24 23.6)">
        <rect x="-2.6" y="-2.6" width="5.2" height="5.2" fill={accent} />
        <rect x="-2.6" y="-2.6" width="5.2" height="5.2" fill={accent} transform="rotate(45)" />
      </g>
      <rect x="18.6" y="33.6" width="10.8" height="2.4" fill={accent} />
    </svg>
  )
}
