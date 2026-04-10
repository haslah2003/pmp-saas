'use client'

import { LanguageProvider } from '@/lib/i18n/language-context'
import { useLanguage } from '@/lib/i18n/language-context'
import LanguageSelector from '@/components/LanguageSelector'
import type { Locale } from '@/lib/i18n/translations'

function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  return <LanguageSelector value={locale} onChange={setLocale} variant="sidebar" />
}

export function DashboardLanguageWrapper({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      {children}
    </LanguageProvider>
  )
}

export { LanguageSwitcher }
