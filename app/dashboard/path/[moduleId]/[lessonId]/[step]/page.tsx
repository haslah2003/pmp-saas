/**
 * app/dashboard/path/[moduleId]/[lessonId]/[step]/page.tsx
 * Lesson player placeholder for Sprint R-Path-1.5.
 * Replaced by the real 7-step learning loop player in Sprint R-Path-2.
 */

import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { Locale, LearningStep } from '@/lib/pmp-path/types';
import { LEARNING_STEPS } from '@/lib/pmp-path/types';
import { ALL_TRACKS } from '@/lib/pmp-path/tracks';
import { themeFor } from '@/lib/pmp-path/colors';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    moduleId: string;
    lessonId: string;
    step: string;
  }>;
}

const STEP_LABELS: Record<LearningStep, { en: string; ar: string }> = {
  preview:   { en: 'Preview',   ar: 'معاينة'  },
  learn:     { en: 'Learn',     ar: 'تعلّم'   },
  visualize: { en: 'Visualize', ar: 'تصوّر'   },
  apply:     { en: 'Apply',     ar: 'تطبيق'   },
  practice:  { en: 'Practice',  ar: 'تمرين'   },
  explain:   { en: 'Explain',   ar: 'توضيح'   },
  review:    { en: 'Review',    ar: 'مراجعة'  },
};

export default async function LessonPlayerPlaceholder({ params }: PageProps) {
  const { moduleId, lessonId, step } = await params;
  const cookieStore = await cookies();
  const locale: Locale = cookieStore.get('pmp_locale')?.value === 'ar' ? 'ar' : 'en';
  const isAr = locale === 'ar';

  if (!(LEARNING_STEPS as readonly string[]).includes(step)) notFound();
  const learningStep = step as LearningStep;

  let foundModule = null;
  let foundLesson = null;
  let foundTrack = null;
  for (const t of ALL_TRACKS) {
    for (const phase of t.phases) {
      const m = phase.modules.find((mod) => mod.id === moduleId);
      if (m) {
        foundModule = m;
        foundTrack = t;
        foundLesson = m.lessons.find((l) => l.id === lessonId) ?? null;
        break;
      }
    }
    if (foundModule) break;
  }

  if (!foundModule || !foundLesson || !foundTrack) notFound();

  const theme = themeFor(foundModule.phaseId);
  const stepLabel = STEP_LABELS[learningStep][locale];

  return (
    <main
      style={{ background: '#FAFAF9', minHeight: '100vh', padding: '24px' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link
          href={`/dashboard/path?track=${foundTrack.meta.id}`}
          style={{
            color: theme.textOnPale,
            fontSize: '13px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px',
            fontWeight: 500,
          }}
        >
          <span>{isAr ? '→' : '←'}</span>
          <span>{isAr ? 'العودة إلى مساري PMP' : 'Back to My PMP Path'}</span>
        </Link>

        <article
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            border: '0.5px solid rgba(26,20,48,0.12)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              background: theme.primary,
              color: '#FFFFFF',
              marginBottom: '12px',
              letterSpacing: '0.02em',
            }}
          >
            {foundModule.code} · {foundLesson.code} · {stepLabel}
          </span>

          <h1 style={{ fontSize: '24px', fontWeight: 500, margin: '0 0 8px', color: '#1A1430', lineHeight: 1.3 }}>
            {foundLesson.title[locale]}
          </h1>
          <p style={{ fontSize: '14px', color: '#5E6078', margin: '0 0 24px', lineHeight: 1.6 }}>
            {foundLesson.objective[locale]}
          </p>

          <div
            style={{
              background: theme.pale,
              borderRadius: '12px',
              padding: '20px',
              borderInlineStart: '4px solid ' + theme.primary,
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: theme.textOnPale,
                margin: '0 0 8px',
                letterSpacing: '0.08em',
              }}
            >
              {isAr ? 'قريباً' : 'COMING SOON'}
            </p>
            <p style={{ fontSize: '15px', color: theme.textOnPale, margin: '0 0 4px', lineHeight: 1.6, fontWeight: 500 }}>
              {isAr ? 'مشغّل الدروس بحلقة التعلّم السبعية قيد التطوير' : 'The 7-step learning loop player is in development'}
            </p>
            <p style={{ fontSize: '13px', color: theme.textOnPale, margin: 0, lineHeight: 1.6, opacity: 0.85 }}>
              {isAr
                ? 'ستجد هنا قريباً الخطوات السبع: معاينة، تعلّم، تصوّر، تطبيق، تمرين، توضيح، ومراجعة. حافظ على مسارك في الوحدات الجاهزة حتى ذلك الحين.'
                : 'You will soon see the seven learning steps here: Preview, Learn, Visualize, Apply, Practice, Explain, and Review. Stay on track with the modules in the meantime.'}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
