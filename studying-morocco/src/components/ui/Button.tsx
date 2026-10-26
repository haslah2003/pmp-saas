import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * One button style site-wide (KNO guidelines):
 * - primary: golden amber with purple text — main actions (Apply, Submit, Book)
 * - secondary: purple outline — every other action
 * - light: white outline for purple backgrounds
 * Heights: 44px on mobile and tablet, 48px on desktop. Buttons fill the width on mobile unless `inline`.
 */
type Variant = 'primary' | 'secondary' | 'light'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-cta text-primary hover:bg-cta-hover active:bg-cta-active',
  secondary: 'border-2 border-primary bg-surface text-primary hover:bg-canvas',
  light: 'border-2 border-white text-white hover:bg-white/10',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 lg:min-h-12',
  lg: 'min-h-12 px-7',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string, inline = false) =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-control text-center text-btn font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60',
    !inline && 'max-md:w-full',
    variants[variant],
    sizes[size],
    className,
  )

type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant
  size?: Size
  inline?: boolean
  className?: string
  children: ReactNode
}

export function LinkButton({ variant, size, inline, className, children, ...props }: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, size, className, inline)} {...props}>
      {children}
    </Link>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size; inline?: boolean }

export function Button({ variant, size, inline, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className, inline)} {...props}>
      {children}
    </button>
  )
}
