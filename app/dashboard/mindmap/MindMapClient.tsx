'use client';

import React, { useState } from 'react';
import { Card, Tabs, Badge } from '@/components/ui';
import { cn, getDomainColor } from '@/lib/utils';
import { PMBOK7_DOMAINS, ECO_MINDMAP, PMBOK7_PRINCIPLES } from '@/lib/pmp-data';
import type { MindMapNode, MindMapMode } from '@/types';

function MindMapNodeCard({ node, depth = 0 }: { node: MindMapNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const color = node.color || getDomainColor(node.id);

  return (
    <div className={cn(depth > 0 && 'ml-6 mt-2')}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={cn(
          'w-full text-left rounded-xl border transition-all duration-200 group',
          depth === 0 ? 'p-5 shadow-sm hover:shadow-md bg-white' : 'p-3 hover:bg-gray-50 bg-white/70 border-gray-200/60',
        )}
        style={depth === 0 ? { borderColor: color } : undefined}
      >
        <div className="flex items-start gap-3">
          {depth === 0 && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg"
              style={{ backgroundColor: color }}>
              {node.icon === 'Users' && '👥'}{node.icon === 'UserCheck' && '✅'}{node.icon === 'GitBranch' && '🔀'}
              {node.icon === 'ClipboardList' && '📋'}{node.icon === 'Wrench' && '🔧'}{node.icon === 'PackageCheck' && '📦'}
              {node.icon === 'BarChart3' && '📊'}{node.icon === 'AlertTriangle' && '⚠️'}{node.icon === 'Settings' && '⚙️'}
              {node.icon === 'Building' && '🏢'}{!node.icon && '📌'}
            </div>
          )}
          {depth > 0 && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: color }} />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(depth === 0 ? 'font-bold text-base' : depth === 1 ? 'font-semibold text-sm' : 'text-sm text-gray-700')}>
                {node.label}
              </h3>
              {hasChildren && (
                <svg className={cn('w-4 h-4 text-gray-300 transition-transform', expanded && 'rotate-90')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
            {node.description && depth < 2 && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{node.description}</p>}
          </div>
          {hasChildren && <Badge variant="default">{node.children!.length}</Badge>}
        </div>
      </button>
      {expanded && hasChildren && (
        <div className={cn(depth === 0 && 'border-l-2 ml-5 pl-0 mt-2')} style={depth === 0 ? { borderColor: `${color}30` } : undefined}>
          {node.children!.map((child) => <MindMapNodeCard key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function MindMapClient() {
  const [mode, setMode] = useState<MindMapMode>('pmbok7');
  const data = mode === 'pmbok7' ? PMBOK7_DOMAINS : ECO_MINDMAP;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mind Map Explorer</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize and explore PMP knowledge domains</p>
        </div>
        <Tabs
          tabs={[
            { id: 'pmbok7', label: 'PMBOK 7 Domains', icon: <span className="text-xs">📘</span> },
            { id: 'eco2021', label: 'ECO 2021 Tasks', icon: <span className="text-xs">📋</span> },
          ]}
          activeTab={mode}
          onChange={(id) => setMode(id as MindMapMode)}
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {data.map((node) => <MindMapNodeCard key={node.id} node={node} />)}
        </div>
        <div className="space-y-6">
          {mode === 'pmbok7' && (
            <Card padding="lg">
              <h3 className="font-bold text-gray-900 mb-1">12 Project Management Principles</h3>
              <p className="text-xs text-gray-400 mb-5">PMBOK 7th Edition foundational principles</p>
              <div className="space-y-2">
                {PMBOK7_PRINCIPLES.map((p) => (
                  <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{p.id}</span>
                    <span className="text-sm font-medium text-gray-700">{p.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card padding="lg">
            <h3 className="font-bold text-gray-900 mb-2">{mode === 'pmbok7' ? 'About PMBOK 7' : 'About ECO 2021'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {mode === 'pmbok7'
                ? 'The PMBOK Guide 7th Edition shifts from process-based to principle-based project management, organized around 8 Performance Domains and 12 Principles.'
                : 'The Examination Content Outline (ECO) 2021 defines the PMP exam structure: People (42%), Process (50%), and Business Environment (8%), with 35 total tasks.'}
            </p>
          </Card>
          {mode === 'eco2021' && (
            <Card padding="lg">
              <h3 className="font-bold text-gray-900 mb-3">Exam Weighting</h3>
              <div className="space-y-3">
                {[{ label: 'People', pct: 42, color: 'bg-blue-500' }, { label: 'Process', pct: 50, color: 'bg-emerald-500' }, { label: 'Business Env.', pct: 8, color: 'bg-amber-500' }].map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium">{d.label}</span><span className="text-gray-400">{d.pct}%</span></div>
                    <div className="w-full h-2.5 rounded-full bg-gray-100"><div className={cn('h-full rounded-full', d.color)} style={{ width: `${d.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
