import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { Locale, LearningStep, PhaseId } from '@/lib/pmp-path/types';
import { LEARNING_STEPS } from '@/lib/pmp-path/types';
import { ALL_TRACKS } from '@/lib/pmp-path/tracks';
import { themeFor } from '@/lib/pmp-path/colors';
import { frameworkFromModuleId, getLessonVideos } from '@/lib/pmp-path/videos.server';
import { getApplyActivity } from '@/lib/pmp-path/apply-activities';
import getPracticeActivity from '@/lib/pmp-path/practice-activities';
import getExplainActivity from '@/lib/pmp-path/explain-activities';
import getReviewActivity from '@/lib/pmp-path/review-activities';

import { PreviewStep } from '@/components/path/steps/PreviewStep';
import { LearnStep } from '@/components/path/steps/LearnStep';
import { VisualizeStep } from '@/components/path/steps/VisualizeStep';
import { StepBodyPlaceholder } from '@/components/path/steps/StepBodyPlaceholder';
import { ApplyStep } from '@/components/path/steps/ApplyStep';
import { PracticeStep } from '@/components/path/steps/PracticeStep';
import { ExplainStep } from '@/components/path/steps/ExplainStep';
import { ReviewStep } from '@/components/path/steps/ReviewStep';
import { StepNavigation } from '@/components/path/StepNavigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ moduleId: string; lessonId: string; step: string }>;
  searchParams?: Promise<{ lang?: string | string[]; locale?: string | string[] }>;
}

const STEP_LABELS: Record<LearningStep, { en: string; ar: string }> = {
  preview: { en: 'Preview', ar: 'معاينة' },
  learn: { en: 'Learn', ar: 'تعلّم' },
  visualize: { en: 'Visualize', ar: 'تصوّر' },
  apply: { en: 'Apply', ar: 'تطبيق' },
  practice: { en: 'Practice', ar: 'تمرين' },
  explain: { en: 'Explain', ar: 'توضيح' },
  review: { en: 'Review', ar: 'مراجعة' },
};

const PHASE_LABELS: Record<PhaseId, { en: string; ar: string }> = {
  foundation: { en: 'Foundation', ar: 'التأسيس' },
  mastery: { en: 'Mastery', ar: 'الإتقان' },
  integration: { en: 'Integration', ar: 'الدمج' },
  simulation: { en: 'Simulation', ar: 'المحاكاة' },
};

const STEP_INTENTS: Record<
  LearningStep,
  {
    en: { purpose: string; outcome: string };
    ar: { purpose: string; outcome: string };
  }
> = {
  preview: {
    en: {
      purpose: 'Orient yourself before learning: understand why this lesson matters, what skill it builds, and how it connects to PMP exam judgment.',
      outcome: 'You will know exactly what to focus on before entering the lesson content.',
    },
    ar: {
      purpose: 'تهيئة ذهنية قبل التعلم: افهم لماذا يهم هذا الدرس، وما المهارة التي يبنيها، وكيف يرتبط بحكم امتحان PMP.',
      outcome: 'ستعرف بدقة ما الذي ينبغي التركيز عليه قبل الدخول في محتوى الدرس.',
    },
  },
  learn: {
    en: {
      purpose: 'Build the concept clearly using structured explanation, examples, and exam-oriented meaning.',
      outcome: 'You will understand the core idea well enough to recognize it in scenarios.',
    },
    ar: {
      purpose: 'بناء المفهوم بوضوح من خلال شرح منظم وأمثلة ومعنى مرتبط بالامتحان.',
      outcome: 'ستفهم الفكرة الأساسية بما يكفي للتعرف عليها في السيناريوهات.',
    },
  },
  visualize: {
    en: {
      purpose: 'Turn the concept into a visual mental model so related ideas become easier to recall and connect.',
      outcome: 'You will see how the lesson fits into the wider PMP logic.',
    },
    ar: {
      purpose: 'تحويل المفهوم إلى نموذج ذهني بصري لتسهيل تذكر الأفكار المترابطة وربطها.',
      outcome: 'سترى كيف يدخل الدرس ضمن منطق PMP الأشمل.',
    },
  },
  apply: {
    en: {
      purpose: 'Use the concept in a realistic project situation and decide what a strong project leader should do.',
      outcome: 'You will practice turning knowledge into professional action.',
    },
    ar: {
      purpose: 'استخدام المفهوم في موقف واقعي من إدارة المشاريع وتحديد ما ينبغي أن يفعله قائد المشروع المحترف.',
      outcome: 'ستتدرب على تحويل المعرفة إلى تصرف مهني.',
    },
  },
  practice: {
    en: {
      purpose: 'Test your understanding with focused PMP-style questions and immediate feedback.',
      outcome: 'You will identify whether the lesson is exam-ready or needs reinforcement.',
    },
    ar: {
      purpose: 'اختبار فهمك بأسئلة مركزة بأسلوب PMP مع تغذية راجعة مباشرة.',
      outcome: 'ستحدد هل أصبح الدرس جاهزًا للامتحان أم يحتاج إلى تعزيز.',
    },
  },
  explain: {
    en: {
      purpose: 'Explain the reasoning behind the best answer so your judgment becomes repeatable.',
      outcome: 'You will strengthen the logic behind your answer choices.',
    },
    ar: {
      purpose: 'شرح منطق أفضل إجابة حتى يصبح حكمك قابلاً للتكرار.',
      outcome: 'ستعزز المنطق الذي يقف خلف اختياراتك للإجابات.',
    },
  },
  review: {
    en: {
      purpose: 'Consolidate the lesson, check readiness, and close the loop before moving forward.',
      outcome: 'You will know whether to finish the lesson or revisit a weak point.',
    },
    ar: {
      purpose: 'ترسيخ الدرس، وفحص الجاهزية، وإغلاق حلقة التعلم قبل الانتقال للأمام.',
      outcome: 'ستعرف هل تنهي الدرس أم تعود إلى نقطة تحتاج إلى تقوية.',
    },
  },
};

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

function normalizeLocale(value: string | string[] | undefined | null): Locale | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'ar' || raw === 'en' ? raw : null;
}

export default async function LessonStepPage({ params, searchParams }: PageProps) {
  const { moduleId, lessonId, step } = await params;
  const currentStep = step.toLowerCase() as LearningStep;

  if (!LEARNING_STEPS.includes(currentStep)) {
    notFound();
  }

  const query = await searchParams;
  const cookieStore = await cookies();
  const locale: Locale =
    normalizeLocale(query?.lang) ??
    normalizeLocale(query?.locale) ??
    normalizeLocale(cookieStore.get('pmp_locale')?.value) ??
    'en';
  const isAr = locale === 'ar';

  let foundModule = null;
  let foundLesson = null;

  for (const track of ALL_TRACKS) {
    for (const phase of track.phases) {
      const trackModule = phase.modules.find((m) => m.id === moduleId);
      if (trackModule) {
        foundModule = trackModule;
        foundLesson = trackModule.lessons.find((l) => l.id === lessonId) ?? null;
        break;
      }
    }
    if (foundModule) break;
  }

  if (!foundModule || !foundLesson) {
    notFound();
  }

  const theme = themeFor(foundModule.phaseId) || FALLBACK_THEME;
  const stepLabel = STEP_LABELS[currentStep][locale];
  const currentStepNumber = LEARNING_STEPS.indexOf(currentStep) + 1;
  const totalSteps = LEARNING_STEPS.length;
  const phaseLabel = PHASE_LABELS[foundModule.phaseId as PhaseId][locale];
  const stepIntent = STEP_INTENTS[currentStep][locale];
  const framework = frameworkFromModuleId(foundModule.id);

  const lessonVideos =
    currentStep === 'learn'
      ? await getLessonVideos({
          framework,
          moduleId: foundModule.id,
          lessonId: foundLesson.id,
          step: currentStep,
          locale,
        })
      : [];

  const applyActivity = currentStep === 'apply' ? getApplyActivity(foundLesson.id) : null;
  const practiceActivity = currentStep === 'practice' ? getPracticeActivity(foundLesson.id) : null;
  const explainActivity = currentStep === 'explain' ? getExplainActivity(foundLesson.id) : null;
  const reviewActivity = currentStep === 'review' ? getReviewActivity(foundLesson.id) : null;

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: '#FAFAF8', paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        <Link
          href={`/dashboard/path?lang=${locale}`}
          style={{
            fontSize: '13px',
            color: theme.textOnPale,
            textDecoration: 'none',
            marginBottom: '20px',
            display: 'inline-block',
          }}
        >
          {isAr ? 'العودة إلى مساري ←' : '← Back to My Path'}
        </Link>

        <section
          aria-label={isAr ? 'بطاقة مهمة الدرس' : 'Lesson mission card'}
          style={{
            marginBottom: '24px',
            border: `1px solid ${theme.primary}22`,
            borderRadius: '20px',
            padding: '22px',
            background: `linear-gradient(135deg, ${theme.palest} 0%, #FFFFFF 72%)`,
            boxShadow: '0 10px 30px rgba(26,20,48,0.05)',
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '999px',
                padding: '7px 12px',
                background: theme.pale,
                color: theme.textOnPale,
                fontSize: '12px',
                fontWeight: 900,
              }}
            >
              {phaseLabel} · {foundModule.code} · {foundLesson.code}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '999px',
                padding: '7px 12px',
                background: '#FFFFFF',
                color: '#5E6078',
                border: '1px solid rgba(26,20,48,0.10)',
                fontSize: '12px',
                fontWeight: 900,
              }}
            >
              {isAr
                ? `الخطوة ${currentStepNumber} من ${totalSteps} · ${stepLabel}`
                : `Step ${currentStepNumber} of ${totalSteps} · ${stepLabel}`}
            </span>
          </div>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 950,
              color: '#1A1430',
              margin: '0 0 10px',
              lineHeight: 1.15,
            }}
          >
            {foundLesson.title[locale]}
          </h1>

          <p style={{ fontSize: '15px', color: '#5E6078', margin: '0 0 18px', lineHeight: 1.7 }}>
            {stepIntent.purpose}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(26,20,48,0.08)',
                borderRadius: '14px',
                padding: '13px',
              }}
            >
              <p style={{ margin: '0 0 6px', color: '#8B8DA3', fontSize: '11px', fontWeight: 900 }}>
                {isAr ? 'هدف الدرس' : 'Lesson objective'}
              </p>
              <p style={{ margin: 0, color: '#1A1430', fontSize: '13px', lineHeight: 1.55, fontWeight: 700 }}>
                {foundLesson.objective[locale]}
              </p>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(26,20,48,0.08)',
                borderRadius: '14px',
                padding: '13px',
              }}
            >
              <p style={{ margin: '0 0 6px', color: '#8B8DA3', fontSize: '11px', fontWeight: 900 }}>
                {isAr ? 'نتيجة هذه الخطوة' : 'Step outcome'}
              </p>
              <p style={{ margin: 0, color: '#1A1430', fontSize: '13px', lineHeight: 1.55, fontWeight: 700 }}>
                {stepIntent.outcome}
              </p>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(26,20,48,0.08)',
                borderRadius: '14px',
                padding: '13px',
              }}
            >
              <p style={{ margin: '0 0 6px', color: '#8B8DA3', fontSize: '11px', fontWeight: 900 }}>
                {isAr ? 'حجم المهمة' : 'Mission size'}
              </p>
              <p style={{ margin: 0, color: '#1A1430', fontSize: '13px', lineHeight: 1.55, fontWeight: 700 }}>
                {isAr
                  ? `${foundLesson.estimatedMinutes} دقيقة · ${foundLesson.practiceQuestionCount} أسئلة تمرين`
                  : `${foundLesson.estimatedMinutes} min · ${foundLesson.practiceQuestionCount} practice questions`}
              </p>
            </div>
          </div>
        </section>

        <StepNavigation
          moduleId={foundModule.id}
          lessonId={foundLesson.id}
          trackId={foundModule.trackId}
          currentStep={currentStep}
          locale={locale}
          variant="top"
        />

        <article
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #E8E6E0',
          }}
        >
          {currentStep === 'preview' ? (
            <PreviewStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} />
          ) : currentStep === 'learn' ? (
            <LearnStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} videos={lessonVideos} />
          ) : currentStep === 'visualize' ? (
            <VisualizeStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} />
          ) : currentStep === 'apply' ? (
            <ApplyStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={applyActivity} />
          ) : currentStep === 'practice' ? (
            <PracticeStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={practiceActivity} />
          ) : currentStep === 'explain' ? (
            <ExplainStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={explainActivity} />
          ) : currentStep === 'review' ? (
            <ReviewStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={reviewActivity} />
          ) : (
            <StepBodyPlaceholder step={currentStep} lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} />
          )}
        </article>
      </div>
    </main>
  );
}
