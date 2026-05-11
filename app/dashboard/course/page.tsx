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
  type DashboardCurriculumSection,
} from '@/lib/pmp/curriculum-paths'

type LearningStep = {
  key: string
  label: string
  description: string
  cta: string
}

type GuidedPhase = {
  id: string
  number: string
  title: string
  subtitle: string
  promise: string
  sections: DashboardCurriculumSection[]
  supportLinks: Array<{
    label: string
    href: string
  }>
}

function localized(copy: Record<AppLocale, string>, locale: AppLocale) {
  return copy[locale] ?? copy.en
}

function formatHours(hours: number, isArabic: boolean) {
  const value = Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
  return isArabic ? `${value} س` : `${value}h`
}

function sectionMatches(section: DashboardCurriculumSection, terms: string[]) {
  const haystack = `${section.id} ${section.title.en} ${section.description.en}`.toLowerCase()
  return terms.some((term) => haystack.includes(term))
}

function uniqueSections(sections: DashboardCurriculumSection[]) {
  const seen = new Set<string>()
  return sections.filter((section) => {
    if (seen.has(section.id)) return false
    seen.add(section.id)
    return true
  })
}

function currentLearningStep(progress: number, isArabic: boolean): LearningStep {
  const steps = isArabic
    ? [
        {
          key: 'preview',
          label: 'معاينة',
          description: 'افهم ما يجب إتقانه قبل الدخول في التفاصيل.',
          cta: 'ابدأ المعاينة',
        },
        {
          key: 'learn',
          label: 'تعلّم',
          description: 'ادرس درسًا قصيرًا ومركزًا مرتبطًا بالاختبار.',
          cta: 'تابع التعلم',
        },
        {
          key: 'visualize',
          label: 'تصوّر',
          description: 'اربط المفهوم بالخريطة الذهنية أو العلاقات العملية.',
          cta: 'تصوّر المفهوم',
        },
        {
          key: 'apply',
          label: 'طبّق',
          description: 'حوّل المفهوم إلى موقف PMP واقعي.',
          cta: 'طبّق على سيناريو',
        },
        {
          key: 'practice',
          label: 'تمرّن',
          description: 'اختبر فهمك بأسئلة قصيرة موجهة.',
          cta: 'انتقل إلى التمرين',
        },
        {
          key: 'explain',
          label: 'اشرح',
          description: 'راجع تفسير الإجابة ونمط التفكير الصحيح.',
          cta: 'راجع مع المدرب',
        },
        {
          key: 'review',
          label: 'راجع',
          description: 'ثبّت نقطة الضعف واحفظها للمراجعة.',
          cta: 'احفظ وراجع',
        },
      ]
    : [
        {
          key: 'preview',
          label: 'Preview',
          description: 'Understand what must be mastered before going deeper.',
          cta: 'Start Preview',
        },
        {
          key: 'learn',
          label: 'Learn',
          description: 'Study one short, focused exam-relevant lesson.',
          cta: 'Continue Learning',
        },
        {
          key: 'visualize',
          label: 'Visualize',
          description: 'Connect the concept to a mind map or process relationship.',
          cta: 'Visualize Concept',
        },
        {
          key: 'apply',
          label: 'Apply',
          description: 'Turn the concept into a realistic PMP scenario.',
          cta: 'Apply Scenario',
        },
        {
          key: 'practice',
          label: 'Practice',
          description: 'Test understanding with a short guided question set.',
          cta: 'Continue to Practice',
        },
        {
          key: 'explain',
          label: 'Explain',
          description: 'Review the answer logic and PMP mindset.',
          cta: 'Review with AI Coach',
        },
        {
          key: 'review',
          label: 'Review',
          description: 'Save the weak point and consolidate it for retrieval.',
          cta: 'Save and Review',
        },
      ]

  if (progress >= 100) return steps[6]
  if (progress >= 85) return steps[6]
  if (progress >= 70) return steps[5]
  if (progress >= 55) return steps[4]
  if (progress >= 40) return steps[3]
  if (progress >= 25) return steps[2]
  if (progress >= 10) return steps[1]
  return steps[0]
}

function nextActionHref(module: DashboardCurriculumModule, step: LearningStep) {
  const topic = encodeURIComponent(module.title.en)

  if (step.key === 'practice') return '/dashboard/practice'
  if (step.key === 'explain') return `/dashboard/tutor?topic=${topic}`
  if (step.key === 'review') return '/dashboard/study-studio'
  if (step.key === 'visualize') return '/dashboard/mindmap'
  if (step.key === 'apply') return `/dashboard/tutor?topic=${topic}`

  return module.slug ? `/dashboard/course/${module.slug}` : `/dashboard/tutor?topic=${topic}`
}

function buildGuidedPhases(
  sections: DashboardCurriculumSection[],
  isArabic: boolean
): GuidedPhase[] {
  const foundationSections = sections.filter((section) =>
    sectionMatches(section, ['principle', 'foundation', 'mindset', 'focus', 'value', 'exam structure'])
  )

  const masterySections = sections.filter((section) =>
    sectionMatches(section, ['eco', 'people', 'process', 'business', 'exam domain'])
  )

  const integrationSections = sections.filter((section) =>
    sectionMatches(section, ['performance', 'tool', 'artifact', 'formula', 'process', 'scenario'])
  )

  const usedIds = new Set([
    ...foundationSections.map((section) => section.id),
    ...masterySections.map((section) => section.id),
    ...integrationSections.map((section) => section.id),
  ])

  const remainingSections = sections.filter((section) => !usedIds.has(section.id))

  const safeFoundation = foundationSections.length > 0 ? foundationSections : sections.slice(0, 1)
  const safeMastery =
    masterySections.length > 0
      ? masterySections
      : sections.length > 1
        ? sections.slice(1, 2)
        : []
  const safeIntegration =
    integrationSections.length > 0
      ? integrationSections
      : sections.length > 2
        ? sections.slice(2)
        : remainingSections

  return [
    {
      id: 'foundation',
      number: '01',
      title: isArabic ? 'مرحلة التأسيس' : 'Foundation Phase',
      subtitle: isArabic
        ? 'بناء عقلية PMP وفهم هيكل الاختبار قبل التوسع.'
        : 'Build PMP mindset and exam structure before going deeper.',
      promise: isArabic
        ? 'الهدف: أن يعرف المتعلم كيف يفكر اختبار PMP وما الذي يجب إتقانه أولًا.'
        : 'Goal: understand how the PMP exam thinks and what must be mastered first.',
      sections: uniqueSections(safeFoundation),
      supportLinks: [
        { label: isArabic ? 'الخريطة الذهنية' : 'Mind Map', href: '/dashboard/mindmap' },
      ],
    },
    {
      id: 'mastery',
      number: '02',
      title: isArabic ? 'مرحلة الإتقان' : 'Mastery Phase',
      subtitle: isArabic
        ? 'إتقان مجالات الاختبار الأساسية وربطها بأسئلة واقعية.'
        : 'Master the core exam domains and connect them to real scenarios.',
      promise: isArabic
        ? 'الهدف: تحويل المعرفة إلى قدرة على اختيار القرار الصحيح في مواقف PMP.'
        : 'Goal: turn knowledge into the ability to choose the right PMP decision.',
      sections: uniqueSections(safeMastery),
      supportLinks: [
        { label: isArabic ? 'مختبر التمرين' : 'Practice Lab', href: '/dashboard/practice' },
      ],
    },
    {
      id: 'integration',
      number: '03',
      title: isArabic ? 'مرحلة الدمج' : 'Integration Phase',
      subtitle: isArabic
        ? 'ربط المجالات بالأدوات والعمليات والسيناريوهات.'
        : 'Connect domains with tools, processes, artifacts, and scenarios.',
      promise: isArabic
        ? 'الهدف: منع التعلم المجزأ وبناء فهم مترابط قابل للتطبيق.'
        : 'Goal: avoid fragmented learning and build applied, connected understanding.',
      sections: uniqueSections(safeIntegration),
      supportLinks: [
        { label: isArabic ? 'العمليات' : 'Processes', href: '/dashboard/processes' },
        { label: isArabic ? 'المخرجات' : 'Artifacts', href: '/dashboard/artifacts' },
        { label: isArabic ? 'المعادلات' : 'Formulas', href: '/dashboard/formulas' },
      ],
    },
    {
      id: 'simulation',
      number: '04',
      title: isArabic ? 'مرحلة المحاكاة' : 'Simulation Phase',
      subtitle: isArabic
        ? 'الانتقال من التعلم إلى التدريب تحت ضغط الاختبار.'
        : 'Move from learning into exam-pressure rehearsal.',
      promise: isArabic
        ? 'الهدف: قياس الجاهزية وبناء خطة تعافي قبل الاختبار.'
        : 'Goal: measure readiness and build a recovery plan before the exam.',
      sections: [],
      supportLinks: [
        { label: isArabic ? 'محاكي الاختبار' : 'Exam Simulator', href: '/dashboard/exam' },
        { label: isArabic ? 'تقرير الجاهزية' : 'Readiness Report', href: '/dashboard/progress' },
      ],
    },
  ]
}

function phaseProgress(phase: GuidedPhase) {
  const modules = phase.sections.flatMap((section) => section.modules)
  if (modules.length === 0) return 0

  return Math.round(
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length
  )
}

function findNextModule(phases: GuidedPhase[]) {
  for (const phase of phases) {
    for (const section of phase.sections) {
      for (const module of section.modules) {
        if (module.progress < 100) return { phase, section, module }
      }
    }
  }

  const firstPhase = phases[0]
  const firstSection = firstPhase?.sections[0]
  const firstModule = firstSection?.modules[0]

  if (!firstPhase || !firstSection || !firstModule) return null

  return { phase: firstPhase, section: firstSection, module: firstModule }
}

function readinessLabel(progress: number, isArabic: boolean) {
  if (progress >= 85) return isArabic ? 'جاهزية قوية' : 'Strong readiness'
  if (progress >= 60) return isArabic ? 'جاهزية نامية' : 'Growing readiness'
  if (progress >= 30) return isArabic ? 'بحاجة إلى تثبيت' : 'Needs consolidation'
  return isArabic ? 'بداية المسار' : 'Starting point'
}

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('pmp_locale')?.value

  let language: AppLocale = cookieLocale === 'ar' ? 'ar' : 'en'
  let activeFramework = normalizeExamPath(undefined)

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('language, active_framework')
      .eq('id', user.id)
      .single()

    if (cookieLocale !== 'ar' && cookieLocale !== 'en' && profile?.language === 'ar') {
      language = 'ar'
    }

    activeFramework = normalizeExamPath(profile?.active_framework)
  }

  const isArabic = language === 'ar'
  const locale: AppLocale = isArabic ? 'ar' : 'en'
  const curriculum = getDashboardCurriculum(activeFramework)
  const activePathCopy = getExamPathCopy(activeFramework, locale)
  const activePathColor = EXAM_PATHS[activeFramework].color
  const phases = buildGuidedPhases(curriculum.sections, isArabic)
  const allModules = phases.flatMap((phase) =>
    phase.sections.flatMap((section) => section.modules)
  )
  const overallProgress = Math.round(
    allModules.reduce((sum, module) => sum + module.progress, 0) /
    Math.max(allModules.length, 1)
  )
  const next = findNextModule(phases)
  const nextStep = next ? currentLearningStep(next.module.progress, isArabic) : null
  const nextHref = next && nextStep ? nextActionHref(next.module, nextStep) : '/dashboard/practice'

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="border-b border-gray-100 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-500">
                {isArabic ? 'مسار التعلم الموجّه' : 'Guided Learning Journey'}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                {isArabic ? 'مساري في PMP' : 'My PMP Path'}
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {isArabic
                  ? 'هذه الصفحة هي نقطة انطلاق التعلم. اتبع مرحلة واحدة، وحدة واحدة، وخطوة واحدة في كل مرة حتى تتحول الدراسة إلى جاهزية اختبارية.'
                  : 'This is the learning starting point. Follow one phase, one module, and one next action at a time until study becomes exam readiness.'}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
              <p className="text-xs font-bold text-gray-400">
                {isArabic ? 'المسار النشط' : 'Active Exam Path'}
              </p>
              <p className="mt-1 text-sm font-black" style={{ color: activePathColor }}>
                {activePathCopy.shortLabel}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {readinessLabel(overallProgress, isArabic)} · {overallProgress}%
              </p>
            </div>
          </div>

          <ExamPathSelector initialPath={activeFramework} locale={locale} />

          <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-6">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-500">
                  {isArabic ? 'أفضل خطوة الآن' : 'Best Next Action'}
                </p>
                <h2 className="mt-3 text-2xl font-black text-gray-950">
                  {next
                    ? isArabic
                      ? `ابدأ: ${localized(next.module.title, locale)}`
                      : `Start: ${localized(next.module.title, locale)}`
                    : isArabic
                      ? 'ابدأ من مختبر التمرين'
                      : 'Start with Practice Lab'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                  {nextStep
                    ? nextStep.description
                    : isArabic
                      ? 'ابدأ بقياس سريع حتى يوصي النظام بخطوة تعلم مناسبة.'
                      : 'Start with a quick practice baseline so the system can recommend the right learning step.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400">
                  {isArabic ? 'الخطوة الحالية' : 'Current Step'}
                </p>
                <p className="mt-2 text-xl font-black text-gray-950">
                  {nextStep?.label ?? (isArabic ? 'تدريب' : 'Practice')}
                </p>
                <Link
                  href={nextHref}
                  className="mt-4 inline-flex w-full justify-center rounded-xl px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
                  style={{ backgroundColor: activePathColor }}
                >
                  {nextStep?.cta ?? (isArabic ? 'ابدأ الآن' : 'Start Now')}
                </Link>
              </div>
            </div>
          </section>

          <nav className="grid gap-3 md:grid-cols-4">
            {phases.map((phase) => (
              <Link
                key={phase.id}
                href={`#phase-${phase.id}`}
                className="rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm"
              >
                <p className="text-xs font-black text-violet-500">{phase.number}</p>
                <p className="mt-2 text-sm font-black text-gray-950">{phase.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{phase.subtitle}</p>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-8">
        {phases.map((phase) => {
          const progress = phaseProgress(phase)
          const modules = phase.sections.flatMap((section) => section.modules)

          return (
            <section key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-8">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
                      style={{ backgroundColor: activePathColor }}
                    >
                      {phase.number}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-950">{phase.title}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                        {phase.promise}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[150px] rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs font-semibold text-gray-400">
                      {isArabic ? 'تقدم المرحلة' : 'Phase Progress'}
                    </p>
                    <p className="mt-1 text-xl font-black text-gray-950">{progress}%</p>
                  </div>
                </div>

                {phase.supportLinks.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {phase.supportLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-violet-300 hover:text-violet-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {modules.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {phase.sections.map((section) => (
                      <div key={section.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-4">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                            {localized(section.title, locale)}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            {localized(section.description, locale)}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {section.modules.map((module) => {
                            const step = currentLearningStep(module.progress, isArabic)
                            const href = nextActionHref(module, step)
                            const title = localized(module.title, locale)
                            const description = localized(module.description, locale)

                            return (
                              <article
                                key={`${section.id}-${module.id}`}
                                className="rounded-2xl border border-gray-100 bg-white p-5"
                              >
                                <div className="grid gap-4 lg:grid-cols-[1fr_210px] lg:items-center">
                                  <div>
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                      <span
                                        className="rounded-full px-3 py-1 text-xs font-black text-white"
                                        style={{ backgroundColor: module.color }}
                                      >
                                        {module.numberLabel ?? module.id}
                                      </span>
                                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                                        {module.lessons} {isArabic ? 'دروس' : 'lessons'} · {formatHours(module.hours, isArabic)}
                                      </span>
                                      {module.domain && (
                                        <span
                                          className="rounded-full px-3 py-1 text-xs font-bold"
                                          style={{ backgroundColor: module.color + '12', color: module.color }}
                                        >
                                          {localized(module.domain, locale)}
                                        </span>
                                      )}
                                    </div>

                                    <h3 className="text-lg font-black leading-tight text-gray-950">
                                      {title}
                                    </h3>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                                      {description}
                                    </p>

                                    <div className="mt-4">
                                      <div className="mb-2 flex items-center justify-between text-xs">
                                        <span className="font-bold text-gray-500">
                                          {isArabic ? 'تقدم الوحدة' : 'Module Progress'}
                                        </span>
                                        <span className="font-black" style={{ color: module.color }}>
                                          {module.progress}%
                                        </span>
                                      </div>
                                      <div className="h-2 rounded-full bg-gray-100">
                                        <div
                                          className="h-2 rounded-full"
                                          style={{ width: `${module.progress}%`, backgroundColor: module.color }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                      {isArabic ? 'الخطوة الحالية' : 'Current Step'}
                                    </p>
                                    <p className="mt-2 text-base font-black text-gray-950">
                                      {step.label}
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                      {step.description}
                                    </p>
                                    <Link
                                      href={href}
                                      className="mt-4 inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-xs font-black text-white transition hover:opacity-90"
                                      style={{ backgroundColor: module.color }}
                                    >
                                      {step.cta}
                                    </Link>
                                  </div>
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                      {
                        title: isArabic ? 'اختبار قصير' : 'Checkpoint mock',
                        description: isArabic
                          ? 'ابدأ بمحاكاة قصيرة لقياس الجاهزية.'
                          : 'Start with a short mock to measure readiness.',
                        href: '/dashboard/exam',
                      },
                      {
                        title: isArabic ? 'محاكاة كاملة' : 'Full simulation',
                        description: isArabic
                          ? 'تدرّب تحت ضغط الوقت قبل الاختبار.'
                          : 'Train under time pressure before exam day.',
                        href: '/dashboard/exam',
                      },
                      {
                        title: isArabic ? 'خطة التعافي' : 'Recovery plan',
                        description: isArabic
                          ? 'راجع تقرير الجاهزية ونقاط الضعف.'
                          : 'Review readiness and weak areas.',
                        href: '/dashboard/progress',
                      },
                    ].map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:bg-white hover:shadow-sm"
                      >
                        <h3 className="text-base font-black text-gray-950">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
