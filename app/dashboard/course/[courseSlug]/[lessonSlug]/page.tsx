import Link from 'next/link'
import { cookies } from 'next/headers'
import { t, type Locale } from '@/lib/i18n/translations'
import { notFound } from 'next/navigation'
import { getLessonBySlug, COURSES } from '@/lib/courses-data'
import { getLessonBySlugAr } from '@/lib/courses-data-ar'
import { createClient } from '@/lib/supabase/server'
import GoDeeperPanel from '@/components/GoDeeperPanel'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ courseSlug: string; lessonSlug: string }>
}

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params
  // Read user's active framework from profile
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let framework = 'pmbok7'

  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('pmp_locale')?.value
  let language = (cookieLocale === 'ar' ? 'ar' : 'en') as Locale

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('active_framework, language')
      .eq('id', user.id)
      .single()

    if (profile?.active_framework === 'pmbok8') framework = 'pmbok8'

    if (cookieLocale !== 'ar' && cookieLocale !== 'en') {
      language = (profile?.language === 'ar' ? 'ar' : 'en') as Locale
    }
  }

  const loc = language
  const isAr = language === 'ar'

  const result = language === 'ar'
    ? getLessonBySlugAr(courseSlug, lessonSlug)
    : getLessonBySlug(courseSlug, lessonSlug)
  if (!result) notFound()

  const { course, lesson, index } = result
  const prevLesson = index > 0 ? course.lessons[index - 1] : null
  const nextLesson = index < course.lessons.length - 1 ? course.lessons[index + 1] : null

  const isV8 = framework === 'pmbok8'
  const frameworkLabel = isV8 ? 'PMBOK 8 + ECO 2026' : 'PMBOK 7 + ECO 2021'

  return (
    <div className="min-h-screen bg-gray-50" dir={isAr ? "rtl" : "ltr"}>
      {/* ── Top Nav ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/dashboard/course" className="hover:text-gray-700 transition-colors">{t(loc, 'course.course_library')}</Link>
            <span>/</span>
            <Link href={`/dashboard/course/${course.slug}`} className="hover:text-gray-700 transition-colors">{course.shortTitle}</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-48">{lesson.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isV8 ? 'bg-purple-100 text-purple-700' : 'bg-violet-100 text-violet-600'}`}>
              {frameworkLabel}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${course.badgeColor}`}>
              {t(loc, 'course.lesson_of')} {index + 1} / {course.lessons.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Lesson Header */}
            <div className={`rounded-2xl bg-gradient-to-br ${course.gradient} text-white p-7`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{course.icon}</span>
                <span className="text-sm font-medium text-white/70">{course.shortTitle}</span>
                {isV8 && (
                  <span className="ml-2 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                    🆕 PMBOK 8
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold leading-tight">{lesson.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                <span>⏱ {lesson.estimatedMinutes} {t(loc, 'course.min')}</span>
                <span>•</span>
                <span>💡 {lesson.keyConcepts.length} {t(loc, 'course.key_concepts')}</span>
                <span>•</span>
                <span>🎯 {lesson.examTips.length} {t(loc, 'course.exam_tips')}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 w-fit">
                <span className="text-xs text-white/80">✨</span>
                <span className="text-xs font-semibold text-white">{t(loc, 'deeper.go_deeper')}</span>
                <span className="text-xs text-white/80">{t(loc, 'course.go_deeper_cta')} — {frameworkLabel}</span>
              </div>
            </div>
            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🎓</span>
                <h2 className="text-base font-bold text-gray-900">{t(loc, 'course.what_learn')}</h2>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto font-medium">
                  {t(loc, 'course.learning_outcomes')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.keyConcepts.map((kc) => (
                  <div key={kc.term} className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-700">
                      {isAr ? 'فهم' : 'Understand'} <strong className="text-gray-900">{kc.term}</strong> {isAr ? 'وكيفية تطبيقه في سيناريوهات الاختبار' : 'and how to apply it in exam scenarios'}
                    </p>
                  </div>
                ))}
                {lesson.deepDive.map((section) => (
                  <div key={section.heading} className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-700">
                      {isAr ? 'استكشف' : 'Explore'} <strong className="text-gray-900">{section.heading}</strong>
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                <span>🔑 {lesson.keyConcepts.length} {t(loc, 'course.key_concepts')}</span>
                <span>🔍 {lesson.deepDive.length} {t(loc, 'course.deep_dive_topics')}</span>
                <span>🎯 {lesson.examTips.length} {t(loc, 'course.exam_tips')}</span>
                <span>⚠️ {lesson.commonPitfalls.length} {t(loc, 'course.pitfalls')}</span>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📖</span>
                <h2 className="text-base font-bold text-gray-900">{t(loc, 'course.overview')}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{lesson.overview}</p>
            </div>

            {/* Key Concepts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔑</span>
                <h2 className="text-base font-bold text-gray-900">{isAr ? 'المفاهيم الرئيسية' : 'Key Concepts'}</h2>
                <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full ml-auto font-medium">
                  {t(loc, 'course.click_deeper')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.keyConcepts.map((kc) => (
                  <div key={kc.term} className={`rounded-xl p-4 border ${course.lightBg} ${course.borderColor}`}>
                    <p className={`text-sm font-bold mb-1 ${course.textColor}`}>{kc.term}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{kc.definition}</p>
                    <GoDeeperPanel
                      sectionType="concept"
                      content={{ term: kc.term, definition: kc.definition }}
                      lessonTitle={lesson.title}
                      domain={course.shortTitle}
                      framework={framework} language={language}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Dive */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔍</span>
                <h2 className="text-base font-bold text-gray-900">{t(loc, 'course.deep_dive')}</h2>
                <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full ml-auto font-medium">
                  {isAr ? 'كل قسم قابل للتوسع' : 'Each section expandable'}
                </span>
              </div>
              <div className="space-y-6">
                {lesson.deepDive.map((section, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3">
                      <div className={`w-1 rounded-full self-stretch min-h-[1.5rem] bg-gradient-to-b ${course.gradient}`} />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{section.heading}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                        <GoDeeperPanel
                          sectionType="deepdive"
                          content={{ heading: section.heading, content: section.content }}
                          lessonTitle={lesson.title}
                          domain={course.shortTitle}
                          framework={framework} language={language}
                        />
                      </div>
                    </div>
                    {i < lesson.deepDive.length - 1 && (
                      <div className="border-b border-gray-50 mt-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🎯</span>
                <h2 className="text-base font-bold text-gray-900">{t(loc, 'course.exam_tips_section')}</h2>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full ml-auto">{isAr ? 'قيمة عالية' : 'High Value'}</span>
              </div>
              <div className="space-y-3">
                {lesson.examTips.map((tip, i) => (
                  <div key={i} className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-sm flex-shrink-0 mt-0.5">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                        <GoDeeperPanel
                          sectionType="tip"
                          content={tip}
                          lessonTitle={lesson.title}
                          domain={course.shortTitle}
                          framework={framework} language={language}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rita's Insight */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  R
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-900">{t(loc, 'course.rita_insight')}</p>
                  <p className="text-xs text-purple-500">
                    {isAr ? (isV8 ? 'من كتاب تحضير اختبار PMP — أحث إصدار' : 'من كتاب تحضير اختبار PMP') : (isV8 ? 'From PMP Exam Prep — Latest Edition' : 'From PMP Exam Prep')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-purple-900 leading-relaxed italic">
                &ldquo;{lesson.ritaInsight}&rdquo;
              </p>
              <GoDeeperPanel
                sectionType="rita"
                content={lesson.ritaInsight}
                lessonTitle={lesson.title}
                domain={course.shortTitle}
                framework={framework} language={language}
              />
            </div>

            {/* Common Pitfalls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚠️</span>
                <h2 className="text-base font-bold text-gray-900">{t(loc, 'course.common_pitfalls')}</h2>
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full ml-auto">{isAr ? 'تجنّب هذه' : 'Avoid These'}</span>
              </div>
              <div className="space-y-3">
                {lesson.commonPitfalls.map((pitfall, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-sm flex-shrink-0 mt-0.5">✗</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{pitfall}</p>
                        <GoDeeperPanel
                          sectionType="pitfall"
                          content={pitfall}
                          lessonTitle={lesson.title}
                          domain={course.shortTitle}
                          framework={framework} language={language}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Bar */}
            <div className={`rounded-2xl bg-gradient-to-r ${course.gradient} p-5`}>
              <p className="text-white font-bold text-base mb-1">{isAr ? 'مستعد لاختبار معرفتك؟' : 'Ready to test your knowledge?'}</p>
              <p className="text-white/70 text-sm mb-4">
                {isAr ? `تمرّن على أسئلة من مجال ${course.shortTitle} لتعزيز ما تعلمته.` : `Practice questions from the ${course.shortTitle} domain to reinforce what you just learned.`}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/practice?domain=${encodeURIComponent(course.shortTitle)}`}
                  className="bg-white text-gray-900 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {isAr ? '🎯 تدرّب على هذا المجال' : '🎯 Practice This Domain'}
                </Link>
                <Link
                  href={`/dashboard/tutor?topic=${encodeURIComponent(
                    isAr
                      ? `اشرح ${lesson.title} بعمق مع أمثلة مركزة على الاختبار وأنماط الأسئلة المتوقعة في اختبار PMP.`
                      : `Explain ${lesson.title} in depth with exam-focused examples and question patterns I should expect on the PMP exam.`
                  )}`}
                  className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors"
                >
                  {isAr ? '🤖 ناقش مع AiTuTorZ' : '🤖 Discuss with AiTuTorZ'}
                </Link>
                <Link
                  href="/dashboard/mindmap"
                  className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors"
                >
                  {isAr ? '🗺️ عرض الخريطة الذهنية' : '🗺️ View Mind Map'}
                </Link>
              </div>
            </div>

            {/* Prev / Next */}
            <div className="grid grid-cols-2 gap-4">
              {prevLesson ? (
                <Link href={`/dashboard/course/${course.slug}/${prevLesson.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group text-left">
                  <p className="text-xs text-gray-400 mb-1">{isAr ? 'السابق →' : '← Previous'}</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">{prevLesson.title}</p>
                </Link>
              ) : <div />}
              {nextLesson ? (
                <Link href={`/dashboard/course/${course.slug}/${nextLesson.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group text-right">
                  <p className="text-xs text-gray-400 mb-1">{isAr ? '← التالي' : 'Next →'}</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">{nextLesson.title}</p>
                </Link>
              ) : (
                <Link href={`/dashboard/course/${course.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group text-right">
                  <p className="text-xs text-gray-400 mb-1">{isAr ? '✓ اكتمل المجال' : '✓ Domain Complete'}</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">{isAr ? `العودة إلى ${course.shortTitle}` : `Back to ${course.shortTitle}`}</p>
                </Link>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm sticky top-20">
              <div className="flex items-center gap-2 mb-3">
                <span>{course.icon}</span>
                <h3 className="text-sm font-bold text-gray-900">{course.shortTitle}</h3>
              </div>
              <div className="space-y-1">
                {course.lessons.map((l, i) => (
                  <Link key={l.slug} href={`/dashboard/course/${course.slug}/${l.slug}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                      l.slug === lesson.slug ? `${course.badgeColor} font-bold` : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      l.slug === lesson.slug ? course.badgeColor : 'bg-gray-100 text-gray-500'
                    }`}>{i + 1}</span>
                    <span className="truncate">{l.title}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <Link href="/dashboard/course" className="text-xs text-violet-600 font-medium hover:underline">
                  {isAr ? 'جميع المجالات →' : '← All Domains'}
                </Link>
              </div>
            </div>

            {/* Go Deeper hint */}
            <div className={`rounded-2xl border p-4 ${isV8 ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100' : 'bg-gradient-to-br from-violet-50 to-violet-50 border-violet-100'}`}>
              <p className={`text-xs font-bold mb-1 ${isV8 ? 'text-purple-800' : 'text-violet-800'}`}>
                ✨ {t(loc, 'deeper.go_deeper')} {isV8 ? '(PMBOK 8 Mode)' : ''}
              </p>
              <p className={`text-xs leading-relaxed ${isV8 ? 'text-purple-600' : 'text-violet-600'}`}>
                {isAr ? '' : 'Click any '}<strong>{t(loc, 'deeper.go_deeper')}</strong> {isAr ? '— تحليل بالذكاء الاصطناعي ودراسات حالة مبنية على' : 'button for AI-generated exam scenarios, case studies, and deeper analysis — grounded in'} <strong>{frameworkLabel}</strong>{isV8 ? ', including evolution notes from PMBOK 7' : ''}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}