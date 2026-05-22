'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import type { LessonVideo } from '@/lib/pmp-path/videos';
import { themeFor } from '@/lib/pmp-path/colors';
import { parseMarkdownSections, type MarkdownSection } from '@/lib/pmp-path/parseMarkdown';
import { CollapsibleCapsule } from './CollapsibleCapsule';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
  videos?: LessonVideo[];
  canonicalContentMarkdown?: string | null;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

const AR_SECTION_TITLES: Record<string, string> = {
  overview: 'نظرة عامة',
  'advanced analysis': 'تحليل متقدم',
  'additional frameworks & models': 'أطر ونماذج إضافية',
  'additional frameworks and models': 'أطر ونماذج إضافية',
};

function normalizeTitleKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[*#:`"'’]/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF&\s]+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function localizeSectionTitle(title: string, locale: Locale) {
  if (locale !== 'ar') return title;

  return AR_SECTION_TITLES[normalizeTitleKey(title)] ?? title;
}

function cleanVisibleMarkdownHeading(line: string) {
  const trimmed = line.trim();

  if (/^#{1,6}\s+/.test(trimmed)) {
    return trimmed.replace(/^#{1,6}\s+/, '').trim();
  }

  return line;
}

function prepareLearnSections(sections: MarkdownSection[], locale: Locale): MarkdownSection[] {
  return sections.map((section) => ({
    ...section,
    title: localizeSectionTitle(section.title, locale),
    content: section.content.map(cleanVisibleMarkdownHeading),
    subsections: section.subsections.map((subsection) => ({
      ...subsection,
      title: localizeSectionTitle(subsection.title, locale),
      content: subsection.content.map(cleanVisibleMarkdownHeading),
    })),
  }));
}

function formatDuration(seconds: number | null, locale: Locale) {
  if (!seconds || seconds <= 0) return null;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const value = `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;

  return locale === 'ar' ? `${value} دقيقة` : `${value} min`;
}

export function LearnStep({ lesson, phaseId, locale, videos = [], canonicalContentMarkdown = null }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const canonicalSections = useMemo(() => {
    if (!canonicalContentMarkdown?.trim()) return [];

    return prepareLearnSections(parseMarkdownSections(canonicalContentMarkdown), locale);
  }, [canonicalContentMarkdown, locale]);

  const [sections, setSections] = useState<MarkdownSection[]>(canonicalSections);
  const [loading, setLoading] = useState(canonicalSections.length === 0);
  const [error, setError] = useState<string | null>(null);

  const objective = isAr ? lesson.objective.ar : lesson.objective.en;
  const lessonTitle = isAr ? lesson.title.ar : lesson.title.en;
  const hasVideos = videos.length > 0;

  const focusItems = isAr
    ? [
        {
          label: 'الفكرة الأساسية',
          detail: `افهم معنى "${lessonTitle}" بلغة واضحة قبل الدخول في التفاصيل.`,
        },
        {
          label: 'حكم الامتحان',
          detail: 'اربط المفهوم بسؤال: ما التصرف الأكثر مهنية في سيناريو PMP؟',
        },
        {
          label: 'مرساة التذكّر',
          detail: 'استخرج عبارة قصيرة تساعدك على تذكّر الفكرة أثناء حل الأسئلة.',
        },
      ]
    : [
        {
          label: 'Core idea',
          detail: `Understand "${lessonTitle}" in plain language before going deeper.`,
        },
        {
          label: 'Exam judgment',
          detail: 'Connect the concept to one question: what is the most professional action in a PMP scenario?',
        },
        {
          label: 'Recall anchor',
          detail: 'Create a short phrase that helps you remember the idea while answering questions.',
        },
      ];

  useEffect(() => {
    if (canonicalContentMarkdown?.trim()) {
      setSections(canonicalSections);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/deeper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sectionType: 'deepdive',
            content: { heading: 'Lesson objective', content: objective },
            lessonTitle: isAr ? lesson.title.ar : lesson.title.en,
            domain: 'business-environment',
            framework: 'pmbok8',
            language: locale,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }
        fullContent += decoder.decode();

        const parsedSections = parseMarkdownSections(fullContent);
        setSections(prepareLearnSections(parsedSections, locale));
      } catch (err) {
        console.error('LearnStep error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [lesson, locale, objective, isAr, canonicalContentMarkdown, canonicalSections]);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      <section
        aria-label={isAr ? 'تركيز خطوة التعلم' : 'Learn step focus'}
        style={{
          background: `linear-gradient(135deg, ${theme.palest}, #FFFFFF)`,
          border: `1px solid ${theme.pale}`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: isAr ? 'right' : 'left',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: theme.pale,
              color: theme.textOnPale,
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '10px',
            }}
          >
            <span>📘</span>
            <span>{isAr ? 'خطوة التعلّم' : 'Learn step'}</span>
          </div>

          <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#1F1F1D', lineHeight: 1.25 }}>
            {isAr ? 'ابنِ الفهم قبل الانتقال إلى التطبيق' : 'Build understanding before moving to application'}
          </h2>

          <p style={{ margin: 0, color: '#6B6B68', fontSize: '14px', lineHeight: 1.75 }}>
            {isAr
              ? `هذه الخطوة تحول هدف الدرس إلى شرح منظم، أمثلة عملية، ومعايير حكم تساعدك على التعامل مع أسئلة السيناريوهات بثقة.`
              : `This step turns the lesson objective into structured explanation, practical examples, and decision criteria for scenario-based questions.`}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
          }}
        >
          {focusItems.map((item) => (
            <div
              key={item.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(26,20,48,0.08)',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <p style={{ margin: '0 0 6px', color: theme.textOnPale, fontSize: '12px', fontWeight: 900 }}>
                {item.label}
              </p>
              <p style={{ margin: 0, color: '#3F3F46', fontSize: '13px', lineHeight: 1.6 }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {hasVideos && (
        <section
          style={{
            background: `linear-gradient(135deg, ${theme.palest}, #FFFFFF)`,
            border: `1px solid ${theme.pale}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ marginBottom: '16px', textAlign: isAr ? 'right' : 'left' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: theme.pale,
                color: theme.textOnPale,
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <span>▶</span>
              <span>{isAr ? 'شاهد' : 'Watch'}</span>
            </div>

            <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#1F1F1D' }}>
              {isAr ? 'مرساة فيديو قبل القراءة' : 'Video anchor before reading'}
            </h2>

            <p style={{ margin: 0, color: '#6B6B68', fontSize: '14px', lineHeight: 1.7 }}>
              {isAr
                ? 'شاهد الفكرة الأساسية أولًا، ثم استخدم الشرح المكتوب لتثبيت التفاصيل وتحويلها إلى حكم امتحاني.'
                : 'Watch the core idea first, then use the written explanation to lock the details into exam-ready judgment.'}
            </p>
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            {videos.map((video) => {
              const duration = formatDuration(video.durationSeconds, locale);

              return (
                <div
                  key={video.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E8E6E0',
                    overflow: 'hidden',
                  }}
                >
                  <video
                    controls
                    preload="metadata"
                    poster={video.thumbnailUrl ?? undefined}
                    style={{
                      width: '100%',
                      display: 'block',
                      background: '#111111',
                    }}
                  >
                    <source src={video.videoUrl} />
                    {isAr
                      ? 'متصفحك لا يدعم تشغيل الفيديو.'
                      : 'Your browser does not support the video element.'}
                  </video>

                  <div style={{ padding: '14px 16px', textAlign: isAr ? 'right' : 'left' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#1F1F1D' }}>
                      {video.title}
                    </h3>

                    {video.description && (
                      <p style={{ margin: '0 0 8px', color: '#6B6B68', fontSize: '13px', lineHeight: 1.6 }}>
                        {video.description}
                      </p>
                    )}

                    {duration && (
                      <p style={{ margin: 0, color: '#999999', fontSize: '12px' }}>
                        {isAr ? 'المدة' : 'Duration'}: {duration}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {loading && (
        <section
          style={{
            background: '#FAFAF9',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            border: '1px solid #E8E6E0',
          }}
        >
          <div style={{ fontSize: '22px', marginBottom: '10px' }}>⏳</div>
          <p style={{ margin: '0 0 6px', color: '#1F1F1D', fontSize: '15px', fontWeight: 900 }}>
            {isAr ? 'جاري بناء الشرح العميق...' : 'Building the deep explanation...'}
          </p>
          <p style={{ margin: 0, color: '#6B6B68', fontSize: '13px', lineHeight: 1.6 }}>
            {isAr
              ? 'يتم تنظيم المفهوم في أقسام قابلة للقراءة والمراجعة.'
              : 'The concept is being organized into readable, reviewable sections.'}
          </p>
        </section>
      )}

      {error && (
        <section
          style={{
            background: '#FEE8E8',
            borderRadius: '16px',
            padding: '18px',
            color: '#C41E3A',
            fontSize: '13px',
            border: '1px solid #F8B4B4',
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          <p style={{ margin: '0 0 6px', fontWeight: 900 }}>
            {isAr ? 'تعذر تحميل شرح الدرس' : 'Could not load the lesson explanation'}
          </p>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            {isAr
              ? 'حاول تحديث الصفحة. إذا استمرت المشكلة، انتقل إلى التمرين أو عد لاحقًا.'
              : 'Try refreshing the page. If the issue continues, move to practice or return later.'}
          </p>
          <p style={{ margin: '8px 0 0', opacity: 0.8 }}>Error: {error}</p>
        </section>
      )}

      {!loading && !error && sections.length > 0 && (
        <section style={{ display: 'grid', gap: '14px' }}>
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <p
              style={{
                margin: '0 0 6px',
                color: theme.textOnPale,
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {isAr ? 'الشرح المنظم' : 'Structured deep dive'}
            </p>
            <p style={{ margin: 0, color: '#4F4F4B', fontSize: '14px', lineHeight: 1.75 }}>
              {isAr
                ? 'افتح الأقسام بالترتيب، ثم لخّص كل قسم بجملة واحدة قبل الانتقال إلى الخطوة التالية.'
                : 'Open the sections in order, then summarize each section in one sentence before moving to the next step.'}
            </p>
          </div>

          <div>
            {sections.map((section, index) => (
              <CollapsibleCapsule key={section.id} section={section} sectionIndex={index} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {!loading && !error && sections.length === 0 && (
        <section
          style={{
            background: '#FAFAF9',
            padding: '18px',
            borderRadius: '16px',
            color: '#6B6B68',
            border: '1px solid #E8E6E0',
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          {isAr
            ? 'لا يوجد شرح متاح حالياً لهذا الدرس.'
            : 'No structured explanation is available for this lesson yet.'}
        </section>
      )}
    </div>
  );
}
