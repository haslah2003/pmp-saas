
/**
 * components/path/ModuleCard.tsx
 * Renders a single module on the journey spine.
 * Framework rule: ONE CTA per module — enforced via the computeCta() decision table.
 */

import Link from 'next/link';
import type { Locale, Module, ModuleProgress } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import { SevenStepStrip } from './SevenStepStrip';

interface Cta {
  label: string;
  href: string | null;
  disabled: boolean;
  variant: 'primary' | 'locked' | 'done';
  icon: 'arrow' | 'lock' | 'check' | 'refresh';
}

/**
 * Single-CTA decision table — first match wins.
 * NEVER renders more than one button.
 */
function computeCta(mp: ModuleProgress, mod: Module, locale: Locale): Cta {
  const isAr = locale === 'ar';

  // 1. Locked → show locked button, no link
  if (mp.status === 'locked') {
    return {
      label: isAr ? 'أكمل الوحدة السابقة' : 'Complete previous module',
      href: null,
      disabled: true,
      variant: 'locked',
      icon: 'lock',
    };
  }

  // 2. Completed → review CTA
  if (mp.status === 'completed') {
    return {
      label: isAr ? 'إعادة المراجعة' : 'Review again',
      href: `/dashboard/path/${mod.id}/${mod.lessons[0].id}/review?lang=${locale}`,
      disabled: false,
      variant: 'done',
      icon: 'check',
    };
  }

  // 3. In progress → resume CTA
  if (mp.status === 'in_progress' && mp.nextLessonId) {
    return {
      label: mp.lessonsCompleted > 0 && (mp.nextStep ?? 'preview') === 'preview'
        ? isAr ? 'تابع الدرس التالي' : 'Continue next lesson'
        : isAr ? 'استكمل الدرس' : 'Resume lesson',
      href: `/dashboard/path/${mod.id}/${mp.nextLessonId}/${mp.nextStep ?? 'preview'}?lang=${locale}`,
      disabled: false,
      variant: 'primary',
      icon: 'arrow',
    };
  }

  // 4. Needs review → review CTA
  if (mp.status === 'needs_review' && mp.nextLessonId) {
    return {
      label: isAr ? 'راجع نقطة الضعف' : 'Review weak point',
      href: `/dashboard/path/${mod.id}/${mp.nextLessonId}/review?lang=${locale}`,
      disabled: false,
      variant: 'primary',
      icon: 'refresh',
    };
  }

  // 5. Not started → start CTA
  return {
    label: isAr ? 'ابدأ الوحدة' : 'Start module',
    href: `/dashboard/path/${mod.id}/${mod.lessons[0].id}/preview?lang=${locale}`,
    disabled: false,
    variant: 'primary',
    icon: 'arrow',
  };
}

interface Props {
  module: Module;
  progress: ModuleProgress;
  locale: Locale;
  isUpNext: boolean;
}

export function ModuleCard({ module: mod, progress, locale, isUpNext }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(mod.phaseId);
  const cta = computeCta(progress, mod, locale);
  const status = progress.status;

  // Compute total minutes from lessons (single source of truth)
  const totalMinutes = mod.lessons.reduce(
    (sum, l) => sum + l.estimatedMinutes,
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1).replace(/\.0$/, '');

  // Card border treatment
  const isFaded = status === 'locked';
  const borderStyle = isUpNext
    ? { border: `2px solid ${theme.primary}`, padding: '13px 15px' }
    : {
        border: '0.5px solid rgba(26,20,48,0.12)',
        padding: '14px 16px',
      };

  // Status badge content (right side, top)
  const statusBadge = (() => {
    if (isUpNext) {
      return {
        label: isAr ? 'التالي' : 'Up next',
        bg: theme.pale,
        fg: theme.textOnPale,
      };
    }
    if (status === 'completed') {
      return {
        label: isAr ? 'مكتملة' : 'Complete',
        bg: theme.pale,
        fg: theme.textOnPale,
      };
    }
    if (status === 'in_progress') {
      return {
        label: `${progress.percent}%`,
        bg: theme.pale,
        fg: theme.textOnPale,
      };
    }
    if (status === 'needs_review') {
      return {
        label: isAr ? 'تحتاج مراجعة' : 'Needs review',
        bg: '#FFF7E6',
        fg: '#854F0B',
      };
    }
    if (status === 'locked') {
      return {
        label: isAr ? 'مقفلة' : 'Locked',
        bg: 'transparent',
        fg: '#5E6078',
      };
    }
    return null;
  })();

  // CTA button styling
  const ctaButtonStyle = (() => {
    if (cta.variant === 'primary') {
      return {
        background: theme.primary,
        color: '#FFFFFF',
        border: 'none',
        cursor: 'pointer',
      } as const;
    }
    if (cta.variant === 'done') {
      return {
        background: 'transparent',
        color: theme.textOnPale,
        border: `1px solid ${theme.primary}`,
        cursor: 'pointer',
      } as const;
    }
    return {
      background: 'transparent',
      color: '#5E6078',
      border: '0.5px solid rgba(26,20,48,0.2)',
      cursor: 'not-allowed',
      opacity: 0.7,
    } as const;
  })();

  const lessonStatusById = new Map(
    progress.lessonStatuses.map((item) => [item.lessonId, item])
  );

  const showLessonProgress =
    (isUpNext ||
      status === 'in_progress' ||
      status === 'needs_review' ||
      status === 'completed') &&
    progress.lessonStatuses.length > 0;

  const lessonStatusLabel = (
    value: ModuleProgress['lessonStatuses'][number]['status']
  ) => {
    if (value === 'completed') return isAr ? 'مكتمل' : 'Completed';
    if (value === 'current') return isAr ? 'الحالي' : 'Current';
    if (value === 'needs_review') return isAr ? 'تحتاج مراجعة' : 'Needs review';
    if (value === 'locked') return isAr ? 'مقفل' : 'Locked';
    return isAr ? 'لم يبدأ' : 'Not started';
  };

  const lessonStatusStyle = (
    value: ModuleProgress['lessonStatuses'][number]['status']
  ) => {
    if (value === 'current') {
      return {
        background: theme.primary,
        color: '#FFFFFF',
        border: 'none',
      } as const;
    }
    if (value === 'completed') {
      return {
        background: theme.pale,
        color: theme.textOnPale,
        border: 'none',
      } as const;
    }
    if (value === 'needs_review') {
      return {
        background: '#FFF7E6',
        color: '#854F0B',
        border: 'none',
      } as const;
    }
    if (value === 'locked') {
      return {
        background: 'transparent',
        color: '#5E6078',
        border: '0.5px solid rgba(26,20,48,0.15)',
      } as const;
    }
    return {
      background: '#F8F7FB',
      color: '#5E6078',
      border: '0.5px solid rgba(26,20,48,0.08)',
    } as const;
  };

  const buttonInner = (
    <span
      className="inline-flex items-center"
      style={{ gap: '6px', whiteSpace: 'nowrap' }}
    >
      {cta.icon === 'lock' && <LockIcon />}
      {cta.icon === 'check' && <CheckIcon />}
      {cta.icon === 'refresh' && <RefreshIcon />}
      <span>{cta.label}</span>
      {cta.icon === 'arrow' && (isAr ? <ArrowLeftIcon /> : <ArrowRightIcon />)}
    </span>
  );

  return (
    <article
      style={{
        background: isFaded ? '#FAFAF9' : '#FFFFFF',
        borderRadius: '14px',
        marginBottom: '10px',
        opacity: isFaded ? 0.78 : 1,
        ...borderStyle,
      }}
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label={`${mod.code}: ${mod.title[locale]}`}
    >
      {/* Header row: code + status badge */}
      <div className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '6px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            padding: '3px 9px',
            borderRadius: '8px',
            letterSpacing: '0.02em',
            background: isUpNext || status === 'in_progress' || status === 'not_started' ? theme.primary : theme.pale,
            color: isUpNext || status === 'in_progress' || status === 'not_started' ? '#FFFFFF' : theme.textOnPale,
          }}
        >
          {mod.code}
        </span>
        {statusBadge && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: '999px',
              background: statusBadge.bg,
              color: statusBadge.fg,
              border: statusBadge.bg === 'transparent' ? '0.5px solid rgba(26,20,48,0.15)' : 'none',
            }}
          >
            {statusBadge.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '14px',
          fontWeight: 500,
          margin: '0 0 4px',
          lineHeight: 1.35,
          color: '#1A1430',
        }}
      >
        {mod.title[locale]}
      </h3>

      {/* Description (only when expanded — collapsed locked modules hide it for density) */}
      {!isFaded && (
        <p
          style={{
            fontSize: '12px',
            color: '#5E6078',
            margin: '0 0 8px',
            lineHeight: 1.5,
          }}
        >
          {mod.description[locale]}
        </p>
      )}

      {/* 7-step strip — visible when active, review-needed, or completed */}
      {(isUpNext || status === 'in_progress' || status === 'needs_review' || status === 'completed') && (
        <SevenStepStrip
          phaseId={mod.phaseId}
          currentStep={status === 'completed' ? null : progress.nextStep}
          completedSteps={progress.completedSteps}
          locale={locale}
        />
      )}

      {/* Lesson-level progress — read-only, keeps one CTA per module */}
      {showLessonProgress && (
        <div
          role="list"
          aria-label={isAr ? 'حالة الدروس' : 'Lesson progress'}
          style={{
            marginTop: '10px',
            border: '0.5px solid rgba(26,20,48,0.10)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#FCFBFF',
          }}
        >
          {mod.lessons.map((lesson, index) => {
            const lessonProgress = lessonStatusById.get(lesson.id);
            const lessonStatus = lessonProgress?.status ?? 'not_started';
            const badgeStyle = lessonStatusStyle(lessonStatus);

            return (
              <div
                key={lesson.id}
                role="listitem"
                className="flex items-center"
                style={{
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '7px 9px',
                  borderTop:
                    index === 0 ? 'none' : '0.5px solid rgba(26,20,48,0.08)',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: '#1A1430',
                    lineHeight: 1.4,
                    minWidth: 0,
                  }}
                >
                  <b style={{ fontWeight: 600 }}>{lesson.code}</b>
                  <span style={{ color: '#8B8DA3' }}> · </span>
                  <span>{lesson.title[locale]}</span>
                </span>

                <span
                  style={{
                    flex: '0 0 auto',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    ...badgeStyle,
                  }}
                >
                  {lessonStatusLabel(lessonStatus)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer row: stats + single CTA */}
      <div
        className="flex items-center"
        style={{ justifyContent: 'space-between', marginTop: '10px', gap: '8px', flexWrap: 'wrap' }}
      >
        <span style={{ fontSize: '11px', color: '#5E6078' }}>
          <BookIcon /> <b style={{ fontWeight: 500, color: '#1A1430' }}>{mod.lessons.length}</b>{' '}
          {isAr ? 'دروس' : 'lessons'} ·{' '}
          <ClockIcon /> <b style={{ fontWeight: 500, color: '#1A1430' }}>{totalHours}h</b>
          {mod.ecoWeightPct !== undefined && (
            <>
              {' '}· <b style={{ fontWeight: 500, color: '#1A1430' }}>{mod.ecoWeightPct}%</b>{' '}
              {isAr ? 'من الامتحان' : 'of exam'}
            </>
          )}
          {mod.questionCount !== undefined && (
            <>
              {' '}· <b style={{ fontWeight: 500, color: '#1A1430' }}>{mod.questionCount}</b>{' '}
              {isAr ? 'سؤال' : 'questions'}
            </>
          )}
        </span>

        {cta.href && !cta.disabled ? (
          <Link
            href={cta.href}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              ...ctaButtonStyle,
            }}
          >
            {buttonInner}
          </Link>
        ) : (
          <button
            type="button"
            disabled={cta.disabled}
            aria-disabled={cta.disabled}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '13px',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              ...ctaButtonStyle,
            }}
          >
            {buttonInner}
          </button>
        )}
      </div>
    </article>
  );
}

// ============================================================
// Inline icons (no external icon library required)
// ============================================================

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 5l-7 7 7 7" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-2px' }}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-2px' }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
