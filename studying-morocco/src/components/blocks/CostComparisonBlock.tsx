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
    <Section tone="sand">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ComparisonChart rows={rows} currency={currency} locale={locale} t={t} />
        <div className="pattern-zellige flex flex-col justify-between rounded-[1.75rem] bg-secondary p-8 text-white [--pattern-opacity:0.08]">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-secondary-900">
              <CalcIcon className="size-6" aria-hidden="true" />
            </span>
            {saving > 0 && (
              <>
                <p className="mt-8 text-sm text-white/70">{t.calculator.saving}</p>
                <p className="mt-1 font-sans text-5xl font-bold tracking-tight text-accent">{formatMoney(Math.round(saving / 100) * 100, currency, locale)}</p>
                <p className="mt-2 text-white/80">
                  {t.calculator.perYearVs} {most!.label}
                </p>
              </>
            )}
          </div>
          <LinkButton href={`/${locale}/cost-calculator`} variant="gold" size="lg" className="mt-10">
            {t.nav.calculator}
            <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        </div>
      </div>
    </Section>
  )
}
