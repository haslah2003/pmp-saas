import type { Metadata } from 'next'

import { TrackForm } from '@/components/forms/TrackForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { param, resolveLocale, type LocaleParams, type SearchParams } from '@/lib/page'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/track', title: t.track.title, description: t.track.intro, noIndex: true })
}

export default async function TrackPage({ params, searchParams }: { params: LocaleParams; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params)
  const ref = param((await searchParams).ref)?.slice(0, 20)
  return (
    <>
      <PageHeader title={t.track.title} intro={t.track.intro} />
      <div className="container-page max-w-3xl py-12 lg:py-16">
        <TrackForm locale={locale} t={{ track: t.track, errors: t.errors, common: t.common }} initialRef={ref} />
      </div>
    </>
  )
}
