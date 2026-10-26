'use client'

import { CheckCircle2, Send } from 'lucide-react'
import { useState, useTransition } from 'react'

import { subscribe } from '@/app/(frontend)/actions'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'

import { trackEvent } from '../layout/Tracker'
import { buttonClass } from '@/components/ui/Button'

import { Honeypot, inputClass } from './fields'

export function NewsletterForm({ locale, t }: { locale: Locale; t: Pick<Dictionary, 'newsletter' | 'errors'> }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'done' | string>('idle')
  const [pending, start] = useTransition()

  if (status === 'done')
    return (
      <p className="flex items-center gap-2 rounded-card bg-canvas p-4 font-semibold text-primary" role="status">
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
      <div className="flex flex-col gap-2 md:flex-row">
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
          className={buttonClass('primary', 'md', 'min-h-12')}
        >
          <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          {t.newsletter.submit}
        </button>
      </div>
      {status !== 'idle' && (
        <p className="mt-2 text-small font-semibold text-primary" role="alert">
          {status}
        </p>
      )}
    </form>
  )
}
