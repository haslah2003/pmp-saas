'use client';

import { useState } from 'react';
import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
}

interface MindMapNode {
  id: string;
  label: string;
  color: string;
  children: string[];
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

const MINDMAP_NODES: Record<string, MindMapNode> = {
  root: {
    id: 'root',
    label: 'PMP Mindset',
    color: '#7030A0',
    children: ['strategic', 'servant', 'integration', 'proactive', 'risk'],
  },
  strategic: {
    id: 'strategic',
    label: 'Strategic Orientation',
    color: '#1B6B7B',
    children: ['strategic-1', 'strategic-2', 'strategic-3'],
  },
  'strategic-1': { id: 'strategic-1', label: 'Business Value Focus', color: '#1B6B7B', children: [] },
  'strategic-2': { id: 'strategic-2', label: 'Long-term Thinking', color: '#1B6B7B', children: [] },
  'strategic-3': { id: 'strategic-3', label: 'Portfolio Perspective', color: '#1B6B7B', children: [] },
  servant: {
    id: 'servant',
    label: 'Servant Leadership',
    color: '#BA7517',
    children: ['servant-1', 'servant-2', 'servant-3'],
  },
  'servant-1': { id: 'servant-1', label: 'Team Development', color: '#BA7517', children: [] },
  'servant-2': { id: 'servant-2', label: 'Organizational Good', color: '#BA7517', children: [] },
  'servant-3': { id: 'servant-3', label: 'Difficult Decisions', color: '#BA7517', children: [] },
  integration: {
    id: 'integration',
    label: 'Integration',
    color: '#D85A30',
    children: ['integration-1', 'integration-2', 'integration-3'],
  },
  'integration-1': { id: 'integration-1', label: 'Temporal Integration', color: '#D85A30', children: [] },
  'integration-2': { id: 'integration-2', label: 'Organizational Integration', color: '#D85A30', children: [] },
  'integration-3': { id: 'integration-3', label: 'Portfolio Integration', color: '#D85A30', children: [] },
  proactive: {
    id: 'proactive',
    label: 'Proactive Management',
    color: '#4B7B3A',
    children: ['proactive-1', 'proactive-2', 'proactive-3'],
  },
  'proactive-1': { id: 'proactive-1', label: 'Decision Trees', color: '#4B7B3A', children: [] },
  'proactive-2': { id: 'proactive-2', label: 'Response Protocols', color: '#4B7B3A', children: [] },
  'proactive-3': { id: 'proactive-3', label: 'Capacity Building', color: '#4B7B3A', children: [] },
  risk: {
    id: 'risk',
    label: 'Risk Calibration',
    color: '#8B5A8C',
    children: ['risk-1', 'risk-2', 'risk-3'],
  },
  'risk-1': { id: 'risk-1', label: 'Competitive Pressure', color: '#8B5A8C', children: [] },
  'risk-2': { id: 'risk-2', label: 'Org. Maturity', color: '#8B5A8C', children: [] },
  'risk-3': { id: 'risk-3', label: 'Regulatory Climate', color: '#8B5A8C', children: [] },
};

export function VisualizeStep({ lesson, phaseId, locale }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (nodeId: string, level: number = 0): JSX.Element => {
    const node = MINDMAP_NODES[nodeId];
    const isExpanded = expanded.has(nodeId);
    const hasChildren = node.children.length > 0;
    const levelIndent = level * 32;
    const isRoot = level === 0;

    return (
      <div key={nodeId} style={{ marginLeft: `${levelIndent}px` }}>
        <button
          onClick={() => toggleNode(nodeId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: isRoot ? '16px 20px' : '12px 14px',
            margin: '6px 0',
            background: node.color,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: isRoot ? '15px' : '13px',
            fontWeight: isRoot ? 600 : 500,
            cursor: hasChildren ? 'pointer' : 'default',
            opacity: hasChildren ? 1 : 0.9,
            transition: 'all 0.15s',
            minWidth: '160px',
            textAlign: 'left',
          }}
        >
          {hasChildren && (
            <span
              style={{
                fontSize: '12px',
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                display: 'inline-block',
                minWidth: '12px',
              }}
            >
              ▶
            </span>
          )}
          {!hasChildren && <span style={{ minWidth: '12px' }}></span>}
          <span>{node.label}</span>
        </button>

        {hasChildren && isExpanded && (
          <div style={{ marginTop: '4px' }}>
            {node.children.map((childId) => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      <div style={{ background: '#FAFAF9', padding: '24px', borderRadius: '8px', border: '1px solid #E5E5E3' }}>
        {renderNode('root')}
      </div>
    </div>
  );
}
