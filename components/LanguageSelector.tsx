'use client'

import { useState, useRef, useEffect } from 'react'
import { LANGUAGE_OPTIONS, type Locale } from '@/lib/i18n/translations'

interface Props {
  value: Locale
  onChange: (locale: Locale) => void
  variant?: 'login' | 'sidebar'
}

export default function LanguageSelector({ value, onChange, variant = 'login' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = LANGUAGE_OPTIONS.find(l => l.code === value) || LANGUAGE_OPTIONS[0]

  if (variant === 'sidebar') {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-all w-full"
        >
          <span className="text-base">{current.flag}</span>
          <span>{current.label}</span>
          <span className="text-gray-400 text-[10px] ml-auto">▼</span>
        </button>
        {open && (
          <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
            {LANGUAGE_OPTIONS.map(lang => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium hover:bg-violet-50 transition-colors ${
                  value === lang.code ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {value === lang.code && <span className="ml-auto text-violet-500">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Login variant — larger, centered
  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-violet-300 hover:bg-violet-50 transition-all shadow-sm"
      >
        <span className="text-lg">{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-gray-400 text-xs ml-1">▼</span>
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
          {LANGUAGE_OPTIONS.map(lang => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-violet-50 transition-colors ${
                value === lang.code ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
              {value === lang.code && <span className="ml-auto text-violet-500 font-bold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
