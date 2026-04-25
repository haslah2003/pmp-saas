import Link from 'next/link'
import { cookies } from 'next/headers'
import { t, type Locale } from '@/lib/i18n/translations'
import { createClient } from '@/lib/supabase/server'
import { COURSES, TOTAL_LESSONS } from '@/lib/courses-data'
import { COURSES_AR } from '@/lib/courses-data-ar'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('pmp_locale')?.value
  let language = cookieLocale === 'ar' ? 'ar' : 'en'

  if (user && cookieLocale !== 'ar' && cookieLocale !== 'en') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('language')
      .eq('id', user.id)
      .single()
    if (profile?.language) language = profile.language
  }
  const activeCourses = language === 'ar' ? COURSES_AR : COURSES

  return (
    <div className="min-h-screen bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎓</span>
            <h1 className="text-3xl font-bold text-gray-900">{t(language as Locale, 'course.library_title')}</h1>
          </div>
          <p className="text-gray-500 mt-1 max-w-2xl">
            {t(language as Locale, 'course.library_desc')} {TOTAL_LESSONS} {t(language as Locale, 'course.lessons')} — {COURSES.length} {t(language as Locale, 'course.perf_domains')}.
          </p>

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-5">
            {[
              { label: t(language as Locale, 'course.perf_domains'), value: COURSES.length },
              { label: t(language as Locale, 'course.total_lessons'), value: TOTAL_LESSONS },
              { label: t(language as Locale, 'course.avg_per_lesson'), value: '18 ' + t(language as Locale, 'course.min') },
              { label: t(language as Locale, 'course.practice_ctas'), value: t(language as Locale, 'course.every_lesson') },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-violet-600">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Course Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeCourses.map((course, idx) => (
            <Link
              key={course.slug}
              href={`/dashboard/course/${course.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden"
            >
              {/* Card header gradient */}
              <div className={`bg-gradient-to-r ${course.gradient} p-5 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{course.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                        {t(language as Locale, 'course.domain')} {idx + 1}
                      </p>
                      <h2 className="text-lg font-bold leading-tight mt-0.5">
                        {course.shortTitle}
                      </h2>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {course.lessons.length} {t(language as Locale, 'course.lessons')}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* ECO mapping badge */}
                <div className="mt-3 mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.badgeColor}`}>
                    📌 {course.ecoMapping}
                  </span>
                </div>

                {/* Lesson list preview */}
                <div className="space-y-1.5">
                  {course.lessons.map((lesson, li) => (
                    <div key={lesson.slug} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${course.badgeColor}`}>
                        {li + 1}
                      </div>
                      <span className="text-xs text-gray-600 truncate">{lesson.title}</span>
                      <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">
                        {lesson.estimatedMinutes}m
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>📖 {t(language as Locale, 'course.lessons_label')}</span>
                    <span>🎯 {t(language as Locale, 'course.practice_label')}</span>
                    <span>🗺️ {t(language as Locale, 'course.mindmap_label')}</span>
                  </div>
                  <span className={`text-xs font-semibold ${course.textColor} group-hover:translate-x-0.5 transition-transform`}>
                    {t(language as Locale, 'course.start')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}