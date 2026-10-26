import { ArrowRight } from 'lucide-react'

import { UniversityCard } from '@/components/cards/UniversityCard'
import { LinkButton } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getUniversities } from '@/lib/queries'

import type { BlockProps } from './types'

export async function UniversitiesBlock({ block, locale, t }: BlockProps<'universitiesShowcase'>) {
  const ids = (block.universities ?? []).map((u) => (typeof u === 'object' ? u.id : u))
  const universities = await getUniversities(locale, ids.length ? { ids, limit: block.limit ?? 6 } : { featured: true, limit: block.limit ?? 6 })
  if (!universities.length) return null
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={block.eyebrow}
        title={block.heading}
        intro={block.intro}
        action={
          <LinkButton href={`/${locale}/universities`} variant="secondary">
            {t.common.viewAll}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        }
      />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {universities.map((u) => (
          <UniversityCard key={u.id} university={u} locale={locale} t={t} />
        ))}
      </div>
    </Section>
  )
}
