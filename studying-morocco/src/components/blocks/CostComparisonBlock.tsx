import { ArrowRight, Calculator as CalcIcon } from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ComparisonChart } from '@/components/charts/ComparisonChart'
import { buildComparison, defaultDisplayCurrency } from '@/lib/comparison'
import { formatMoney } from '@/lib/format'
import { getCalculator, getCities } from '@/lib/queries'

import type { BlockProps } from './types'

export async function CostComparisonBlock({ block, locale, t }: BlockProps<'costComparison'>) {
  const [calc, cities] = await Promise.all([getCalculator(locale), getCities(locale, 1)])
  const city = cities[0] ?? {}
  const currency = defaultDisplayCurrency(locale)
  const rows = buildComparison({
    calc,
    city,
    currency,
    labels: {
      moroccoPublic: `${locale === 'ar' ? 'المغرب — جامعة عمومية' : 'Morocco — public university'}`,
      moroccoPrivate: `${locale === 'ar' ? 'المغرب — جامعة خاصة' : 'Morocco — private university'}`,
    },
  })
  const morocco = rows.find((r) => r.highlight)
  const most = rows[0]
  const saving = morocco && most && most !== morocco ? most.total - morocco.total : 0

  return (
    <Section tone="canvas">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-grid lg:grid-cols-[1.5fr_1fr]">
        <ComparisonChart rows={rows} currency={currency} locale={locale} t={t} />
        <div className="on-dark flex flex-col justify-between rounded-card bg-primary p-card text-white">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-control bg-cta text-primary">
              <CalcIcon className="size-6" aria-hidden="true" />
            </span>
            {saving > 0 && (
              <>
                <p className="mt-8 text-small text-line">{t.calculator.saving}</p>
                <p className="mt-1 text-h1 font-semibold text-cta">{formatMoney(Math.round(saving / 100) * 100, currency, locale)}</p>
                <p className="mt-2 text-line">
                  {t.calculator.perYearVs} {most!.label}
                </p>
              </>
            )}
          </div>
          <LinkButton href={`/${locale}/cost-calculator`} size="lg" className="mt-10">
            {t.nav.calculator}
            <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        </div>
      </div>
    </Section>
  )
}
