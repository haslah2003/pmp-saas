'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { type Locale, isRTL, t as translate } from '@/lib/i18n/translations'
import type { TranslationKeys } from '@/lib/i18n/translations'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof TranslationKeys) => string
  dir: 'ltr' | 'rtl'
  isArabic: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  dir: 'ltr',
  isArabic: false,
})

export function LanguageProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback(async (newLocale: Locale) => {
    setLocaleState(newLocale)
    // Save to profile
    try {
      await fetch('/api/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLocale }),
      })
    } catch {
      // silently fail
    }
  }, [])

  const dir = isRTL(locale) ? 'rtl' : 'ltr'

  // Apply RTL to document
  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = locale
    if (isRTL(locale)) {
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.classList.remove('rtl')
    }
  }, [locale, dir])

  const t = useCallback(
    (key: keyof TranslationKeys) => translate(locale, key),
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isArabic: locale === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
