'use client';

import React, { useState } from 'react';
import { Card, Tabs, Badge } from '@/components/ui';
import { cn, getDomainColor } from '@/lib/utils';
import { PMBOK7_DOMAINS, ECO_MINDMAP, PMBOK7_PRINCIPLES } from '@/lib/pmp-data';
import type { MindMapNode, MindMapMode } from '@/types';

// ── Print Styles ─────────────────────────────────────────────────────────────
const PrintStyles = () => (
  <style jsx global>{`
    @media print {
      @page { margin: 0.4in; size: A4; }
      html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      aside { display: none !important; }
      main { padding: 0 !important; margin: 0 !important; }
      .lg\\:col-span-7 { display: none !important; }
      .grid.lg\\:grid-cols-10 { display: block !important; }
      .lg\\:col-span-3 { width: 100% !important; max-width: 100% !important; grid-column: span 10 !important; }
      .flex.h-screen { display: block !important; }
      button { pointer-events: none; }
      [title="PMP Companion"] { display: none !important; }
      .fixed { display: none !important; position: static !important; }
    }
  `}</style>
);// ── Motivational Loading Messages ────────────────────────────────────────────

const PM_MESSAGES = [
  { text: "Crafting expert-level insights just for you...", sub: "Great PMs never stop learning" },
  { text: "Building your knowledge framework...", sub: "Every domain mastered brings you closer to PMP" },
  { text: "Analyzing best practices from PMBOK 7...", sub: "Precision in preparation leads to precision in practice" },
  { text: "Connecting theory to real-world scenarios...", sub: "The best project managers think in systems" },
  { text: "Preparing advanced analysis...", sub: "Deep understanding beats surface memorization" },
  { text: "Structuring your learning path...", sub: "You\'re investing in a career-defining credential" },
  { text: "Extracting key exam patterns...", sub: "Smart preparation is the hallmark of a true PM" },
];

function MotivationalMessage({ color }: { color: string }) {
  const [index, setIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PM_MESSAGES.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const msg = PM_MESSAGES[index];
  return (
    <div className={`text-center transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <p className="text-sm font-semibold text-gray-800">{msg.text}</p>
      <p className="text-xs mt-1.5 font-medium" style={{ color }}>{msg.sub}</p>
    </div>
  );
}

// ── Go Deeper Panel (AI-powered leaf-node expansion) ─────────────────────────

function GoDeeperSidebar({
  node,
  onClose,
}: {
  node: MindMapNode;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpContent, setFollowUpContent] = useState('');
  const color = node.color || getDomainColor(node.id);

  async function loadDeeper() {
    if (hasLoaded) return;
    setIsLoading(true);
    setHasLoaded(true);

    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'deepdive',
          content: `Topic: ${node.label}. Description: ${node.description || node.label}. This is a PMBOK 7th Edition / ECO 2021 mind map concept.`,
          lessonTitle: node.label,
          domain: node.id,
          framework: 'pmbok7',
        }),
      });
      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }
      // Reveal all content at once — no streaming flicker
      setAiContent(acc);
    } catch {
      setAiContent('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function sendFollowUp() {
    if (!followUp.trim()) return;
    setFollowUpLoading(true);
    setFollowUpContent('');
    const question = followUp;
    setFollowUp('');

    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'tip',
          content: `Context: ${node.label}. Previous analysis: ${aiContent.slice(0, 400)}. Follow-up question: ${question}`,
          lessonTitle: node.label,
          domain: node.id,
          framework: 'pmbok7',
        }),
      });
      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }
      setFollowUpContent(acc);
    } catch {
      setFollowUpContent('Something went wrong.');
    } finally {
      setFollowUpLoading(false);
    }
  }

  // Auto-load on mount
  React.useEffect(() => {
    loadDeeper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]);

  return (
    <Card padding="none">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: color }}>
          AI
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-gray-900 truncate">{node.label}</h3>
          <p className="text-[10px] text-gray-400">Go Deeper — AI Analysis</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {node.description && (
          <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">{node.description}</p>
          </div>
        )}

        {isLoading && !aiContent && (
          <div className="flex flex-col items-center justify-center py-10">
            {/* PM-themed animated icon — Gantt chart building */}
            <div className="relative w-20 h-20 mb-6">
              <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Circular track */}
                <circle cx="40" cy="40" r="34" fill="none" stroke={color + '15'} strokeWidth="4" />
                {/* Spinning progress arc */}
                <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                  strokeDasharray="60 154" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '2s' }} />
                {/* Inner Gantt bars */}
                <rect x="22" y="28" rx="2" width="0" height="5" fill={color} opacity="0.7">
                  <animate attributeName="width" values="0;20;0" dur="2.5s" repeatCount="indefinite" />
                </rect>
                <rect x="22" y="37" rx="2" width="0" height="5" fill={color} opacity="0.5">
                  <animate attributeName="width" values="0;28;0" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
                </rect>
                <rect x="22" y="46" rx="2" width="0" height="5" fill={color} opacity="0.6">
                  <animate attributeName="width" values="0;15;0" dur="2.5s" begin="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
            {/* Rotating motivational messages */}
            <MotivationalMessage color={color} />
            {/* Skeleton preview */}
            <div className="w-full mt-8 space-y-3 animate-pulse opacity-40">
              <div className="h-4 rounded-lg w-3/4 mx-auto" style={{ backgroundColor: color + '20' }} />
              <div className="h-3 bg-gray-200 rounded-md w-full" />
              <div className="h-3 bg-gray-200 rounded-md w-5/6" />
              <div className="h-3 bg-gray-100 rounded-md w-11/12" />
            </div>
          </div>
        )}

        {aiContent && (
          <div className="prose-sm">
            {aiContent.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h3>;
              if (line.startsWith('### ')) return <h4 key={i} className="text-base font-semibold text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h4>;
              if (line.startsWith('> ')) return <div key={i} className="border-l-3 pl-3 my-3 py-2 text-sm italic" style={{ borderColor: color + '60', color: color }}>{line.replace('> ', '')}</div>;
              if (line.match(/^[-*] /)) return <div key={i} className="flex items-start gap-2 my-1"><span className="mt-1 flex-shrink-0" style={{ color }}>•</span><span className="text-sm text-gray-700 leading-relaxed">{line.replace(/^[-*] /, '')}</span></div>;
              if (line.trim() === '') return <div key={i} className="h-2" />;
              const parts = line.split(/(\*\*[^*]+\*\*)/);
              return (
                <p key={i} className="text-sm text-gray-700 leading-relaxed mb-2">
                  {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={j}>{part.replace(/\*\*/g, '')}</strong>
                      : part
                  )}
                </p>
              );
            })}
            
          </div>
        )}

        {/* Follow-up question */}
        {!isLoading && aiContent && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">💬 Ask a follow-up</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendFollowUp()}
                placeholder="e.g. How does this apply in agile?"
                className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
              />
              <button
                onClick={sendFollowUp}
                disabled={!followUp.trim() || followUpLoading}
                className="text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                {followUpLoading ? '...' : 'Ask'}
              </button>
            </div>

            {(followUpContent || followUpLoading) && (
              <div className="mt-3 bg-gray-50 rounded-xl border border-gray-100 p-3">
                {followUpLoading && !followUpContent && (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-3.5 bg-gray-200 rounded-md w-full" />
                    <div className="h-3.5 bg-gray-100 rounded-md w-5/6" />
                    <div className="h-3.5 bg-gray-200 rounded-md w-11/12" />
                    <p className="text-xs text-gray-400 text-center pt-1">Thinking...</p>
                  </div>
                )}
                {followUpContent && (
                  <div className="space-y-0.5">
                    {followUpContent.split('\n').map((line, i) => {
                      if (line.trim() === '') return <div key={i} className="h-1" />;
                      if (line.match(/^[-*] /)) return <div key={i} className="flex items-start gap-2 my-1"><span style={{ color }}>•</span><span className="text-xs text-gray-700">{line.replace(/^[-*] /, '')}</span></div>;
                      return <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>;
                    })}
                    {followUpLoading && <span className="inline-block w-1.5 h-4 animate-pulse ml-0.5 rounded-sm" style={{ backgroundColor: color }} />}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// ── MindMap Node Card ─────────────────────────────────────────────────────────

function MindMapNodeCard({
  node,
  depth = 0,
  selectedLeaf,
  onLeafSelect,
}: {
  node: MindMapNode;
  depth?: number;
  selectedLeaf: string | null;
  onLeafSelect: (node: MindMapNode | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;
  const color = node.color || getDomainColor(node.id);
  const isSelected = selectedLeaf === node.id;

  function handleClick() {
    if (hasChildren) {
      setExpanded(!expanded);
    } else {
      // Leaf node — toggle Go Deeper panel
      onLeafSelect(isSelected ? null : node);
    }
  }

  return (
    <div className={cn(depth > 0 && 'ml-6 mt-2')}>
      <button
        onClick={handleClick}
        className={cn(
          'w-full text-left rounded-xl border transition-all duration-200 group',
          depth === 0
            ? 'p-5 shadow-sm hover:shadow-md bg-white'
            : 'p-3 hover:bg-gray-50 bg-white/70 border-gray-200/60',
          isLeaf && 'cursor-pointer',
          isSelected && 'ring-2 ring-offset-1 bg-blue-50/50',
        )}
        style={{
          borderColor: isSelected ? color : depth === 0 ? color : undefined,
          ...(isSelected ? { ringColor: color } : {}),
        }}
      >
        <div className="flex items-start gap-3">
          {depth === 0 && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg"
              style={{ backgroundColor: color }}
            >
              {node.icon === 'Users' && '👥'}{node.icon === 'UserCheck' && '✅'}{node.icon === 'GitBranch' && '🔀'}
              {node.icon === 'ClipboardList' && '📋'}{node.icon === 'Wrench' && '🔧'}{node.icon === 'PackageCheck' && '📦'}
              {node.icon === 'BarChart3' && '📊'}{node.icon === 'AlertTriangle' && '⚠️'}{node.icon === 'Settings' && '⚙️'}
              {node.icon === 'Building' && '🏢'}{!node.icon && '📌'}
            </div>
          )}
          {depth > 0 && (
            <div
              className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-2', isSelected && 'w-3 h-3')}
              style={{ backgroundColor: color }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  depth === 0 ? 'font-bold text-base' : depth === 1 ? 'font-semibold text-sm' : 'text-sm text-gray-700',
                  isSelected && 'font-bold',
                )}
                style={isSelected ? { color } : undefined}
              >
                {node.label}
              </h3>
              {hasChildren && (
                <svg
                  className={cn('w-4 h-4 text-gray-300 transition-transform', expanded && 'rotate-90')}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLeaf && depth > 0 && (
                <span
                  className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors',
                    isSelected ? 'text-white' : 'text-gray-400 bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600',
                  )}
                  style={isSelected ? { backgroundColor: color } : undefined}
                >
                  {isSelected ? '✕ Close' : 'Go Deeper →'}
                </span>
              )}
            </div>
            {node.description && depth < 2 && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{node.description}</p>
            )}
          </div>
          {hasChildren && <Badge variant="default">{node.children!.length}</Badge>}
        </div>
      </button>
      {expanded && hasChildren && (
        <div
          className={cn(depth === 0 && 'border-l-2 ml-5 pl-0 mt-2')}
          style={depth === 0 ? { borderColor: `${color}30` } : undefined}
        >
          {node.children!.map((child) => (
            <MindMapNodeCard
              key={child.id}
              node={{ ...child, color: child.color || color }}
              depth={depth + 1}
              selectedLeaf={selectedLeaf}
              onLeafSelect={onLeafSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main MindMap Client ──────────────────────────────────────────────────────

export default function MindMapClient() {
  const [mode, setMode] = useState<MindMapMode>('pmbok7');
  const [selectedLeaf, setSelectedLeaf] = useState<MindMapNode | null>(null);
  const data = mode === 'pmbok7' ? PMBOK7_DOMAINS : ECO_MINDMAP;

  function handleLeafSelect(node: MindMapNode | null) {
    setSelectedLeaf(node);
  }

  function handleModeChange(id: string) {
    setMode(id as MindMapMode);
    setSelectedLeaf(null);
  }

  return (
    <div className="space-y-6">
        <PrintStyles />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mind Map Explorer</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize and explore PMP knowledge domains</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="text-sm bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 no-print"
          >
            🖨️ Export PDF
          </button>
          <Tabs
          tabs={[
            { id: 'pmbok7', label: 'PMBOK 7 Domains', icon: <span className="text-xs">📘</span> },
            { id: 'eco2021', label: 'ECO 2021 Tasks', icon: <span className="text-xs">📋</span> },
          ]}
          activeTab={mode}
          onChange={handleModeChange}
        />
              </div>
      </div>
      <div className="grid lg:grid-cols-10 gap-6">
        {/* Left: MindMap Tree */}
        <div className="lg:col-span-3 space-y-3">
          {data.map((node) => (
            <MindMapNodeCard
              key={node.id}
              node={node}
              selectedLeaf={selectedLeaf?.id ?? null}
              onLeafSelect={handleLeafSelect}
            />
          ))}
        </div>

        {/* Right: Context Panel — switches between Go Deeper and default info */}
        <div className="lg:col-span-7 space-y-6">
          {selectedLeaf ? (
            <GoDeeperSidebar
              key={selectedLeaf.id}
              node={selectedLeaf}
              onClose={() => setSelectedLeaf(null)}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
