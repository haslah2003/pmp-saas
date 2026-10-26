import { Fraunces, IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic, Plus_Jakarta_Sans } from 'next/font/google'

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
})

export const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-kufi',
  display: 'swap',
  preload: false,
})

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
  display: 'swap',
  preload: false,
})

export const fontVariables = [plexArabic.variable, kufi.variable, jakarta.variable, fraunces.variable].join(' ')
