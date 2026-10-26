import { Noto_Kufi_Arabic } from 'next/font/google'

/**
 * Arabic: Noto Kufi Arabic for everything (headings, body, Latin words inside Arabic text).
 * English: Acumin Variable Concept, served from the Adobe Fonts kit set in Site settings → Brand.
 */
export const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic', 'latin'],
  weight: 'variable',
  variable: '--font-kufi',
  display: 'swap',
})

export const fontVariables = kufi.variable
