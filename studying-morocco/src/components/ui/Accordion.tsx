import { Plus } from 'lucide-react'

import { splitParagraphs } from '@/lib/utils'

/** Zero-JS accessible accordion built on <details>. */
export function FAQList({ items }: { items: { id: string | number; question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-soft">
      {items.map((item) => (
        <details key={item.id} className="group px-6 py-1 open:bg-primary-50/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-start text-[1.05rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary transition group-open:rotate-45 group-open:bg-primary group-open:text-white">
              <Plus className="size-4" aria-hidden="true" />
            </span>
          </summary>
          <div className="space-y-3 pb-5 text-[0.98rem] leading-relaxed text-ink/80">
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
