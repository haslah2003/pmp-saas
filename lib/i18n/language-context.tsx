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
  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(initialLocale))

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      const safeLocale = normalizeLocale(newLocale)

      setLocaleState(safeLocale)

      document.cookie = `pmp_locale=${safeLocale}; path=/; max-age=31536000; SameSite=Lax`

      try {
        const response = await fetch('/api/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: safeLocale }),
          cache: 'no-store',
        })

        if (!response.ok) {
          console.error('Failed to save language preference')
        }
      } catch (error) {
        console.error('Language update request failed:', error)
      }

      const currentUrl = new URL(window.location.href)
      const hasExplicitLocale =
        currentUrl.searchParams.has('lang') || currentUrl.searchParams.has('locale')

      if (hasExplicitLocale) {
        currentUrl.searchParams.set('lang', safeLocale)
        currentUrl.searchParams.delete('locale')

        const nextHref = `${currentUrl.pathname}?${currentUrl.searchParams.toString()}${currentUrl.hash}`

        startTransition(() => {
          router.replace(nextHref, { scroll: false })
        })

        return
      }

      startTransition(() => {
        router.refresh()
      })
    },
    [router]
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
