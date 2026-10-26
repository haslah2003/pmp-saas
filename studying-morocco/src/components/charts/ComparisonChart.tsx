import type { Dictionary } from '@/i18n'
import type { ComparisonRow } from '@/lib/comparison'
import { formatMoney } from '@/lib/format'
import type { Locale } from '@/lib/options'
import { cn } from '@/lib/utils'

/** Horizontal bar chart: one series (total per year), Morocco emphasised, others neutral. */
export function ComparisonChart({ rows, currency, locale, t }: { rows: ComparisonRow[]; currency: string; locale: Locale; t: Pick<Dictionary, 'calculator' | 'common'> }) {
  const max = Math.max(...rows.map((r) => r.total), 1)
  const money = (v: number) => formatMoney(Math.round(v / 100) * 100, currency, locale)
  return (
    <figure className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-8">
      <figcaption className="mb-6 text-sm font-semibold text-ink">{t.calculator.compareTitle}</figcaption>
      <ul className="space-y-5" aria-hidden="true">
        {rows.map((row) => (
          <li key={row.key} className="group relative" tabIndex={0}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className={cn('font-medium', row.highlight ? 'text-ink' : 'text-ink/75')}>{row.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 flex-1">
                <div
                  className={cn('h-full rounded-e-[4px] transition-[width] duration-700', row.highlight ? 'bg-primary' : 'bg-ink/20 group-hover:bg-ink/30')}
                  style={{ width: `${Math.max(2, (row.total / max) * 100)}%` }}
                />
              </div>
              <span className={cn('w-28 shrink-0 text-end text-sm tabular-nums', row.highlight ? 'font-bold text-ink' : 'text-ink/75')}>{money(row.total)}</span>
            </div>
            <div className="pointer-events-none absolute start-0 -top-2 z-10 hidden -translate-y-full rounded-xl bg-secondary px-3 py-2 text-xs text-white shadow-lift group-hover:block group-focus:block">
              <p className="font-semibold">{row.label}</p>
              <p className="mt-0.5 text-white/75">
                {t.common.tuition}: {money(row.tuition)} · {t.calculator.living}: {money(row.living)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="sr-only">
      <table>
        <caption>{t.calculator.compareTitle}</caption>
        <thead>
          <tr>
            <th scope="col">{t.common.city}</th>
            <th scope="col">{t.common.tuition}</th>
            <th scope="col">{t.calculator.living}</th>
            <th scope="col">{t.calculator.yearlyTotal}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">{row.label}</th>
              <td>{money(row.tuition)}</td>
              <td>{money(row.living)}</td>
              <td>{money(row.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted">{t.calculator.disclaimer}</p>
    </figure>
  )
}
