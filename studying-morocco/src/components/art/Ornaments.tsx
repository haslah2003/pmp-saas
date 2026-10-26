import { cn } from '@/lib/utils'

/** Eight-pointed khatam star. */
export function StarOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="1.2" />
      <rect x="5" y="5" width="14" height="14" rx="1.2" transform="rotate(45 12 12)" />
    </svg>
  )
}

/** Thin decorative divider with a central star, used between sections and in cards. */
export function StarDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-accent', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-60 rtl:bg-gradient-to-l" />
      <StarOrnament className="size-3" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-60 rtl:bg-gradient-to-r" />
    </div>
  )
}
