'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'

import { submitInquiry, type InquiryInput } from '@/app/(frontend)/actions'
import type { Dictionary } from '@/i18n'
import { contactChannels, countries, timeSlots, type Locale } from '@/lib/options'

import { trackEvent } from '../layout/Tracker'
import { buttonClass } from '@/components/ui/Button'

import { ChoiceCards, Field, Honeypot, Select, TextArea, TextInput } from './fields'

type Mode = 'consultation' | 'contact'

export function InquiryForm({
  mode,
  locale,
  t,
}: {
  mode: Mode
  locale: Locale
  t: Pick<Dictionary, 'consultation' | 'contact' | 'apply' | 'common' | 'errors'>
}) {
  const startedAt = useRef(Date.now())
  const [website, setWebsite] = useState('')
  const [pending, start] = useTransition()
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [channel, setChannel] = useState<'whatsapp' | 'phone' | 'video' | 'email'>('whatsapp')
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  if (done) {
    const copy = mode === 'consultation' ? t.consultation : t.contact
    return (
      <div className="rounded-card border border-line bg-surface p-card" role="status">
        <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
        <h2 className="mt-5">{copy.successTitle}</h2>
        <p className="mt-2 text-ink">{copy.successText}</p>
      </div>
    )
  }

  return (
    <form
      noValidate
      className="relative space-y-5 rounded-card border border-line bg-surface p-card"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const get = (k: string) => String(f.get(k) ?? '').trim()
        const local: Record<string, string> = {}
        if (get('name').length < 2) local.name = t.errors.nameRequired
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get('email'))) local.email = t.errors.emailInvalid
        if (mode === 'consultation' && channel !== 'email' && !/^\+?[\d\s().-]{7,}$/.test(get('phone'))) local.phone = t.errors.phoneInvalid
        setErrors(local)
        if (Object.keys(local).length) return
        const input: InquiryInput = {
          website,
          startedAt: startedAt.current,
          type: mode === 'consultation' ? 'consultation' : 'contact',
          name: get('name'),
          email: get('email'),
          phone: get('phone'),
          country: (get('country') || undefined) as InquiryInput['country'],
          preferredChannel: mode === 'consultation' ? channel : undefined,
          preferredDate: get('date'),
          preferredTime: (get('time') || undefined) as InquiryInput['preferredTime'],
          subject: get('subject'),
          message: get('message'),
          locale,
          sourcePage: window.location.pathname,
        }
        setFormError(null)
        start(async () => {
          const res = await submitInquiry(input)
          if (res.ok) {
            trackEvent(mode === 'consultation' ? 'consultation_booked' : 'contact_sent')
            setDone(true)
          } else if (res.error === 'invalid') {
            setErrors(res.fields ?? {})
            setFormError(t.errors.invalid)
          } else setFormError(res.error === 'rate' ? t.errors.tooMany : t.errors.generic)
        })
      }}
    >
      <Honeypot value={website} onChange={setWebsite} />
      {mode === 'consultation' && (
        <div>
          <p className="mb-3 text-small font-semibold text-ink">{t.consultation.channel}</p>
          <ChoiceCards
            name="channel"
            value={channel}
            onChange={setChannel}
            options={contactChannels.filter((c) => c.value !== 'email').map((c) => ({ value: c.value, label: c.label[locale] }))}
          />
        </div>
      )}
      <div className="grid gap-grid md:grid-cols-2">
        <Field id="inq-name" label={mode === 'consultation' ? t.consultation.name : t.apply.fullName} required error={errors.name}>
          <TextInput id="inq-name" name="name" autoComplete="name" invalid={!!errors.name} />
        </Field>
        <Field id="inq-email" label={t.apply.email} required error={errors.email}>
          <TextInput id="inq-email" name="email" type="email" autoComplete="email" dir="ltr" invalid={!!errors.email} />
        </Field>
        <Field id="inq-phone" label={t.apply.phone} required={mode === 'consultation'} optionalLabel={t.common.optional} error={errors.phone}>
          <TextInput id="inq-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" invalid={!!errors.phone} />
        </Field>
        <Field id="inq-country" label={t.consultation.country} optionalLabel={t.common.optional}>
          <Select id="inq-country" name="country" options={countries.map((c) => ({ value: c.value, label: c.label[locale] }))} placeholder={t.apply.selectPlaceholder} />
        </Field>
        {mode === 'consultation' ? (
          <>
            <Field id="inq-date" label={t.consultation.date} optionalLabel={t.common.optional}>
              <TextInput id="inq-date" name="date" type="date" min={minDate} />
            </Field>
            <Field id="inq-time" label={t.consultation.time} optionalLabel={t.common.optional}>
              <Select id="inq-time" name="time" options={timeSlots.map((s) => ({ value: s.value, label: s.label[locale] }))} placeholder={t.apply.selectPlaceholder} />
            </Field>
          </>
        ) : (
          <Field id="inq-subject" label={t.contact.subject} optionalLabel={t.common.optional} className="md:col-span-2">
            <TextInput id="inq-subject" name="subject" />
          </Field>
        )}
        <Field id="inq-message" label={mode === 'consultation' ? t.consultation.message : t.contact.message} optionalLabel={mode === 'consultation' ? t.common.optional : undefined} className="md:col-span-2">
          <TextArea id="inq-message" name="message" rows={5} />
        </Field>
      </div>
      {formError && (
        <p className="rounded-card bg-canvas p-4 text-small font-medium text-primary" role="alert">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={buttonClass('primary', 'lg', 'w-full')}
      >
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {pending ? t.common.sending : mode === 'consultation' ? t.consultation.submit : t.contact.submit}
      </button>
    </form>
  )
}
