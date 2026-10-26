import { SearchX } from 'lucide-react'

import { LinkButton } from './Button'

export function EmptyState({ title, text, cta, href }: { title: string; text: string; cta: string; href: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-12 text-center">
      <SearchX className="mx-auto size-10 text-muted" aria-hidden="true" />
      <p className="mt-4 text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-ink/70">{text}</p>
      <LinkButton href={href} className="mt-6">
        {cta}
      </LinkButton>
    </div>
  )
}
