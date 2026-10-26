import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'outline' | 'light' | 'whatsapp'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white shadow-[0_8px_20px_-8px_var(--color-primary)] hover:bg-primary-700',
  secondary: 'bg-secondary text-white hover:bg-secondary-900',
  gold: 'bg-accent text-secondary-900 shadow-[0_8px_20px_-10px_var(--color-accent)] hover:bg-accent-300',
  ghost: 'text-ink hover:bg-ink/5',
  outline: 'border border-line bg-surface text-ink hover:border-primary-300 hover:bg-primary-50',
  light: 'bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur hover:bg-white/20',
  whatsapp: 'bg-[#1f9d55] text-white hover:bg-[#178347]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )

type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function LinkButton({ variant, size, className, children, ...props }: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size }

export function Button({ variant, size, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  )
}
