'use client'

import { Check } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const inputClass =
  'h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[0.98rem] text-ink transition outline-none placeholder:text-ink/40 hover:border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100 aria-[invalid=true]:border-clay aria-[invalid=true]:ring-clay-50'

export function Field({
  id,
  label,
  error,
  hint,
  required,
  optionalLabel,
  children,
  className,
}: {
  id: string
  label: string
  error?: string | null
  hint?: string
  required?: boolean
  optionalLabel?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="ms-0.5 text-clay" aria-hidden="true">
            *
          </span>
        ) : (
          optionalLabel && <span className="ms-1.5 text-xs font-normal text-muted">({optionalLabel})</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-clay-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextInput({ invalid, className, ...props }: ComponentProps<'input'> & { invalid?: boolean }) {
  return <input {...props} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${props.id}-error` : undefined} className={cn(inputClass, className)} />
}

export function TextArea({ invalid, className, ...props }: ComponentProps<'textarea'> & { invalid?: boolean }) {
  return <textarea {...props} aria-invalid={invalid || undefined} className={cn(inputClass, 'h-auto min-h-28 py-3 leading-relaxed', className)} />
}

export function Select({
  options,
  placeholder,
  invalid,
  className,
  ...props
}: ComponentProps<'select'> & { options: { value: string | number; label: string; group?: string }[]; placeholder?: string; invalid?: boolean }) {
  const groups = [...new Set(options.map((o) => o.group).filter(Boolean))] as string[]
  return (
    <select {...props} aria-invalid={invalid || undefined} className={cn(inputClass, 'appearance-none pe-10', className)}>
      <option value="">{placeholder ?? '—'}</option>
      {groups.length
        ? groups.map((g) => (
            <optgroup key={g} label={g}>
              {options
                .filter((o) => o.group === g)
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </optgroup>
          ))
        : options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
    </select>
  )
}

/** Toggleable chips for multi-select choices. */
export function ChipGroup<V extends string | number>({
  options,
  value,
  onChange,
  max,
  label,
}: {
  options: { value: V; label: string; icon?: ReactNode }[]
  value: V[]
  onChange: (next: V[]) => void
  max?: number
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.value)
        const disabled = !active && max !== undefined && value.length >= max
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(active ? value.filter((v) => v !== o.value) : [...value, o.value])}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition disabled:opacity-40',
              active ? 'border-primary bg-primary text-white shadow-soft' : 'border-line bg-surface text-ink/85 hover:border-primary-200 hover:bg-primary-50',
            )}
          >
            {active ? <Check className="size-4" aria-hidden="true" /> : o.icon}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** Large radio cards for a single choice. */
export function ChoiceCards<V extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: { value: V; label: string; icon?: ReactNode }[]
  value: V
  onChange: (v: V) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((o) => (
        <label
          key={o.value}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition',
            value === o.value ? 'border-primary bg-primary-50 ring-2 ring-primary-100' : 'border-line bg-surface hover:border-primary-200',
          )}
        >
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
          <span className={cn('inline-flex size-10 items-center justify-center rounded-xl', value === o.value ? 'bg-primary text-white' : 'bg-ink/5 text-ink/70')}>
            {o.icon}
          </span>
          <span className="font-semibold">{o.label}</span>
        </label>
      ))}
    </div>
  )
}

/** Hidden honeypot: real visitors never see or fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute start-0 top-0 h-px w-px overflow-hidden opacity-0">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" />
      </label>
    </div>
  )
}

export const readUTM = () => {
  try {
    return JSON.parse(sessionStorage.getItem('sim-utm') || '{}') as { utmSource?: string; utmMedium?: string; utmCampaign?: string }
  } catch {
    return {}
  }
}
