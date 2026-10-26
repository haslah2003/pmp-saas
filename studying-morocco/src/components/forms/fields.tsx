'use client'

import { AlertCircle, Check } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { inputClass } from './styles'

export { inputClass }

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
      <label htmlFor={id} className="text-small font-semibold text-ink">
        {label}
        {required ? (
          <span className="ms-0.5 text-primary" aria-hidden="true">
            *
          </span>
        ) : (
          optionalLabel && <span className="ms-1.5 text-small font-normal text-muted">({optionalLabel})</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-small text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-small font-semibold text-primary" role="alert">
          <AlertCircle className="mt-1 size-4 shrink-0 text-cta-active" aria-hidden="true" />
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
  return <textarea {...props} aria-invalid={invalid || undefined} className={cn(inputClass, 'min-h-28 py-3', className)} />
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
              'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-small font-medium transition-colors disabled:opacity-40',
              active ? 'border-primary bg-primary text-white' : 'border-muted bg-surface text-ink hover:border-primary hover:bg-canvas',
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
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {options.map((o) => (
        <label
          key={o.value}
          className={cn(
            'flex min-h-16 cursor-pointer items-center gap-3 rounded-card border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary',
            value === o.value ? 'border-2 border-primary bg-canvas' : 'border-muted bg-surface hover:border-primary',
          )}
        >
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
          <span className={cn('inline-flex size-10 items-center justify-center rounded-control', value === o.value ? 'bg-primary text-white' : 'bg-canvas text-primary')}>
            {o.icon}
          </span>
          <span className="font-semibold text-primary">{o.label}</span>
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
