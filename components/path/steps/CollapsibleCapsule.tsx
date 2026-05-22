'use client';

import { useState } from 'react';
import type { MarkdownSection, MarkdownSubsection } from '@/lib/pmp-path/parseMarkdown';
import type { Locale } from '@/lib/pmp-path/types';

interface Props {
  section: MarkdownSection;
  sectionIndex: number;
  locale: Locale;
}

const EN_SECTION_TITLES: Record<string, string> = {
  overview: 'Overview',
  'advanced analysis': 'Advanced Analysis',
  'additional frameworks models': 'Additional Frameworks & Models',
  'additional frameworks and models': 'Additional Frameworks & Models',
  'case study': 'Case Study',
  'performance domain connections': 'Performance Domain Connections',
  'advanced exam patterns': 'Advanced Exam Patterns',
  'pmbok 8 eco 2026 updates': 'PMBOK 8 & ECO 2026 Updates',
};

function normalizeTitleKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[*#:`"'’]/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF\s]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatSectionTitle(title: string, isAr: boolean) {
  if (isAr) return title;

  return EN_SECTION_TITLES[normalizeTitleKey(title)] ?? title;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.+?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`} style={{ fontWeight: 800, color: '#1F1F1F' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function TextBlock({ lines, isAr }: { lines: string[]; isAr: boolean }) {
  const cleaned = lines.filter((line, index, arr) => {
    if (line.trim()) return true;
    return arr[index - 1]?.trim() && arr[index + 1]?.trim();
  });

  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        direction: isAr ? 'rtl' : 'ltr',
        textAlign: isAr ? 'right' : 'left',
      }}
    >
      {cleaned.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={`space-${index}`} style={{ height: '4px' }} />;
        }

        const bullet = trimmed.match(/^[\-•]\s+(.+)$/);
        if (bullet) {
          return (
            <div
              key={`${trimmed}-${index}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '8px',
                color: '#4A4A46',
                fontSize: isAr ? '15px' : '16px',
                lineHeight: isAr ? 1.75 : 1.8,
                direction: isAr ? 'rtl' : 'ltr',
                textAlign: isAr ? 'right' : 'left',
              }}
            >
              <span style={{ color: '#0E6F7E', fontWeight: 900, flexShrink: 0 }}>•</span>
              <span>{renderInlineMarkdown(bullet[1] ?? '')}</span>
            </div>
          );
        }

        return (
          <p
            key={`${trimmed}-${index}`}
            style={{
              margin: 0,
              color: '#4A4A46',
              fontSize: isAr ? '15px' : '16px',
              lineHeight: isAr ? 1.75 : 1.82,
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function NestedCapsule({
  subsection,
  isAr,
  defaultOpen = false,
}: {
  subsection: MarkdownSubsection;
  isAr: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const disclosureIcon = open ? '▼' : isAr ? '◀' : '▶';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        border: '1px solid #E8E6E0',
        borderRadius: '12px',
        background: open ? '#FFFFFF' : '#FAFAF9',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          width: '100%',
          border: 0,
          background: 'transparent',
          padding: isAr ? '14px 52px 14px 16px' : '14px 16px 14px 52px',
          position: 'relative',
          textAlign: isAr ? 'right' : 'left',
          cursor: 'pointer',
          minHeight: '48px',
        }}
      >
        <span
          style={{
            color: '#0E6F7E',
            fontSize: '15px',
            transform: 'translateY(-50%)',
            transition: 'none',
            display: 'inline-block',
            position: 'absolute',
            top: '50%',
            right: isAr ? '16px' : 'auto',
            left: isAr ? 'auto' : '16px',
          }}
        >
          {disclosureIcon}
        </span>
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#1F1F1F' }}>
          {subsection.title}
        </span>
      </button>

      {open && (
        <div style={{ padding: isAr ? '0 52px 16px 16px' : '0 16px 16px 52px' }}>
          <TextBlock lines={subsection.content} isAr={isAr} />
        </div>
      )}
    </div>
  );
}

export function CollapsibleCapsule({ section, sectionIndex, locale }: Props) {
  const [open, setOpen] = useState(sectionIndex === 0);
  const isAr = locale === 'ar';
  const disclosureIcon = open ? '▼' : isAr ? '◀' : '▶';

  return (
    <section
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        border: '1px solid #E3E0DA',
        borderRadius: '14px',
        background: '#FFFFFF',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          width: '100%',
          border: 0,
          background: '#FFFFFF',
          padding: isAr ? '18px 56px 18px 20px' : '18px 20px 18px 56px',
          position: 'relative',
          textAlign: isAr ? 'right' : 'left',
          cursor: 'pointer',
          minHeight: '58px',
        }}
      >
        <span
          style={{
            color: '#7030A0',
            fontSize: '17px',
            transform: 'translateY(-50%)',
            transition: 'none',
            display: 'inline-block',
            position: 'absolute',
            top: '50%',
            right: isAr ? '20px' : 'auto',
            left: isAr ? 'auto' : '20px',
          }}
        >
          {disclosureIcon}
        </span>
        <span style={{ fontSize: '17px', fontWeight: 900, color: '#1F1F1F' }}>
          {formatSectionTitle(section.title, isAr)}
        </span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #EEECE7', padding: '18px 20px 22px' }}>
          {section.content.length > 0 && (
            <div style={{ marginBottom: section.subsections.length > 0 ? '18px' : 0 }}>
              <TextBlock lines={section.content} isAr={isAr} />
            </div>
          )}

          {section.subsections.length > 0 && (
            <div style={{ display: 'grid', gap: '10px' }}>
              {section.subsections.map((subsection) => (
                <NestedCapsule
                  key={subsection.id}
                  subsection={subsection}
                  isAr={isAr}
                  defaultOpen={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
