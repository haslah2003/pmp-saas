'use client'

import { CheckCircle2, Send } from 'lucide-react'
import { useState, useTransition } from 'react'

import { subscribe } from '@/app/(frontend)/actions'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'

import { trackEvent } from '../layout/Tracker'
import { Honeypot, inputClass } from './fields'

export function NewsletterForm({ locale, t }: { locale: Locale; t: Pick<Dictionary, 'newsletter' | 'errors'> }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'done' | string>('idle')
  const [pending, start] = useTransition()

  if (status === 'done')
    return (
      <p className="flex items-center gap-2 rounded-2xl bg-primary-50 p-4 font-semibold text-primary-800" role="status">
        <CheckCircle2 className="size-5" aria-hidden="true" /> {t.newsletter.success}
      </p>
    )

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault()
        start(async () => {
          const res = await subscribe({ email, locale, source: window.location.pathname, website })
          if (res.ok) {
            trackEvent('newsletter_subscribe')
            setStatus('done')
          } else setStatus(res.error === 'invalid' ? t.errors.emailInvalid : res.error === 'rate' ? t.errors.tooMany : t.errors.generic)
        })
      }}
    >
      <Honeypot value={website} onChange={setWebsite} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.newsletter.placeholder}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletter.placeholder}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          {t.newsletter.submit}
        </button>
      </div>
      {status !== 'idle' && (
        <p className="mt-2 text-sm text-clay-700" role="alert">
          {status}
        </p>
      )}
    </form>
  )
}
