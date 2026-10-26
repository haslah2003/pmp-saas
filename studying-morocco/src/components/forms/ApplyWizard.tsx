'use client'

import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Home, Loader2, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { submitApplication, type ApplicationInput } from '@/app/(frontend)/actions'
import { Icon } from '@/components/ui/Icon'
import { SocialIcon } from '@/components/ui/SocialIcon'
import type { Dictionary } from '@/i18n'
import {
  budgetRanges,
  countries,
  languageLevels,
  serviceKeys,
  studyLevels,
  teachingLanguages,
  type Locale,
} from '@/lib/options'
import { cn } from '@/lib/utils'

import { trackEvent } from '../layout/Tracker'
import { ChipGroup, ChoiceCards, Field, Honeypot, readUTM, Select, TextArea, TextInput } from './fields'

type Opt = { id: number; name: string; group?: string }

const serviceIcons: Record<string, string> = {
  placement: 'graduation-cap',
  accommodation: 'home',
  airport: 'plane',
  transport: 'bus',
  academic: 'book-open',
  language: 'languages',
  residency: 'file-check',
  equivalence: 'badge-check',
  insurance: 'heart-pulse',
  family: 'users',
  guardianship: 'shield-check',
  career: 'briefcase',
}

type State = {
  applicantType: 'student' | 'parent' | 'family'
  fullName: string
  email: string
  phone: string
  nationality: string
  residence: string
  dateOfBirth: string
  guardianName: string
  children: string
  level: string
  discipline: string
  program: string
  universities: number[]
  cities: number[]
  teachingLanguage: string
  frenchLevel: string
  englishLevel: string
  currentEducation: string
  grade: string
  intake: string
  budget: string
  services: string[]
  message: string
  consent: boolean
}

export type ApplyInitial = Partial<Pick<State, 'level' | 'discipline' | 'program' | 'universities' | 'cities' | 'services' | 'message'>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s().-]{7,}$/

export function ApplyWizard({
  locale,
  t,
  disciplines,
  cities,
  universities,
  programs,
  initial,
  whatsappHref,
}: {
  locale: Locale
  t: Pick<Dictionary, 'apply' | 'common' | 'errors' | 'nav' | 'footer'>
  disciplines: Opt[]
  cities: Opt[]
  universities: Opt[]
  programs: (Opt & { university?: number })[]
  initial?: ApplyInitial
  whatsappHref: string | null
}) {
  const a = t.apply
  const [step, setStep] = useState(0)
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const startedAt = useRef(Date.now())
  const topRef = useRef<HTMLDivElement>(null)
  const [s, setS] = useState<State>({
    applicantType: 'student',
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    residence: '',
    dateOfBirth: '',
    guardianName: '',
    children: '',
    level: initial?.level ?? '',
    discipline: initial?.discipline ?? '',
    program: initial?.program ?? '',
    universities: initial?.universities ?? [],
    cities: initial?.cities ?? [],
    teachingLanguage: '',
    frenchLevel: '',
    englishLevel: '',
    currentEducation: '',
    grade: '',
    intake: '',
    budget: '',
    services: initial?.services?.length ? initial.services : ['placement'],
    message: initial?.message ?? '',
    consent: false,
  })
  const set = <K extends keyof State>(key: K, value: State[K]) => {
    setS((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest)
  }

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  const programOptions = useMemo(() => {
    const byUni = new Map(universities.map((u) => [u.id, u.name]))
    const filtered = s.universities.length ? programs.filter((p) => p.university && s.universities.includes(p.university)) : programs
    return filtered.map((p) => ({ value: p.id, label: p.name, group: p.university ? byUni.get(p.university) : undefined }))
  }, [programs, universities, s.universities])

  const countryOptions = countries.map((c) => ({ value: c.value, label: c.label[locale] }))
  const levelOptions = (opts: readonly { value: string; label: { ar: string; en: string } }[]) => opts.map((o) => ({ value: o.value, label: o.label[locale] }))

  const validateStep = (index: number) => {
    const e: Record<string, string> = {}
    if (index === 0) {
      if (s.fullName.trim().length < 3) e.fullName = t.errors.nameRequired
      if (!EMAIL.test(s.email.trim())) e.email = t.errors.emailInvalid
      if (!PHONE.test(s.phone.trim())) e.phone = t.errors.phoneInvalid
    }
    if (index === 3 && !s.consent) e.consent = t.errors.consentRequired
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (validateStep(step)) setStep((v) => Math.min(v + 1, 3))
  }

  const submit = () => {
    if (!validateStep(3)) return
    setFormError(null)
    const num = (v: string) => (v ? Number(v) : undefined)
    const opt = <T extends string>(v: string) => (v ? (v as T) : undefined)
    const payload: ApplicationInput = {
      website,
      startedAt: startedAt.current,
      applicantType: s.applicantType,
      fullName: s.fullName,
      email: s.email,
      phone: s.phone,
      nationality: opt(s.nationality),
      residence: opt(s.residence),
      dateOfBirth: s.dateOfBirth,
      guardianName: s.guardianName,
      children: num(s.children),
      level: opt(s.level),
      discipline: num(s.discipline),
      program: num(s.program),
      universities: s.universities,
      cities: s.cities,
      teachingLanguage: opt(s.teachingLanguage),
      frenchLevel: opt(s.frenchLevel),
      englishLevel: opt(s.englishLevel),
      currentEducation: s.currentEducation,
      grade: s.grade,
      intake: s.intake,
      budget: opt(s.budget),
      services: s.services as ApplicationInput['services'],
      message: s.message,
      consent: true,
      locale,
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer.slice(0, 300),
      ...readUTM(),
    }
    start(async () => {
      const res = await submitApplication(payload)
      if (res.ok) {
        trackEvent('application_submitted')
        setReference(res.data.reference)
        topRef.current?.scrollIntoView({ behavior: 'smooth' })
      } else if (res.error === 'invalid') {
        setErrors(res.fields ?? {})
        setFormError(t.errors.invalid)
        if (res.fields && ['fullName', 'email', 'phone'].some((k) => k in res.fields!)) setStep(0)
      } else setFormError(res.error === 'rate' ? t.errors.tooMany : t.errors.generic)
    })
  }

  if (reference) {
    return (
      <div ref={topRef} className="rounded-[2rem] border border-line bg-surface p-8 text-center shadow-lift sm:p-12" role="status">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary">
          <CheckCircle2 className="size-9" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-3xl">{a.successTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-ink/75">{a.successText}</p>
        <p className="mt-8 text-sm text-muted">{a.reference}</p>
        <p className="mt-1 font-sans text-3xl font-bold tracking-wider text-primary-800" dir="ltr">
          {reference}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}/track?ref=${reference}`} className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-700">
            {a.trackCta}
          </Link>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1f9d55] px-6 font-semibold text-white">
              <SocialIcon name="whatsapp" className="size-5" /> {a.whatsappCta}
            </a>
          )}
        </div>
      </div>
    )
  }

  const optional = t.common.optional
  return (
    <div ref={topRef} className="scroll-mt-28 rounded-[2rem] border border-line bg-surface shadow-lift">
      <ol className="grid grid-cols-4 border-b border-line" aria-label={a.title}>
        {a.steps.map((label, i) => (
          <li key={label} className={cn('relative px-2 py-4 text-center text-xs font-semibold sm:text-sm', i <= step ? 'text-primary-800' : 'text-muted')}>
            <span
              className={cn(
                'mx-auto mb-1.5 flex size-8 items-center justify-center rounded-full text-sm',
                i < step ? 'bg-primary text-white' : i === step ? 'bg-primary-100 text-primary-800 ring-2 ring-primary' : 'bg-ink/5',
              )}
              aria-current={i === step ? 'step' : undefined}
            >
              {i < step ? <CheckCircle2 className="size-4" aria-hidden="true" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
            <span className={cn('absolute inset-x-0 bottom-0 h-0.5', i <= step ? 'bg-primary' : 'bg-transparent')} />
          </li>
        ))}
      </ol>

      <form
        className="relative space-y-6 p-6 sm:p-10"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (step < 3) next()
          else submit()
        }}
      >
        <Honeypot value={website} onChange={setWebsite} />

        {step === 0 && (
          <>
            <div>
              <p className="mb-3 text-sm font-semibold">{a.applyingAs}</p>
              <ChoiceCards
                name="applicantType"
                value={s.applicantType}
                onChange={(v) => set('applicantType', v)}
                options={[
                  { value: 'student', label: a.student, icon: <GraduationCap className="size-5" aria-hidden="true" /> },
                  { value: 'parent', label: a.parent, icon: <ShieldCheck className="size-5" aria-hidden="true" /> },
                  { value: 'family', label: a.family, icon: <Users className="size-5" aria-hidden="true" /> },
                ]}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label={a.fullName} required error={errors.fullName} className="sm:col-span-2">
                <TextInput id="fullName" autoComplete="name" value={s.fullName} onChange={(e) => set('fullName', e.target.value)} invalid={!!errors.fullName} />
              </Field>
              <Field id="email" label={a.email} required error={errors.email}>
                <TextInput id="email" type="email" autoComplete="email" dir="ltr" value={s.email} onChange={(e) => set('email', e.target.value)} invalid={!!errors.email} />
              </Field>
              <Field id="phone" label={a.phone} required error={errors.phone}>
                <TextInput id="phone" type="tel" autoComplete="tel" dir="ltr" placeholder="+968 9xxx xxxx" value={s.phone} onChange={(e) => set('phone', e.target.value)} invalid={!!errors.phone} />
              </Field>
              <Field id="nationality" label={a.nationality} optionalLabel={optional}>
                <Select id="nationality" value={s.nationality} onChange={(e) => set('nationality', e.target.value)} options={countryOptions} placeholder={a.selectPlaceholder} />
              </Field>
              <Field id="residence" label={a.residence} optionalLabel={optional}>
                <Select id="residence" value={s.residence} onChange={(e) => set('residence', e.target.value)} options={countryOptions} placeholder={a.selectPlaceholder} />
              </Field>
              {s.applicantType === 'student' ? (
                <Field id="dob" label={a.dateOfBirth} optionalLabel={optional}>
                  <TextInput id="dob" type="date" value={s.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
                </Field>
              ) : (
                <Field id="guardianName" label={a.guardianName} optionalLabel={optional}>
                  <TextInput id="guardianName" value={s.guardianName} onChange={(e) => set('guardianName', e.target.value)} />
                </Field>
              )}
              {s.applicantType === 'family' && (
                <Field id="children" label={a.children} optionalLabel={optional}>
                  <TextInput id="children" type="number" min={0} max={12} inputMode="numeric" value={s.children} onChange={(e) => set('children', e.target.value)} />
                </Field>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="level" label={a.level} optionalLabel={optional}>
              <Select id="level" value={s.level} onChange={(e) => set('level', e.target.value)} options={levelOptions(studyLevels)} placeholder={a.selectPlaceholder} />
            </Field>
            <Field id="discipline" label={a.field} optionalLabel={optional}>
              <Select id="discipline" value={s.discipline} onChange={(e) => set('discipline', e.target.value)} options={disciplines.map((d) => ({ value: d.id, label: d.name }))} placeholder={a.selectPlaceholder} />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold">
                {a.universities} <span className="text-xs font-normal text-muted">({a.chooseMany})</span>
              </p>
              <ChipGroup label={a.universities} options={universities.map((u) => ({ value: u.id, label: u.name }))} value={s.universities} onChange={(v) => set('universities', v)} max={5} />
            </div>
            <Field id="program" label={a.program} optionalLabel={optional} className="sm:col-span-2">
              <Select id="program" value={s.program} onChange={(e) => set('program', e.target.value)} options={programOptions} placeholder={a.selectPlaceholder} />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold">
                {a.cities} <span className="text-xs font-normal text-muted">({a.chooseMany})</span>
              </p>
              <ChipGroup label={a.cities} options={cities.map((c) => ({ value: c.id, label: c.name }))} value={s.cities} onChange={(v) => set('cities', v)} max={5} />
            </div>
            <Field id="teachingLanguage" label={a.teachingLanguage} optionalLabel={optional}>
              <Select id="teachingLanguage" value={s.teachingLanguage} onChange={(e) => set('teachingLanguage', e.target.value)} options={levelOptions(teachingLanguages)} placeholder={a.selectPlaceholder} />
            </Field>
            <Field id="budget" label={a.budget} optionalLabel={optional}>
              <Select id="budget" value={s.budget} onChange={(e) => set('budget', e.target.value)} options={levelOptions(budgetRanges)} placeholder={a.selectPlaceholder} />
            </Field>
            <Field id="frenchLevel" label={a.frenchLevel} optionalLabel={optional}>
              <Select id="frenchLevel" value={s.frenchLevel} onChange={(e) => set('frenchLevel', e.target.value)} options={levelOptions(languageLevels)} placeholder={a.selectPlaceholder} />
            </Field>
            <Field id="englishLevel" label={a.englishLevel} optionalLabel={optional}>
              <Select id="englishLevel" value={s.englishLevel} onChange={(e) => set('englishLevel', e.target.value)} options={levelOptions(languageLevels)} placeholder={a.selectPlaceholder} />
            </Field>
            <Field id="currentEducation" label={a.currentEducation} optionalLabel={optional}>
              <TextInput id="currentEducation" placeholder={a.currentEducationPlaceholder} value={s.currentEducation} onChange={(e) => set('currentEducation', e.target.value)} />
            </Field>
            <Field id="grade" label={a.grade} optionalLabel={optional}>
              <TextInput id="grade" value={s.grade} onChange={(e) => set('grade', e.target.value)} />
            </Field>
            <Field id="intake" label={a.intake} optionalLabel={optional} className="sm:col-span-2">
              <TextInput id="intake" placeholder={locale === 'ar' ? 'سبتمبر 2027' : 'September 2027'} value={s.intake} onChange={(e) => set('intake', e.target.value)} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <>
            <div>
              <p className="mb-3 text-sm font-semibold">
                {a.services} <span className="text-xs font-normal text-muted">({a.chooseMany})</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {serviceKeys.map((sk) => {
                  const active = s.services.includes(sk.value)
                  return (
                    <button
                      key={sk.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => set('services', active ? s.services.filter((v) => v !== sk.value) : [...s.services, sk.value])}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl border p-3.5 text-start text-sm font-semibold transition',
                        active ? 'border-primary bg-primary-50 ring-2 ring-primary-100' : 'border-line bg-surface hover:border-primary-200',
                      )}
                    >
                      <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-xl', active ? 'bg-primary text-white' : 'bg-ink/5 text-ink/70')}>
                        <Icon name={serviceIcons[sk.value]} className="size-4.5" />
                      </span>
                      {sk.label[locale]}
                    </button>
                  )
                })}
              </div>
            </div>
            <Field id="message" label={a.message} optionalLabel={optional}>
              <TextArea id="message" rows={5} value={s.message} onChange={(e) => set('message', e.target.value)} />
            </Field>
          </>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-ink/75">{a.review}</p>
            <dl className="grid gap-x-8 gap-y-4 rounded-2xl bg-sand/60 p-5 text-sm sm:grid-cols-2">
              {(
                [
                  [a.fullName, s.fullName],
                  [a.email, s.email],
                  [a.phone, s.phone],
                  [a.nationality, countries.find((c) => c.value === s.nationality)?.label[locale]],
                  [a.level, studyLevels.find((l) => l.value === s.level)?.label[locale]],
                  [a.field, disciplines.find((d) => String(d.id) === s.discipline)?.name],
                  [a.universities, universities.filter((u) => s.universities.includes(u.id)).map((u) => u.name).join('، ')],
                  [a.program, programs.find((p) => String(p.id) === s.program)?.name],
                  [a.cities, cities.filter((c) => s.cities.includes(c.id)).map((c) => c.name).join('، ')],
                  [a.services, serviceKeys.filter((k) => s.services.includes(k.value)).map((k) => k.label[locale]).join('، ')],
                ] as const
              )
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold text-muted">{k}</dt>
                    <dd className="mt-0.5 font-medium break-words text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={s.consent}
                onChange={(e) => set('consent', e.target.checked)}
                className="mt-1 size-5 shrink-0 accent-[var(--color-primary)]"
                aria-invalid={!!errors.consent || undefined}
              />
              <span className="text-sm leading-relaxed text-ink/85">
                {a.consent}{' '}
                <Link href={`/${locale}/privacy`} className="font-semibold text-primary underline underline-offset-2" target="_blank">
                  {t.footer.privacy}
                </Link>
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs font-medium text-clay-700" role="alert">
                {errors.consent}
              </p>
            )}
          </div>
        )}

        {formError && (
          <p className="rounded-2xl bg-clay-50 p-4 text-sm font-medium text-clay-700" role="alert">
            {formError}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((v) => v - 1)} className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold text-ink/80 hover:bg-ink/5">
              <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" /> {t.common.previous}
            </button>
          ) : (
            <Link href={`/${locale}`} className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold text-ink/70 hover:bg-ink/5">
              <Home className="size-4" aria-hidden="true" />
            </Link>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 font-semibold text-white shadow-[0_8px_20px_-8px_var(--color-primary)] transition hover:bg-primary-700 disabled:opacity-60"
          >
            {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
            {step < 3 ? t.common.next : pending ? t.common.sending : a.submit}
            {step < 3 && <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />}
          </button>
        </div>
      </form>
    </div>
  )
}
