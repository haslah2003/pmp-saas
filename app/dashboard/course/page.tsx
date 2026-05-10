import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import ExamPathSelector from '@/components/ExamPathSelector'
import {
  EXAM_PATHS,
  getExamPathCopy,
  normalizeExamPath,
  type AppLocale,
} from '@/lib/pmp/exam-paths'
import {
  getDashboardCurriculum,
  type DashboardCurriculumModule,
} from '@/lib/pmp/curriculum-paths'

function localized(copy: Record<AppLocale, string>, locale: AppLocale) {
  return copy[locale] ?? copy.en
}

function formatHours(hours: number, isArabic: boolean) {
  const value = Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
  return isArabic ? `${value} س` : `${value}h`
}

function moduleHref(module: DashboardCurriculumModule) {
  return module.slug ? `/dashboard/course/${module.slug}` : '/dashboard/practice'
}

function primaryActionLabel(module: DashboardCurriculumModule, isArabic: boolean) {
  if (module.slug) return isArabic ? 'ابدأ الوحدة' : 'Start Unit'
  return isArabic ? 'تدرّب على هذا المجال' : 'Practice This Area'
}

function statusText(progress: number, isArabic: boolean) {
  if (progress >= 100) return isArabic ? 'مكتمل' : 'Complete'
  if (progress > 0) return isArabic ? 'قيد التقدم' : 'In Progress'
  return isArabic ? 'لم يبدأ بعد' : 'Not Started'
}

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('pmp_locale')?.value
  let language = cookieLocale === 'ar' ? 'ar' : 'en'
  let activeFramework = normalizeExamPath(undefined)

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('language, active_framework')
      .eq('id', user.id)
      .single()

    if (cookieLocale !== 'ar' && cookieLocale !== 'en' && profile?.language) {
      language = profile.language === 'ar' ? 'ar' : 'en'
    }

    activeFramework = normalizeExamPath(profile?.active_framework)
  }

  const isArabic = language === 'ar'
  const locale: AppLocale = isArabic ? 'ar' : 'en'
  const curriculum = getDashboardCurriculum(activeFramework)
  const activePathCopy = getExamPathCopy(activeFramework, locale)
  const activePathColor = EXAM_PATHS[activeFramework].color
  const curriculumModules = curriculum.sections.flatMap((section) => section.modules)
  const totalLessons = curriculumModules.reduce((sum, module) => sum + module.lessons, 0)
  const totalHours = curriculumModules.reduce((sum, module) => sum + module.hours, 0)
  const nextModule = curriculumModules.find((module) => module.progress < 100) ?? curriculumModules[0]
  const nextModuleTitle = nextModule ? localized(nextModule.title, locale) : activePathCopy.label
  const nextModuleHref = nextModule ? moduleHref(nextModule) : '/dashboard/practice'

  const learningFlow = isArabic
    ? ['معاينة', 'تعلّم', 'تمرّن', 'راجع']
    : ['Preview', 'Learn', 'Practice', 'Review']

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-500">
                {isArabic ? 'خارطة الجاهزية' : 'Guided Readiness Roadmap'}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                {isArabic ? 'مساري في PMP' : 'My PMP Path'}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                {isArabic
                  ? `مسار عملي موجّه حسب اختيارك الحالي: ${activePathCopy.shortLabel}. كل وحدة تقودك إلى تعلّم واضح، تدريب، ثم مراجعة الجاهزية.`
                  : `A focused, route-aware roadmap for your current path: ${activePathCopy.shortLabel}. Each unit moves you from learning to practice, then readiness review.`}
              </p>
            </div>

            <div
              className="rounded-2xl border px-5 py-4 shadow-sm"
              style={{
                borderColor: activePathColor + '33',
                backgroundColor: activePathColor + '08',
              }}
            >
              <p className="text-xs font-bold text-gray-400">
                {isArabic ? 'المسار النشط' : 'Active Exam Path'}
              </p>
              <p className="mt-1 text-sm font-black" style={{ color: activePathColor }}>
                {activePathCopy.shortLabel}
              </p>
            </div>
          </div>

          <ExamPathSelector initialPath={activeFramework} locale={locale} />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: isArabic ? 'الوحدات' : 'Units', value: curriculumModules.length },
              { label: isArabic ? 'الدروس' : 'Lessons', value: totalLessons },
              { label: isArabic ? 'زمن التعلم' : 'Study Time', value: formatHours(totalHours, isArabic) },
              { label: isArabic ? 'الخطوة التالية' : 'Next Action', value: isArabic ? 'واضحة' : 'Clear' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xl font-black text-gray-950">{item.value}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-500">
                  {isArabic ? 'أفضل خطوة الآن' : 'Best Next Action'}
                </p>
                <h2 className="mt-2 text-xl font-black text-gray-950">
                  {isArabic ? `ابدأ: ${nextModuleTitle}` : `Start: ${nextModuleTitle}`}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {isArabic
                    ? 'ابدأ بالوحدة التالية، ثم انتقل مباشرة إلى مختبر التمرين لتحويل المعرفة إلى أداء اختباري.'
                    : 'Start the next unit, then move into Practice Lab to convert knowledge into exam performance.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={nextModuleHref}
                  className="rounded-xl px-5 py-3 text-sm font-black text-white shadow-sm hover:opacity-90 transition"
                  style={{ backgroundColor: activePathColor }}
                >
                  {isArabic ? 'تابع المسار' : 'Continue Path'}
                </Link>
                <Link
                  href="/dashboard/practice"
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 hover:bg-gray-50 transition"
                >
                  {isArabic ? 'مختبر التمرين' : 'Practice Lab'}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {curriculum.sections.map((section, index) => (
              <Link
                key={section.id}
                href={`#section-${section.id}`}
                className="rounded-full border bg-white px-4 py-2 text-xs font-black text-gray-700 hover:border-violet-300 hover:text-violet-700 transition"
              >
                {index + 1}. {localized(section.title, locale)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {curriculum.sections.map((section, sectionIndex) => {
          const sectionProgress = Math.round(
            section.modules.reduce((sum, module) => sum + module.progress, 0) /
            Math.max(section.modules.length, 1)
          )

          return (
            <section key={section.id} id={`section-${section.id}`} className="scroll-mt-8">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
                    style={{ backgroundColor: section.badgeColor }}
                  >
                    {section.badge}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                      {isArabic ? `المرحلة ${sectionIndex + 1}` : `Phase ${sectionIndex + 1}`}
                    </p>
                    <h2 className="mt-1 text-xl font-black text-gray-950">
                      {localized(section.title, locale)}
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                      {localized(section.description, locale)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400">
                    {isArabic ? 'تقدم المرحلة' : 'Phase Progress'}
                  </p>
                  <p className="text-lg font-black text-gray-950">{sectionProgress}%</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {section.modules.map((module) => {
                  const title = localized(module.title, locale)
                  const description = localized(module.description, locale)
                  const domain = module.domain ? localized(module.domain, locale) : null
                  const href = moduleHref(module)

                  return (
                    <article
                      key={`${section.id}-${module.id}`}
                      className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="rounded-2xl px-3 py-2 text-xs font-black text-white"
                          style={{ backgroundColor: module.color }}
                        >
                          {module.numberLabel ?? module.id}
                        </div>

                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-bold"
                          style={{
                            backgroundColor: module.color + '12',
                            color: module.color,
                          }}
                        >
                          {statusText(module.progress, isArabic)}
                        </span>
                      </div>

                      <h3 className="mt-5 text-base font-black leading-tight text-gray-950">
                        {title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                        {description}
                      </p>

                      {domain && (
                        <p
                          className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: module.color + '10',
                            color: module.color,
                          }}
                        >
                          {domain}
                        </p>
                      )}

                      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-2xl bg-gray-50 p-3">
                          <p className="font-black text-gray-950">{module.lessons}</p>
                          <p className="mt-1 text-gray-500">{isArabic ? 'دروس' : 'Lessons'}</p>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-3">
                          <p className="font-black text-gray-950">{formatHours(module.hours, isArabic)}</p>
                          <p className="mt-1 text-gray-500">{isArabic ? 'وقت تقديري' : 'Estimated time'}</p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-500">
                            {isArabic ? 'التقدم' : 'Progress'}
                          </span>
                          <span className="font-black" style={{ color: module.color }}>
                            {module.progress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${module.progress}%`,
                              backgroundColor: module.color,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                          {isArabic ? 'تسلسل التعلم' : 'Learning Sequence'}
                        </p>
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {learningFlow.map((step, index) => (
                            <div key={step} className="rounded-xl bg-white px-2 py-2 text-center text-[11px] font-bold text-gray-600">
                              {index + 1}. {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={href}
                          className="rounded-xl px-4 py-2.5 text-xs font-black text-white hover:opacity-90 transition"
                          style={{ backgroundColor: module.color }}
                        >
                          {primaryActionLabel(module, isArabic)}
                        </Link>
                        <Link
                          href="/dashboard/practice"
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-50 transition"
                        >
                          {isArabic ? 'تمرّن' : 'Practice'}
                        </Link>
                        <Link
                          href={`/dashboard/tutor?topic=${encodeURIComponent(title)}`}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-50 transition"
                        >
                          {isArabic ? 'اسأل المدرب' : 'Ask Coach'}
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
