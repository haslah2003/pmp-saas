'use client';

import { useState } from 'react';
import type { MarkdownSection, MarkdownSubsection } from '@/lib/pmp-path/parseMarkdown';

interface Props {
  section: MarkdownSection;
  sectionIndex: number;
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

function TextBlock({ lines }: { lines: string[] }) {
  const cleaned = lines.filter((line, index, arr) => {
    if (line.trim()) return true;
    return arr[index - 1]?.trim() && arr[index + 1]?.trim();
  });

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
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
                display: 'grid',
                gridTemplateColumns: '18px 1fr',
                gap: '8px',
                color: '#4A4A46',
                fontSize: '15px',
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: '#0E6F7E', fontWeight: 900 }}>•</span>
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
              fontSize: '15px',
              lineHeight: 1.75,
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
  defaultOpen = false,
}: {
  subsection: MarkdownSubsection;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
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
          padding: '14px 16px',
          display: 'grid',
          gridTemplateColumns: '22px 1fr',
          gap: '10px',
          alignItems: 'center',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            color: '#0E6F7E',
            fontSize: '15px',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 160ms ease',
            display: 'inline-block',
          }}
        >
          ▶
        </span>
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#1F1F1F' }}>
          {subsection.title}
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px 48px' }}>
          <TextBlock lines={subsection.content} />
        </div>
      )}
    </div>
  );
}

export function CollapsibleCapsule({ section, sectionIndex }: Props) {
  const [open, setOpen] = useState(sectionIndex === 0);

  return (
    <section
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
          padding: '18px 20px',
          display: 'grid',
          gridTemplateColumns: '24px 1fr',
          gap: '12px',
          alignItems: 'center',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            color: '#7030A0',
            fontSize: '17px',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 160ms ease',
            display: 'inline-block',
          }}
        >
          ▶
        </span>
        <span style={{ fontSize: '17px', fontWeight: 900, color: '#1F1F1F' }}>
          {section.title}
        </span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #EEECE7', padding: '18px 20px 22px' }}>
          {section.content.length > 0 && (
            <div style={{ marginBottom: section.subsections.length > 0 ? '18px' : 0 }}>
              <TextBlock lines={section.content} />
            </div>
          )}

          {section.subsections.length > 0 && (
            <div style={{ display: 'grid', gap: '10px' }}>
              {section.subsections.map((subsection) => (
                <NestedCapsule
                  key={subsection.id}
                  subsection={subsection}
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
