'use client'

import { LanguageProvider, useLanguage } from '@/lib/i18n/language-context'
import LanguageSelector from '@/components/LanguageSelector'
import type { Locale } from '@/lib/i18n/translations'

function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  return <LanguageSelector value={locale} onChange={setLocale} variant="sidebar" />
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage()

  return (
    <div className="flex h-screen bg-gray-50" dir={dir}>
      {children}
    </div>
  )
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
      <DashboardShell>{children}</DashboardShell>
    </LanguageProvider>
  )
}

export { LanguageSwitcher }
