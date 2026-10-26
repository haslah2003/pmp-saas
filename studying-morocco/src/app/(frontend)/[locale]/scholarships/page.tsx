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
      <div className="container-page py-section">
        <p className="mb-10 flex items-start gap-3 rounded-card border-s-4 border-cta bg-canvas p-card text-ink">
          <AlertTriangle className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          {t.scholarships.gccNotice}
        </p>
        <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} locale={locale} t={t} />
          ))}
        </div>
        <p className="mt-10 text-small text-muted">{t.common.indicative}</p>
      </div>
    </>
  )
}
