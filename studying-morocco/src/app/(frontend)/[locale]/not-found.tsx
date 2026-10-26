'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { buttonClass } from '@/components/ui/Button'

const copy = {
  ar: { title: 'الصفحة غير موجودة', text: 'الصفحة التي تبحث عنها نُقلت أو لم تعد موجودة.', home: 'العودة إلى الرئيسية', search: 'ابحث في الموقع' },
  en: { title: 'Page not found', text: 'The page you’re looking for has moved or no longer exists.', home: 'Back to home', search: 'Search the site' },
}

export default function NotFound() {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale === 'en' ? 'en' : 'ar'
  const c = copy[locale]
  return (
    <section className="container-page flex min-h-[60vh] flex-col justify-center py-section">
      <p className="text-h4 font-semibold text-muted">404</p>
      <h1 className="mt-2">{c.title}</h1>
      <p className="mt-3 max-w-xl text-body text-ink">{c.text}</p>
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <Link href={`/${locale}`} className={buttonClass('primary')}>
          {c.home}
        </Link>
        <Link href={`/${locale}/search`} className={buttonClass('secondary')}>
          {c.search}
        </Link>
      </div>
    </section>
  )
}
