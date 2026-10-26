import { cn, initials } from '@/lib/utils'

/** Monogram crest used until an editor uploads the university's official logo. */
export function UniversityCrest({
  name,
  shortName,
  color,
  className,
}: {
  name: string
  shortName?: string | null
  color?: string | null
  className?: string
}) {
  const label = (shortName || initials(name) || name.slice(0, 2)).slice(0, 5)
  return (
    <span
      className={cn('relative inline-flex aspect-square items-center justify-center overflow-hidden rounded-2xl text-white', className)}
      style={{ backgroundColor: color || 'var(--color-primary)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full opacity-25">
        <g fill="none" stroke="white" strokeWidth="1.2">
          <rect x="11" y="11" width="26" height="26" />
          <rect x="11" y="11" width="26" height="26" transform="rotate(45 24 24)" />
        </g>
      </svg>
      <span
        className={cn('relative font-bold tracking-tight', label.length > 3 ? 'text-[0.7em]' : 'text-[0.95em]')}
        dir="ltr"
      >
        {label}
      </span>
    </span>
  )
}
