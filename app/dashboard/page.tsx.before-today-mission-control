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

function dashboardModuleHref(mod: DashboardCurriculumModule) {
  return mod.slug ? `/dashboard/course/${mod.slug}` : "/dashboard/course";
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

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={`space-y-8 ${isArabic ? "text-right" : ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{localized(curriculum.heroTitle, locale)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {localized(curriculum.heroDescription, locale)}
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
            <p className="text-xs text-gray-400">{isArabic ? "التقدم العام" : "Overall Progress"}</p>
            <p className="text-xl font-bold text-gray-900">{overallProgress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#3b82f6 ${overallProgress * 3.6}deg, #e5e7eb 0deg)` }}>
            <div className="w-8 h-8 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <ExamPathSelector initialPath={activeFramework} locale={locale} />

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
                  href={dashboardModuleHref(mod)}
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
