import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BookOpen,
  Calculator,
  CheckCircle2,
  FileText,
  Lightbulb,
  MessageCircle,
  PencilLine,
  PlayCircle,
  Target,
} from 'lucide-react';

import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
}

const TEAL = '#0F6E56';
const TEAL_DARK = '#085041';
const TEAL_SOFT = '#E1F5EE';

const PURPLE_DARK = '#3C3489';
const PURPLE_SOFT = '#EEEDFE';

const AMBER_DARK = '#633806';
const AMBER_SOFT = '#FAEEDA';

const SURFACE = '#FFFFFF';
const SURFACE_SOFT = '#F8F8F6';
const BORDER = '#E8E6E0';
const TEXT = '#1A1A1A';
const MUTED = '#6B7280';
const FAINT = '#9CA3AF';

function getModuleIdFromLessonId(lessonId: string) {
  return lessonId.includes('.') ? lessonId.replace(/\.[^.]+$/, '') : lessonId;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 10px',
        color: TEAL,
        fontSize: '11px',
        fontWeight: 900,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </p>
  );
}

function CheckItem({ children, isAr }: { children: ReactNode; isAr: boolean }) {
  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        color: MUTED,
        fontSize: '14px',
        lineHeight: 1.65,
        textAlign: isAr ? 'right' : 'left',
      }}
    >
      <CheckCircle2
        size={17}
        color={TEAL}
        style={{
          marginTop: '4px',
          flex: '0 0 auto',
        }}
      />
      <span style={{ flex: '1 1 auto' }}>{children}</span>
    </div>
  );
}

function ActivityCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: '16px',
        background: SURFACE,
        padding: '16px 12px',
        textAlign: 'center',
      }}
    >
      <Icon size={22} color={TEAL} style={{ margin: '0 auto 8px' }} />
      <p style={{ margin: '0 0 4px', color: TEXT, fontSize: '14px', fontWeight: 900 }}>{title}</p>
      <p style={{ margin: 0, color: FAINT, fontSize: '12px', fontWeight: 700 }}>{detail}</p>
    </div>
  );
}

function ToolkitChip({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        borderRadius: '12px',
        background: PURPLE_SOFT,
        color: PURPLE_DARK,
        padding: '8px 12px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 800,
      }}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}

export function PreviewStep({ lesson, locale }: Props) {
  const isAr = locale === 'ar';
  const moduleId = getModuleIdFromLessonId(lesson.id);
  const title = lesson.title[locale];
  const objective = lesson.objective[locale];
  const encodedTopic = encodeURIComponent(title);

  const readMin = Math.max(6, Math.round(lesson.estimatedMinutes * 0.32));
  const visualizeMin = Math.max(3, Math.round(lesson.estimatedMinutes * 0.16));
  const practiceMin = Math.max(5, Math.round(lesson.estimatedMinutes * 0.4));
  const reflectMin = Math.max(2, lesson.estimatedMinutes - readMin - visualizeMin - practiceMin);

  const localeQuery = `?lang=${locale}`;
  const primaryCtaHref = `/dashboard/path/${moduleId}/${lesson.id}/learn${localeQuery}`;
  const practiceHref = `/dashboard/path/${moduleId}/${lesson.id}/practice${localeQuery}`;

  const objectiveStatement = isAr
    ? `حوّل موضوع "${title}" إلى حكم عملي يمكنك تطبيقه بثقة في أسئلة PMP المبنية على السيناريوهات.`
    : `Turn "${title}" into practical judgment you can apply with confidence in PMP scenario questions.`;

  const subOutcomes = isAr
    ? [
        `فهم الفكرة المركزية في "${title}" ولماذا يمكن أن يختبرها PMI.`,
        'ربط هدف الدرس بقرارات عملية، ومفاضلات مهنية، واستبعاد إجابات غير مناسبة.',
        'اكتشاف الإجابات الجذابة ظاهريًا ولكن غير المتوافقة مع هدف الدرس ومنطق الامتحان.',
      ]
    : [
        `Understand the core idea behind "${title}" and why PMI may test it.`,
        'Connect the lesson objective to practical decisions, professional trade-offs, and answer elimination.',
        'Spot attractive-but-wrong answers that conflict with the lesson objective and exam logic.',
      ];

  const activities = isAr
    ? [
        { icon: BookOpen, title: 'اقرأ المفهوم', detail: `${readMin} دقائق` },
        { icon: PlayCircle, title: 'تصوّر الفكرة', detail: `${visualizeMin} دقائق` },
        { icon: PencilLine, title: 'تدرّب', detail: `${practiceMin} دقائق · ${lesson.practiceQuestionCount} أسئلة` },
        { icon: Lightbulb, title: 'راجع التفكير', detail: `${reflectMin} دقائق` },
      ]
    : [
        { icon: BookOpen, title: 'Read concept', detail: `${readMin} min` },
        { icon: PlayCircle, title: 'Visualize', detail: `${visualizeMin} min` },
        { icon: PencilLine, title: 'Practice', detail: `${practiceMin} min · ${lesson.practiceQuestionCount} Qs` },
        { icon: Lightbulb, title: 'Reflect', detail: `${reflectMin} min` },
      ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ display: 'grid', gap: '26px' }}>
      <section style={{ borderBottom: `1px dashed ${BORDER}`, paddingBottom: '24px' }}>
        <SectionLabel>{isAr ? '١ · عقد التعلم' : '1 · Learning contract'}</SectionLabel>

        <p style={{ margin: '0 0 8px', color: FAINT, fontSize: '13px', fontWeight: 800 }}>
          {isAr ? 'بنهاية هذه المهمة، ستكون قادرًا على:' : 'By the end of this mission, you will be able to:'}
        </p>

        <p style={{ margin: '0 0 10px', color: TEXT, fontSize: '18px', lineHeight: 1.55, fontWeight: 900 }}>
          {objectiveStatement}
        </p>

        <p style={{ margin: '0 0 18px', color: MUTED, fontSize: '14px', lineHeight: 1.65 }}>
          <strong style={{ color: TEXT }}>{isAr ? 'هدف الدرس:' : 'Lesson objective:'}</strong> {objective}
        </p>

        <div style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
          {subOutcomes.map((item) => (
            <CheckItem key={item} isAr={isAr}>
              {item}
            </CheckItem>
          ))}
        </div>

        <div
          style={{
            background: TEAL_SOFT,
            borderRadius: '16px',
            padding: '14px 16px',
            display: 'grid',
            gridTemplateColumns: isAr ? '1fr 28px' : '28px 1fr',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          {!isAr && <Target size={22} color={TEAL_DARK} />}
          <p style={{ margin: 0, color: TEAL_DARK, fontSize: '14px', lineHeight: 1.65 }}>
            <strong>{isAr ? 'معيار الإتقان:' : 'Mastery criteria:'}</strong>{' '}
            {isAr
              ? `احصل على 80% أو أكثر في ${lesson.practiceQuestionCount} أسئلة تمرين، ثم استخدم ملاحظات الذكاء الاصطناعي لتثبيت نقطة ضعف واحدة.`
              : `Score 80%+ on the ${lesson.practiceQuestionCount} practice questions, then use AI feedback to lock in one weak point.`}
          </p>
          {isAr && <Target size={22} color={TEAL_DARK} />}
        </div>
      </section>

      <section style={{ borderBottom: `1px dashed ${BORDER}`, paddingBottom: '24px' }}>
        <SectionLabel>{isAr ? `٢ · خطة ${lesson.estimatedMinutes} دقيقة` : `2 · Your ${lesson.estimatedMinutes}-minute plan`}</SectionLabel>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            marginBottom: '18px',
          }}
        >
          {activities.map((activity) => (
            <ActivityCard
              key={activity.title}
              icon={activity.icon}
              title={activity.title}
              detail={activity.detail}
            />
          ))}
        </div>

        <p style={{ margin: '0 0 10px', color: FAINT, fontSize: '12px', fontWeight: 800 }}>
          {isAr ? 'افتح بجانب هذه المهمة' : 'Open alongside this mission'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <ToolkitChip
            href={`/dashboard/mindmap?topic=${encodedTopic}`}
            icon={Brain}
            label={isAr ? 'الخريطة الذهنية' : 'Mind map'}
          />
          <ToolkitChip
            href={`/dashboard/tutor?topic=${encodedTopic}`}
            icon={MessageCircle}
            label={isAr ? 'المدرب الذكي' : 'AI Coach'}
          />
          <ToolkitChip
            href="/dashboard/artifacts"
            icon={FileText}
            label={isAr ? 'النماذج والوثائق' : 'Artifacts'}
          />
          <ToolkitChip
            href="/dashboard/formulas"
            icon={Calculator}
            label={isAr ? 'المعادلات' : 'Formulas'}
          />
        </div>
      </section>

      <section>
        <SectionLabel>{isAr ? '٣ · السياق والانطلاق' : '3 · Context & launch'}</SectionLabel>

        <div
          style={{
            background: AMBER_SOFT,
            borderRadius: '16px',
            padding: '15px 16px',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              color: AMBER_DARK,
              fontSize: '13px',
              fontWeight: 950,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <Lightbulb size={16} />
            {isAr ? 'لماذا هذا مهم؟' : 'Why this matters'}
          </p>
          <p style={{ margin: 0, color: AMBER_DARK, fontSize: '14px', lineHeight: 1.7 }}>
            {isAr
              ? `هذه المهمة تساعدك على تحويل "${title}" من معلومة نظرية إلى حكم امتحاني عملي: فهم المطلوب، استبعاد الإجابات الضعيفة، واختيار التصرف الأكثر مهنية.`
              : `This mission helps you turn "${title}" from theory into exam-ready judgment: understand what is being tested, eliminate weak answers, and choose the most professional action.`}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <div style={{ background: SURFACE_SOFT, borderRadius: '16px', padding: '14px 16px' }}>
            <p style={{ margin: '0 0 8px', color: FAINT, fontSize: '11px', fontWeight: 900, letterSpacing: '0.08em' }}>
              {isAr ? 'موضعك الآن' : 'Where you are'}
            </p>
            <div style={{ height: '7px', borderRadius: '999px', background: BORDER, overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: '25%', background: TEAL }} />
            </div>
            <p style={{ margin: 0, color: MUTED, fontSize: '13px', fontWeight: 800 }}>
              {isAr ? 'المعاينة: تهيئة الهدف قبل التعلّم' : 'Preview: orient the goal before learning'}
            </p>
          </div>

          <div style={{ background: SURFACE_SOFT, borderRadius: '16px', padding: '14px 16px' }}>
            <p style={{ margin: '0 0 6px', color: FAINT, fontSize: '11px', fontWeight: 900, letterSpacing: '0.08em' }}>
              {isAr ? 'التالي' : 'Up next'}
            </p>
            <p style={{ margin: '0 0 4px', color: TEXT, fontSize: '14px', fontWeight: 950 }}>
              {isAr ? 'تعلّم المفهوم بعمق' : 'Learn the concept deeply'}
            </p>
            <p style={{ margin: 0, color: FAINT, fontSize: '12px', fontWeight: 700 }}>
              {isAr ? 'ثم انتقل إلى التصوّر والتطبيق' : 'Then move into visualize and apply'}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '14px',
            justifyContent: isAr ? 'flex-end' : 'flex-start',
          }}
        >
          <Link
            href={primaryCtaHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              borderRadius: '14px',
              background: TEAL,
              color: '#FFFFFF',
              padding: '13px 22px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 950,
              boxShadow: '0 12px 24px rgba(15, 110, 86, 0.18)',
            }}
          >
            {isAr ? (
              <>
                <ArrowLeft size={17} />
                ابدأ المهمة · {lesson.estimatedMinutes} دقيقة
              </>
            ) : (
              <>
                Begin mission · {lesson.estimatedMinutes} min
                <ArrowRight size={17} />
              </>
            )}
          </Link>

          <Link
            href={practiceHref}
            style={{
              color: TEAL,
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 900,
            }}
          >
            {isAr ? 'واثق من هذا المفهوم؟ انتقل إلى التمرين ←' : 'Already strong here? Skip to practice →'}
          </Link>
        </div>
      </section>
    </div>
  );
}
