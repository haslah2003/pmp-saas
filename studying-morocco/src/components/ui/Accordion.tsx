import { Plus } from 'lucide-react'

import { splitParagraphs } from '@/lib/utils'

/** Zero-JS accessible accordion built on <details>. */
export function FAQList({ items }: { items: { id: string | number; question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {items.map((item) => (
        <details key={item.id} className="group px-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 min-h-12 py-4 text-start text-body font-semibold text-primary [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-primary transition-transform group-open:rotate-45">
              <Plus className="size-4" aria-hidden="true" />
            </span>
          </summary>
          <div className="space-y-3 pb-5 text-body text-ink">
            {splitParagraphs(item.answer).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}

export const faqLD = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.question,
    acceptedAnswer: { '@type': 'Answer', text: i.answer },
  })),
})
