import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

import { StarOrnament } from '@/components/art/Ornaments'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/consultation', title: t.consultation.title, description: t.consultation.intro })
}

export default async function ConsultationPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -end-40 top-0 -z-10 size-[32rem] rounded-full bg-primary-100/70 blur-3xl" aria-hidden="true" />
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="lg:pt-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <StarOrnament className="size-3.5 text-accent" /> {t.nav.consultation}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{t.consultation.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/75">{t.consultation.intro}</p>
          <ul className="mt-8 space-y-4">
            {t.consultation.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[1.02rem]">
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <InquiryForm mode="consultation" locale={locale} t={{ consultation: t.consultation, contact: t.contact, apply: t.apply, common: t.common, errors: t.errors }} />
      </div>
    </div>
  )
}
