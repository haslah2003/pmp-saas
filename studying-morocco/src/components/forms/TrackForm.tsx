'use client'

import { CheckCircle2, Circle, Loader2, MessageSquareText, PauseCircle, XCircle } from 'lucide-react'
import { useState, useTransition } from 'react'

import { trackApplication, type TrackResult } from '@/app/(frontend)/actions'
import type { Dictionary } from '@/i18n'
import { formatDate } from '@/lib/format'
import { applicationStatuses, optionLabel, type Locale } from '@/lib/options'
import { cn } from '@/lib/utils'

import { buttonClass } from '@/components/ui/Button'

import { Field, TextInput } from './fields'

export function TrackForm({ locale, t, initialRef }: { locale: Locale; t: Pick<Dictionary, 'track' | 'errors' | 'common'>; initialRef?: string }) {
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <div className="space-y-8">
      <form
        className="grid gap-4 rounded-card border border-line bg-surface p-card lg:grid-cols-[1fr_1fr_auto] lg:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          const f = new FormData(e.currentTarget)
          setError(null)
          start(async () => {
            const res = await trackApplication({ reference: String(f.get('reference') ?? ''), email: String(f.get('email') ?? '') })
            if (res.ok) setResult(res.data)
            else {
              setResult(null)
              setError(res.error === 'rate' ? t.errors.tooMany : res.error === 'generic' ? t.errors.generic : t.track.notFound)
            }
          })
        }}
      >
        <Field id="track-ref" label={t.track.reference} required>
          <TextInput id="track-ref" name="reference" defaultValue={initialRef} placeholder="SIM-26-AB3CD4" dir="ltr" className="uppercase" required />
        </Field>
        <Field id="track-email" label={t.track.email} required>
          <TextInput id="track-email" name="email" type="email" autoComplete="email" dir="ltr" required />
        </Field>
        <button
          type="submit"
          disabled={pending}
          className={buttonClass('primary', 'md', 'min-h-12')}
        >
          {pending && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
          {t.track.submit}
        </button>
        {error && (
          <p className="text-small font-semibold text-primary lg:col-span-3" role="alert">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="rounded-card border border-line bg-surface p-card" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="text-small text-muted">{t.track.currentStatus}</p>
              <p className="mt-1 text-h3 font-semibold text-primary">{optionLabel(applicationStatuses, result.status, locale)}</p>
            </div>
            <div className="text-end text-small">
              <p className="font-semibold" dir="ltr">
                {result.reference}
              </p>
              <p className="text-muted">
                {t.track.submitted}: {formatDate(result.createdAt, locale, 'medium')}
              </p>
            </div>
          </div>
          {result.status === 'on-hold' && (
            <p className="mt-5 flex items-center gap-2 rounded-card bg-canvas p-4 text-small text-primary">
              <PauseCircle className="size-5" aria-hidden="true" /> {t.track.onHold}
            </p>
          )}
          {result.status === 'lost' && (
            <p className="mt-5 flex items-center gap-2 rounded-card bg-canvas p-4 text-small text-primary">
              <XCircle className="size-5" aria-hidden="true" /> {t.track.closed}
            </p>
          )}
          {result.publicMessage && (
            <div className="mt-5 rounded-card bg-canvas p-4">
              <p className="flex items-center gap-2 text-small font-semibold text-primary">
                <MessageSquareText className="size-4" aria-hidden="true" /> {t.track.counselorMessage}
              </p>
              <p className="mt-1.5 text-small whitespace-pre-line text-ink">{result.publicMessage}</p>
            </div>
          )}
          <ol className="mt-6 space-y-0">
            {result.steps.map((step, i) => {
              const reachedAt = result.history.find((h) => h.status === step)?.at
              const currentIndex = result.steps.indexOf(result.status)
              const done = currentIndex >= i || Boolean(reachedAt)
              const current = result.status === step
              return (
                <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < result.steps.length - 1 && (
                    <span className={cn('absolute start-[0.6875rem] top-7 bottom-0 w-0.5', done ? 'bg-primary' : 'bg-line')} aria-hidden="true" />
                  )}
                  {done ? (
                    <CheckCircle2 className={cn('relative size-6 shrink-0 rounded-full', current ? 'bg-cta text-primary' : 'text-primary')} aria-hidden="true" />
                  ) : (
                    <Circle className="relative size-6 shrink-0 text-muted" aria-hidden="true" />
                  )}
                  <div>
                    <p className={cn('font-semibold', done ? 'text-ink' : 'text-muted')}>{optionLabel(applicationStatuses, step, locale)}</p>
                    {reachedAt && <p className="text-small text-muted">{formatDate(reachedAt, locale, 'medium')}</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
