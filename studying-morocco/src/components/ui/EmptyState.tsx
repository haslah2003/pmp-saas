import { SearchX } from 'lucide-react'

import { LinkButton } from './Button'

export function EmptyState({ title, text, cta, href }: { title: string; text: string; cta: string; href: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-card">
      <SearchX className="size-8 text-primary" aria-hidden="true" />
      <h2 className="mt-4 text-h4">{title}</h2>
      <p className="mt-2 max-w-xl text-muted">{text}</p>
      <LinkButton href={href} className="mt-6">
        {cta}
      </LinkButton>
    </div>
  )
}
