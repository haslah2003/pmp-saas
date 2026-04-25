'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useTransition,
} from 'react'
import { useRouter } from 'next/navigation'
import { type Locale, isRTL, t as translate } from '@/lib/i18n/translations'
import type { TranslationKeys } from '@/lib/i18n/translations'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof TranslationKeys) => string
  dir: 'ltr' | 'rtl'
  isArabic: boolean
  isChangingLanguage: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  dir: 'ltr',
  isArabic: false,
  isChangingLanguage: false,
})

function normalizeLocale(value: unknown): Locale {
  return value === 'ar' ? 'ar' : 'en'
}

export function LanguageProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const safeInitialLocale = normalizeLocale(initialLocale)
  const [locale, setLocaleState] = useState<Locale>(safeInitialLocale)

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      const safeNewLocale = normalizeLocale(newLocale)
      const previousLocale = locale

      // Immediate client-side update for Sidebar and other client components
      setLocaleState(safeNewLocale)

      try {
        const response = await fetch('/api/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: safeNewLocale }),
        })

        if (!response.ok) {
          throw new Error('Failed to save language preference')
        }

        // Critical fix:
        // Force Next.js Server Components to re-render and re-read profiles.language.
        startTransition(() => {
          router.refresh()
        })
      } catch (error) {
        console.error('Language update failed:', error)

        // Roll back client UI if the database update fails
        setLocaleState(previousLocale)
      }
    },
    [router, locale]
  )

  const dir = isRTL(locale) ? 'rtl' : 'ltr'

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
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir,
        isArabic: locale === 'ar',
        isChangingLanguage: isPending,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
