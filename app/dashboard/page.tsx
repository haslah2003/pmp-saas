import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ExamPathSelector from "@/components/ExamPathSelector";
import { EXAM_PATHS, getExamPathCopy, normalizeExamPath, type AppLocale } from "@/lib/pmp/exam-paths";
import { getDashboardCurriculum, type DashboardCurriculumModule } from "@/lib/pmp/curriculum-paths";

// ── SVG Illustration Components ─────────────────────────────────────────────
// Unique inline illustrations for each domain — no external dependencies

function IllustrationFoundations({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="15" y="55" width="30" height="35" rx="3" fill={color} opacity="0.25" />
      <rect x="50" y="35" width="25" height="55" rx="3" fill={color} opacity="0.4" />
      <rect x="80" y="45" width="25" height="45" rx="3" fill={color} opacity="0.3" />
      <rect x="22" y="62" width="16" height="10" rx="2" fill="white" opacity="0.7" />
      <rect x="55" y="42" width="15" height="10" rx="2" fill="white" opacity="0.7" />
      <rect x="85" y="52" width="15" height="10" rx="2" fill="white" opacity="0.7" />
      <path d="M10 90 L110 90" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="30" cy="30" r="12" fill={color} opacity="0.15" />
      <path d="M25 30 L30 25 L35 30" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M30 25 L30 35" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IllustrationStakeholders({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="35" cy="35" r="12" fill={color} opacity="0.3" />
      <circle cx="35" cy="28" r="5" fill={color} opacity="0.5" />
      <path d="M25 42 C25 37, 45 37, 45 42" fill={color} opacity="0.4" />
      <circle cx="85" cy="35" r="12" fill={color} opacity="0.3" />
      <circle cx="85" cy="28" r="5" fill={color} opacity="0.5" />
      <path d="M75 42 C75 37, 95 37, 95 42" fill={color} opacity="0.4" />
      <circle cx="60" cy="65" r="12" fill={color} opacity="0.3" />
      <circle cx="60" cy="58" r="5" fill={color} opacity="0.5" />
      <path d="M50 72 C50 67, 70 67, 70 72" fill={color} opacity="0.4" />
      <path d="M42 38 L53 58" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      <path d="M78 38 L67 58" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      <path d="M45 32 L75 32" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  );
}

function IllustrationTeam({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="45" r="8" fill={color} opacity="0.2" />
      <circle cx="60" cy="38" r="10" fill={color} opacity="0.3" />
      <circle cx="80" cy="45" r="8" fill={color} opacity="0.2" />
      <circle cx="40" cy="39" r="4" fill={color} opacity="0.5" />
      <circle cx="60" cy="31" r="5" fill={color} opacity="0.5" />
      <circle cx="80" cy="39" r="4" fill={color} opacity="0.5" />
      <path d="M30 52 C30 48, 50 48, 50 52" fill={color} opacity="0.35" />
      <path d="M48 48 C48 42, 72 42, 72 48" fill={color} opacity="0.45" />
      <path d="M70 52 C70 48, 90 48, 90 52" fill={color} opacity="0.35" />
      <rect x="25" y="62" width="70" height="22" rx="11" fill={color} opacity="0.1" />
      <path d="M40 73 L55 68 L70 76 L85 65" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function IllustrationDevApproach({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="60" cy="50" r="28" stroke={color} strokeWidth="2" opacity="0.2" strokeDasharray="4 4" />
      <circle cx="60" cy="50" r="18" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="60" cy="50" r="6" fill={color} opacity="0.5" />
      <path d="M60 22 L65 28 L55 28 Z" fill={color} opacity="0.4" />
      <path d="M88 50 L82 55 L82 45 Z" fill={color} opacity="0.4" />
      <path d="M60 78 L55 72 L65 72 Z" fill={color} opacity="0.4" />
      <path d="M32 50 L38 45 L38 55 Z" fill={color} opacity="0.4" />
    </svg>
  );
}

function IllustrationPlanning({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="15" y="20" width="90" height="65" rx="6" fill={color} opacity="0.1" />
      <rect x="15" y="20" width="90" height="16" rx="6" fill={color} opacity="0.25" />
      <rect x="22" y="42" width="20" height="6" rx="3" fill={color} opacity="0.35" />
      <rect x="22" y="54" width="35" height="6" rx="3" fill={color} opacity="0.25" />
      <rect x="22" y="66" width="15" height="6" rx="3" fill={color} opacity="0.2" />
      <rect x="65" y="42" width="30" height="6" rx="3" fill={color} opacity="0.15" />
      <rect x="65" y="54" width="20" height="6" rx="3" fill={color} opacity="0.3" />
      <rect x="65" y="66" width="28" height="6" rx="3" fill={color} opacity="0.2" />
      <circle cx="22" cy="27" r="3" fill="white" opacity="0.6" />
      <circle cx="32" cy="27" r="3" fill="white" opacity="0.6" />
      <circle cx="42" cy="27" r="3" fill="white" opacity="0.6" />
    </svg>
  );
}

function IllustrationProjectWork({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="45" cy="50" r="18" stroke={color} strokeWidth="3" opacity="0.2" />
      <circle cx="75" cy="50" r="18" stroke={color} strokeWidth="3" opacity="0.2" />
      <circle cx="45" cy="50" r="4" fill={color} opacity="0.4" />
      <circle cx="75" cy="50" r="4" fill={color} opacity="0.4" />
      <path d="M45 32 L45 28 L50 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M75 32 L75 28 L80 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <rect x="55" y="44" width="10" height="12" rx="2" fill={color} opacity="0.3" />
      <path d="M20 80 L40 80 L50 75 L70 85 L80 80 L100 80" stroke={color} strokeWidth="1.5" opacity="0.25" />
    </svg>
  );
}

function IllustrationMeasurement({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="18" y="75" width="14" height="12" rx="2" fill={color} opacity="0.3" />
      <rect x="38" y="55" width="14" height="32" rx="2" fill={color} opacity="0.4" />
      <rect x="58" y="40" width="14" height="47" rx="2" fill={color} opacity="0.3" />
      <rect x="78" y="28" width="14" height="59" rx="2" fill={color} opacity="0.5" />
      <path d="M15 87 L105 87" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <path d="M22 72 L42 52 L62 37 L82 25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" opacity="0.35" />
      <circle cx="82" cy="25" r="4" fill={color} opacity="0.4" />
    </svg>
  );
}

function IllustrationUncertainty({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="60" cy="50" r="28" stroke={color} strokeWidth="1.5" opacity="0.15" />
      <circle cx="60" cy="50" r="18" stroke={color} strokeWidth="1.5" opacity="0.25" />
      <circle cx="60" cy="50" r="10" stroke={color} strokeWidth="2" opacity="0.35" />
      <circle cx="60" cy="50" r="3" fill={color} opacity="0.5" />
      <path d="M60 22 L60 30" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M60 70 L60 80" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M30 50 L20 50" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M90 50 L100 50" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M60 50 L75 35" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <path d="M60 50 L50 62" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<number, React.FC<{ color: string }>> = {
  1: IllustrationFoundations,
  2: IllustrationStakeholders,
  3: IllustrationTeam,
  4: IllustrationDevApproach,
  5: IllustrationPlanning,
  6: IllustrationProjectWork,
  7: IllustrationMeasurement,
  8: IllustrationUncertainty,
};

// ── Dashboard Helpers ────────────────────────────────────────────────────────

function localized(copy: Record<AppLocale, string>, locale: AppLocale) {
  return copy[locale] ?? copy.en;
}

function dashboardDuration(hours: number, isArabic: boolean) {
  return isArabic ? `${hours} س` : `${hours}h`;
}

function dashboardLessonSummary(mod: DashboardCurriculumModule, isArabic: boolean) {
  if (isArabic) {
    return typeof mod.tasks === "number"
      ? `${mod.tasks} مهام · ${mod.lessons} دروس · ${dashboardDuration(mod.hours, true)}`
      : `${mod.lessons} دروس · ${dashboardDuration(mod.hours, true)}`;
  }

  return typeof mod.tasks === "number"
    ? `${mod.tasks} tasks · ${mod.lessons} lessons · ${dashboardDuration(mod.hours, false)}`
    : `${mod.lessons} lessons · ${dashboardDuration(mod.hours, false)}`;
}


function StatusBadge({ progress, isArabic }: { progress: number; isArabic: boolean }) {
  if (progress === 100) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">✓ {isArabic ? 'مكتمل' : 'Complete'}</span>
  );
  if (progress > 0) return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{isArabic ? 'قيد التقدم' : 'In Progress'}</span>
  );
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{isArabic ? 'لم يبدأ بعد' : 'Not Started'}</span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("language, active_framework")
    .eq("id", user.id)
    .single();

  const isArabic = profile?.language === "ar";
  const locale: AppLocale = isArabic ? "ar" : "en";
  const activeFramework = normalizeExamPath(profile?.active_framework);
  const activePathCopy = getExamPathCopy(activeFramework, locale);
  const activePathColor = EXAM_PATHS[activeFramework].color;
  const curriculum = getDashboardCurriculum(activeFramework);
  const curriculumModules = curriculum.sections.flatMap((section) => section.modules);

  const overallProgress = Math.round(
    curriculumModules.reduce((sum, module) => sum + module.progress, 0) /
    Math.max(curriculumModules.length, 1)
  );

  const nextModuleTitle = isArabic ? "ماهية عقلية محترف إدارة المشاريع" : "What the PMP mindset is";
  const nextModuleHref = `/dashboard/path/pmbok8-eco2026-F1/pmbok8-eco2026-F1.L1/preview?lang=${locale}`;

  const missionTasks = [
    {
      href: nextModuleHref,
      icon: "🧭",
      title: isArabic ? "تابع مسارك التعليمي" : "Continue My PMP Path",
      description: isArabic ? `أكمل: ${nextModuleTitle}` : `Complete: ${nextModuleTitle}`,
    },
    {
      href: "/dashboard/practice",
      icon: "✏️",
      title: isArabic ? "تدرّب بذكاء" : "Practice in the Lab",
      description: isArabic ? "ابدأ مجموعة قصيرة لاكتشاف نقاط الضعف." : "Start a focused set to expose weak signals.",
    },
    {
      href: "/dashboard/progress",
      icon: "📈",
      title: isArabic ? "راجع الجاهزية" : "Review Readiness",
      description: isArabic ? "افتح تقرير التقدم بعد التدريب." : "Open your readiness report after practice.",
    },
  ];

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={`space-y-8 ${isArabic ? "text-right" : ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isArabic ? "مهمة PMP اليوم" : "Your PMP Mission Today"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic
              ? "مركزك اليومي لمعرفة الخطوة التالية في رحلتك نحو جاهزية اختبار PMP."
              : "Your daily command center for the next best action toward PMP exam readiness."}
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={{
              borderColor: activePathColor + "33",
              backgroundColor: activePathColor + "10",
              color: activePathColor,
            }}
          >
            <span className="text-gray-500">{isArabic ? "مسار اختبار PMP" : "PMP Exam Path"}</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-60" aria-hidden="true" />
            <span>{activePathCopy.shortLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-gray-400">{isArabic ? "تقدم المسار" : "Path Progress"}</p>
            <p className="text-xl font-bold text-gray-900">{overallProgress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#3b82f6 ${overallProgress * 3.6}deg, #e5e7eb 0deg)` }}>
            <div className="w-8 h-8 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <ExamPathSelector initialPath={activeFramework} locale={locale} />

      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">
                {isArabic ? "مركز المهمة" : "Mission Control"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950">
                {isArabic ? "ما هي أفضل خطوة الآن؟" : "What is the best next action now?"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                {isArabic
                  ? "يعرض AiTuTorZ الآن مسار تعلمك كرحلة موجهة: تعلّم، طبّق، تدرّب، راجع، ثم عالج نقاط الضعف."
                  : "AiTuTorZ now treats your study as a guided mastery journey: learn, apply, practice, review, then repair weak areas."}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 border border-white px-4 py-3 shadow-sm min-w-[150px]">
              <p className="text-xs font-semibold text-gray-400">{isArabic ? "المسار الحالي" : "Current Path"}</p>
              <p className="mt-1 text-sm font-black" style={{ color: activePathColor }}>
                {activePathCopy.shortLabel}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-violet-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {isArabic ? "مهمة اليوم" : "Today’s Mission"}
            </p>
            <h3 className="mt-2 text-lg font-black text-gray-900">
              {isArabic ? `أكمل: ${nextModuleTitle}` : `Complete: ${nextModuleTitle}`}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {isArabic
                ? "بعد التعلم، انتقل مباشرة إلى مختبر التمرين حتى تتحول المعرفة إلى جاهزية اختبارية."
                : "After learning, move directly into Practice Lab so knowledge becomes exam-ready performance."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={nextModuleHref}
                className="rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
                style={{ backgroundColor: activePathColor }}
              >
                {isArabic ? "ابدأ مهمة اليوم" : "Start Today’s Mission"}
              </Link>
              <Link
                href="/dashboard/practice"
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                {isArabic ? "اذهب إلى مختبر التمرين" : "Go to Practice Lab"}
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
            {isArabic ? "PMP Exam GPS" : "PMP Exam GPS"}
          </p>
          <h2 className="mt-3 text-xl font-black text-gray-900">
            {isArabic ? "توقع الجاهزية" : "Readiness Forecast"}
          </h2>
          <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-sm font-bold text-amber-800">
              {isArabic ? "الخط الأساسي قيد التكوين" : "Baseline pending"}
            </p>
            <p className="mt-2 text-xs leading-5 text-amber-700">
              {isArabic
                ? "أكمل دورة تمرين من 15 سؤالًا حتى يتم إنشاء توقع مبني على الأداء الفعلي."
                : "Complete one 15-question practice cycle to generate an evidence-based forecast."}
            </p>
          </div>
          <Link
            href="/dashboard/progress"
            className="mt-5 inline-flex w-full justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition"
          >
            {isArabic ? "افتح تقرير الجاهزية" : "Open Readiness Report"}
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {missionTasks.map((task) => (
          <Link
            key={task.href}
            href={task.href}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition group"
          >
            <div className="text-3xl">{task.icon}</div>
            <h3 className="mt-3 text-sm font-black text-gray-900 group-hover:text-violet-700 transition">
              {task.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-gray-500">{task.description}</p>
          </Link>
        ))}
      </section>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
            {isArabic ? "خارطة الطريق" : "Roadmap"}
          </p>
          <h2 className="text-xl font-black text-gray-900">
            {isArabic ? "لمحة عن مساري في PMP" : "My PMP Path Snapshot"}
          </h2>
        </div>
        <Link href="/dashboard/path" className="text-sm font-bold text-violet-600 hover:text-violet-700">
          {isArabic ? "عرض المسار الكامل" : "View full path"}
        </Link>
      </div>

      {curriculum.sections.map((section, sectionIndex) => (
        <div key={section.id}>
          {sectionIndex > 0 && <div className="border-t border-gray-200 mb-8" />}

          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
              style={{ backgroundColor: section.badgeColor }}
            >
              {section.badge}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{localized(section.title, locale)}</h2>
              <p className="text-xs text-gray-500">{localized(section.description, locale)}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {section.modules.map((mod) => {
              const Illustration = ILLUSTRATIONS[mod.illustrationId ?? mod.id] || IllustrationFoundations;
              const title = localized(mod.title, locale);
              const description = localized(mod.description, locale);
              const domain = mod.domain ? localized(mod.domain, locale) : null;

              return (
                <Link
                  key={`${section.id}-${mod.id}`}
                  href="/dashboard/path"
                  className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                  style={{ borderColor: mod.progress > 0 ? mod.color : '#e5e7eb' }}
                >
                  <div
                    className="relative h-32 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: mod.color + '10' }}
                  >
                    {mod.emoji ? (
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-500 opacity-60">
                        {mod.emoji}
                      </div>
                    ) : (
                      <div className="w-32 h-full opacity-80 group-hover:scale-110 transition-transform duration-500">
                        <Illustration color={mod.color} />
                      </div>
                    )}

                    <div
                      className="absolute top-3 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      style={{ backgroundColor: mod.color, insetInlineStart: '0.75rem' }}
                    >
                      {mod.numberLabel ?? mod.id}
                    </div>

                    <div className="absolute top-3" style={{ insetInlineEnd: '0.75rem' }}>
                      <StatusBadge progress={mod.progress} isArabic={isArabic} />
                    </div>
                  </div>

                  <div className="p-5">
                    {domain && (
                      <span
                        className="mb-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold"
                        style={{ backgroundColor: mod.color + '12', color: mod.color }}
                      >
                        {domain}
                      </span>
                    )}

                    <h3
                      className="font-bold text-gray-900 text-sm leading-tight mb-1.5"
                      style={{ color: mod.progress > 0 && mod.progress < 100 ? mod.color : undefined }}
                    >
                      {title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>{dashboardLessonSummary(mod, isArabic)}</span>
                      <span className="font-semibold" style={{ color: mod.color }}>{mod.progress}%</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${mod.progress}%`, backgroundColor: mod.color }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}
