import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const siteURL = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const absoluteURL = (path: string) => `${siteURL()}${path.startsWith('/') ? path : `/${path}`}`

/** Narrows a Payload relationship value (ID or populated doc) to the populated doc. */
export const populated = <T extends { id: number | string }>(value: T | number | string | null | undefined): T | null =>
  value && typeof value === 'object' ? value : null

export const initials = (text: string, max = 3) =>
  text
    .split(/[\s-]+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .map((w) => w[0]!.toUpperCase())
    .join('')
    .slice(0, max)

export const whatsappLink = (number: string | null | undefined, message: string) =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null

export const splitParagraphs = (text: string | null | undefined) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
