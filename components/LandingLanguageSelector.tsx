'use client'

import { useState, useEffect } from 'react'

const OPTIONS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

export default function LandingLanguageSelector() {
  const [current, setCurrent] = useState('en')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = document.cookie.match(/lang=([^;]+)/)?.[1] || 'en'
    setCurrent(saved)
  }, [])

  function select(code: string) {
    setCurrent(code)
    setOpen(false)
    document.cookie = `lang=${code};path=/;max-age=31536000`
    // Reload so server-rendered content reflects new language
    window.location.reload()
  }

  const active = OPTIONS.find(o => o.code === current) || OPTIONS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
      >
        <span>{active.flag}</span>
        <span>{active.label}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden min-w-[140px]">
            {OPTIONS.map(opt => (
              <button
                key={opt.code}
                onClick={() => select(opt.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-violet-50 transition-colors ${
                  current === opt.code ? 'text-violet-700 font-semibold bg-violet-50' : 'text-gray-700'
                }`}
              >
                <span>{opt.flag}</span>
                <span>{opt.label}</span>
                {current === opt.code && <span className="ml-auto text-violet-500">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
