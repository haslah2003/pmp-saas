import type { Metadata } from 'next'

import { CostCalculator } from '@/components/forms/CostCalculator'
import { PageHeader } from '@/components/ui/PageHeader'
import { defaultDisplayCurrency } from '@/lib/comparison'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getCalculator, getCities } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/cost-calculator', title: t.calculator.title, description: t.calculator.intro })
}

export default async function CalculatorPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const [calc, cities] = await Promise.all([getCalculator(locale), getCities(locale)])
  return (
    <>
      <PageHeader
        title={t.calculator.title}
        intro={t.calculator.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.calculator, href: `/${locale}/cost-calculator` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page py-14 lg:py-20">
        <CostCalculator
          locale={locale}
          t={{ calculator: t.calculator, common: t.common, nav: t.nav }}
          defaultCurrency={defaultDisplayCurrency(locale)}
          calc={calc ? { rates: calc.rates, tuition: calc.tuition, benchmarks: calc.benchmarks, ratesUpdated: calc.ratesUpdated, disclaimer: calc.disclaimer } : null}
          cities={cities.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            rentResidence: c.rentResidence,
            rentShared: c.rentShared,
            rentStudio: c.rentStudio,
            homestay: c.homestay,
            food: c.food,
            transport: c.transport,
            utilities: c.utilities,
            leisure: c.leisure,
          }))}
        />
      </div>
    </>
  )
}
