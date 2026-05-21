
/**
 * components/path/PathHeader.tsx
 * The hero: active-track identity pill, segmented progress bar showing
 * the 4 phase contributions, and the Up Next panel with the single Best Next Action.
 */

import Link from 'next/link';
import type {
  Locale,
  NextBestAction,
  PathProgress,
  Track,
} from '@/lib/pmp-path/types';
import { themeFor, TRACK_IDENTITY } from '@/lib/pmp-path/colors';

interface Props {
  track: Track;
  progress: PathProgress;
  nextBestAction: NextBestAction;
  locale: Locale;
  isAuthenticated: boolean;
}

export function PathHeader({
  track,
  progress,
  nextBestAction,
  locale,
  isAuthenticated,
}: Props) {
  const isAr = locale === 'ar';
  const identity = TRACK_IDENTITY[track.meta.id];

  // Progress narration
  const progressLabel = (() => {
    if (progress.overallPercent === 0) {
      return isAr ? 'مجرد بداية' : 'just starting';
    }
    if (progress.overallPercent === 100) {
      return isAr ? 'اكتمل' : 'complete';
    }
    return `${progress.completedLessons} / ${progress.totalLessons} ${isAr ? 'درساً' : 'lessons'}`;
  })();

  // Segmented progress bar — proportional flex per phase
  const phaseLessonCounts = track.phases.map((p) =>
    p.modules.reduce((s, m) => s + m.lessons.length, 0)
  );
  const segmentFlex = phaseLessonCounts;

  // The UP NEXT panel uses the phase theme of the recommended module
  const nbaModule = track.phases
    .flatMap((p) => p.modules)
    .find((m) => m.id === nextBestAction.moduleId);
  const nbaTheme = nbaModule ? themeFor(nbaModule.phaseId) : themeFor('foundation');

  // Construct the up-next CTA href
  const ctaHref = (() => {
    if (nextBestAction.kind === 'path_complete') return null;
    if (!nextBestAction.lessonId) return null;
    return `/dashboard/path/${nextBestAction.moduleId}/${nextBestAction.lessonId}/${nextBestAction.step}?lang=${locale}`;
  })();

  const ctaLabel = (() => {
    if (nextBestAction.kind === 'resume_lesson')
      return nextBestAction.step === 'preview'
        ? isAr ? 'تابع الدرس التالي' : 'Continue next lesson'
        : isAr ? 'استكمل الدرس' : 'Resume lesson';
    if (nextBestAction.kind === 'review_lesson')
      return isAr ? 'راجع نقطة الضعف' : 'Review weak point';
    if (nextBestAction.kind === 'start_module')
      return isAr ? 'ابدأ الوحدة' : 'Start module';
    return isAr ? 'حدد موعد الامتحان' : 'Schedule the exam';
  })();

  return (
    <header
      style={{
        background: '#FFFFFF',
        border: '0.5px solid rgba(26,20,48,0.12)',
        borderRadius: '16px',
        padding: '22px',
        marginBottom: '18px',
      }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top row — active-track pill + (auth helper) */}
      <div
        className="flex items-center"
        style={{ justifyContent: 'space-between', marginBottom: '16px' }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 500,
            background: identity.pillBg,
            color: identity.pillText,
          }}
        >
          <RouteIcon color={identity.pillText} />
          <span>
            {isAr ? 'النشط · ' : 'Active · '}
            {track.meta.shortName[locale]}
          </span>
        </span>
        {!isAuthenticated && (
          <span style={{ fontSize: '11px', color: '#5E6078' }}>
            {isAr ? 'سجّل الدخول لحفظ التقدّم' : 'Sign in to save progress'}
          </span>
        )}
      </div>

      {/* Progress block */}
      <div style={{ marginBottom: '16px' }}>
        <div
          className="flex items-center"
          style={{ justifyContent: 'space-between', marginBottom: '6px' }}
        >
          <span style={{ fontSize: '12px', color: '#5E6078' }}>
            {isAr ? 'التقدّم الكلي في هذا المسار' : 'Overall progress on this track'}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#1A1430' }}>
            {progress.overallPercent}% · {progressLabel}
          </span>
        </div>

        {/* Segmented bar — 4 phases */}
        <div
          style={{
            display: 'flex',
            gap: '3px',
            height: '8px',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
          aria-label={isAr ? 'شريط تقدّم بأربع مراحل' : 'Four-phase progress bar'}
        >
          {track.phases.map((phase, i) => {
            const phaseTheme = themeFor(phase.id);
            const phaseProg = progress.phases[i];
            // Layered: pale background showing the phase's total share,
            // primary fill showing how much of that phase is done.
            return (
              <div
                key={phase.id}
                style={{
                  flex: segmentFlex[i],
                  background: phaseTheme.palest,
                  position: 'relative',
                }}
                aria-label={`${phase.title[locale]} ${phaseProg.percent}%`}
              >
                <div
                  style={{
                    width: `${phaseProg.percent}%`,
                    height: '100%',
                    background: phaseTheme.primary,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Phase legend */}
        <div
          className="flex items-center"
          style={{
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '11px',
            color: '#5E6078',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {track.phases.map((phase) => {
            const t = themeFor(phase.id);
            return (
              <span
                key={phase.id}
                className="inline-flex items-center"
                style={{ gap: '5px' }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: t.primary,
                    display: 'inline-block',
                  }}
                  aria-hidden="true"
                />
                {phase.title[locale]}
              </span>
            );
          })}
        </div>
      </div>

      {/* UP NEXT */}
      <div
        style={{
          background: nbaTheme.pale,
          borderRadius: '14px',
          padding: '14px 16px',
          borderInlineStart: `4px solid ${nbaTheme.primary}`,
        }}
      >
        <div
          className="flex items-center"
          style={{ gap: '6px', marginBottom: '6px' }}
        >
          <TargetIcon color={nbaTheme.textOnPale} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: nbaTheme.textOnPale,
              letterSpacing: '0.08em',
            }}
          >
            {isAr ? 'التالي · أفضل خطوة لك الآن' : 'UP NEXT · YOUR BEST NEXT STEP'}
          </span>
        </div>

        <div
          className="flex items-center"
          style={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ flex: 1, minWidth: '220px' }}>
            <p
              style={{
                fontSize: '15px',
                fontWeight: 500,
                margin: '0 0 4px',
                color: nbaTheme.textOnPale,
              }}
            >
              {nbaModule
                ? `${nbaModule.code} · ${nbaModule.title[locale]}`
                : isAr
                  ? 'المسار مكتمل'
                  : 'Path complete'}
            </p>
            <p style={{ fontSize: '11px', color: nbaTheme.textOnPale, margin: 0 }}>
              {nextBestAction.rationale[locale]}
            </p>
          </div>

          {ctaHref ? (
            <Link
              href={ctaHref}
              style={{
                background: nbaTheme.primary,
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{ctaLabel}</span>
              {isAr ? <ArrowLeft /> : <ArrowRight />}
            </Link>
          ) : (
            <span style={{ fontSize: '13px', color: nbaTheme.textOnPale, fontWeight: 500 }}>
              ✓ {isAr ? 'جاهز للامتحان' : 'Exam-ready'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function RouteIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}
function TargetIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 5l-7 7 7 7" />
    </svg>
  );
}
