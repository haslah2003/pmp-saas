'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { StarOrnament } from '@/components/art/Ornaments'

const copy = {
  ar: { title: 'الصفحة غير موجودة', text: 'الصفحة التي تبحث عنها نُقلت أو لم تعد موجودة.', home: 'العودة إلى الرئيسية', search: 'ابحث في الموقع' },
  en: { title: 'Page not found', text: 'The page you’re looking for has moved or no longer exists.', home: 'Back to home', search: 'Search the site' },
}

export default function NotFound() {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale === 'en' ? 'en' : 'ar'
  const c = copy[locale]
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-sans text-7xl font-bold text-primary-200">404</p>
      <StarOrnament className="mt-4 size-6 text-accent" />
      <h1 className="mt-4 text-3xl">{c.title}</h1>
      <p className="mt-3 max-w-md text-ink/70">{c.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/${locale}`} className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">
          {c.home}
        </Link>
        <Link href={`/${locale}/search`} className="inline-flex h-11 items-center rounded-full border border-line px-6 font-semibold">
          {c.search}
        </Link>
      </div>
    </section>
  )
}
