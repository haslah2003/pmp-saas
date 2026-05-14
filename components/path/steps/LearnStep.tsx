'use client';

import { useEffect, useState } from 'react';
import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import { parseMarkdownSections, type MarkdownSection } from '@/lib/pmp-path/parseMarkdown';
import { CollapsibleCapsule } from './CollapsibleCapsule';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

export function LearnStep({ lesson, phaseId, locale }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const [sections, setSections] = useState<MarkdownSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const objective = isAr ? lesson.objective.ar : lesson.objective.en;

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
            content: objective,
            lessonTitle: isAr ? lesson.title.ar : lesson.title.en,
            domain: 'People',
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
        setSections(parsedSections);
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
            <CollapsibleCapsule key={section.id} section={section} sectionIndex={index} />
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
