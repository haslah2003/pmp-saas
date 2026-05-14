'use client';

import { useState } from 'react';
import type { MarkdownSection } from '@/lib/pmp-path/parseMarkdown';

interface Props {
  section: MarkdownSection;
  sectionIndex: number;
}

const SECTION_ARROW_COLORS = ['#7030A0', '#1B6B7B', '#BA7517'];
const SUBSECTION_ARROW_COLOR = '#1B6B7B';

export function CollapsibleCapsule({ section, sectionIndex }: Props) {
  const [expanded, setExpanded] = useState(true);

  const arrowColor = SECTION_ARROW_COLORS[sectionIndex % SECTION_ARROW_COLORS.length];

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: '#FAFAF9',
          border: '1px solid #E5E5E3',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          color: '#1a1a1a',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F5F3F0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#FAFAF9';
        }}
      >
        <span
          style={{
            fontSize: '16px',
            color: arrowColor,
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block',
            minWidth: '16px',
          }}
        >
          ▶
        </span>
        <span>{section.title}</span>
      </button>

      {expanded && (
        <div style={{ paddingLeft: '16px', marginTop: '12px' }}>
          {section.baseContent && (
            <p style={{ fontSize: '13px', color: '#4A4A48', lineHeight: 1.6, marginBottom: '12px' }}>
              {section.baseContent}
            </p>
          )}

          {section.subsections.map((sub) => (
            <div key={sub.id} style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    color: SUBSECTION_ARROW_COLOR,
                    fontSize: '12px',
                    marginTop: '3px',
                    minWidth: '12px',
                  }}
                >
                  ▶
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                  }}
                >
                  {sub.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: '#4A4A48',
                  lineHeight: 1.6,
                  marginLeft: '20px',
                  margin: '0 0 8px 20px',
                }}
              >
                {sub.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
