import { AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

import { ScholarshipCard } from '@/components/cards/ScholarshipCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getScholarships } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/scholarships', title: t.scholarships.title, description: t.scholarships.intro })
}

export default async function ScholarshipsPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const scholarships = await getScholarships(locale)
  return (
    <>
      <PageHeader
        title={t.scholarships.title}
        intro={t.scholarships.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.scholarships, href: `/${locale}/scholarships` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page py-14 lg:py-20">
        <p className="mb-10 flex items-start gap-3 rounded-[var(--radius-card)] border border-accent-100 bg-accent-50 p-5 text-[0.95rem] leading-relaxed text-ink/85">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-accent-700" aria-hidden="true" />
          {t.scholarships.gccNotice}
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} locale={locale} t={t} />
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">{t.common.indicative}</p>
      </div>
    </>
  )
}
