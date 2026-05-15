'use client';

import { useEffect, useState } from 'react';
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

export function LearnStep({ lesson, phaseId, locale, videos = [] }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const [sections, setSections] = useState<MarkdownSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const objective = isAr ? lesson.objective.ar : lesson.objective.en;
  const hasVideos = videos.length > 0;

  useEffect(() => {
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
  }, [lesson, locale, objective, isAr]);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
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
              {isAr ? 'شرح فيديو قصير قبل التعمق في الدرس' : 'Short video explanation before the deep dive'}
            </h2>

            <p style={{ margin: 0, color: '#6B6B68', fontSize: '14px', lineHeight: 1.7 }}>
              {isAr
                ? 'ابدأ بمشاهدة الفكرة الأساسية، ثم انتقل إلى القراءة والتحليل المتقدم.'
                : 'Start with the core idea, then continue into the structured explanation and advanced analysis.'}
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
        <div style={{ background: '#FAFAF9', borderRadius: '8px', padding: '28px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '10px' }}>⏳</div>
          <p style={{ margin: 0 }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#FEE8E8', borderRadius: '8px', padding: '16px', color: '#C41E3A', fontSize: '13px' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && sections.length > 0 && (
        <div>
          {sections.map((section, index) => (
            <CollapsibleCapsule key={section.id} section={section} sectionIndex={index} locale={locale} />
          ))}
        </div>
      )}

      {!loading && !error && sections.length === 0 && (
        <div style={{ background: '#FAFAF9', padding: '16px', borderRadius: '8px', color: '#6B6B68' }}>
          No content
        </div>
      )}
    </div>
  );
}
