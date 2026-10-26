import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

import { InquiryForm } from '@/components/forms/InquiryForm'
import { Eyebrow } from '@/components/ui/Section'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/consultation', title: t.consultation.title, description: t.consultation.intro })
}

export default async function ConsultationPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  return (
    <div className="bg-canvas">
      <div className="container-page grid gap-12 py-section lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>{t.nav.consultation}</Eyebrow>
          <h1 className="mt-3">{t.consultation.title}</h1>
          <p className="mt-4 text-body text-ink">{t.consultation.intro}</p>
          <ul className="mt-8 space-y-4">
            {t.consultation.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-body">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <InquiryForm mode="consultation" locale={locale} t={{ consultation: t.consultation, contact: t.contact, apply: t.apply, common: t.common, errors: t.errors }} />
      </div>
    </div>
  )
}
