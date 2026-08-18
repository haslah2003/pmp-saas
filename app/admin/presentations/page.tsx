'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { EXAM_PATHS, EXAM_PATH_ORDER } from '@/lib/pmp/exam-paths';
import type { ExamPathId } from '@/lib/pmp/exam-paths';
import { DECK_TEMPLATES } from '@/lib/study-studio/presentation/templates';
import type { DeckTemplateId } from '@/lib/study-studio/presentation/types';

type DeckLocale = 'en' | 'ar';

type SlidePreview = {
  n: number;
  layout: string;
  headline: string;
  kicker?: string;
  citationRefs: number[];
};

type DeckSpecPreview = {
  meta: { topic: string; pathway: string; pathwayLabel: string; grounded: boolean; requestedSlideCount: number; templateId: DeckTemplateId };
  title: string;
  subtitle: string;
  slides: SlidePreview[];
  citations: { ref: number; source_title: string; chunk_title: string; framework: string }[];
};

const LOCALES: { id: DeckLocale; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
];

const LAYOUT_ICON: Record<string, string> = {
  title: '🏷️',
  definition_callout: '📌',
  outcomes_grid: '🔲',
  process_flow: '➡️',
  levels_ladder: '📶',
  two_column: '⚖️',
  exam_focus: '🎯',
  closing: '✅',
};

export default function PresentationsPage() {
  const [pathway, setPathway] = useState<ExamPathId>('pmbok7');
  const [locale, setLocale] = useState<DeckLocale>('en');
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [templateId, setTemplateId] = useState<DeckTemplateId>('pmpeco-clean');

  const [previewing, setPreviewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spec, setSpec] = useState<DeckSpecPreview | null>(null);
  const [specFingerprint, setSpecFingerprint] = useState<string | null>(null);

  const fingerprint = JSON.stringify({ topic: topic.trim(), pathway, locale, slideCount, templateId });
  const validSlideCount = Number.isInteger(slideCount) && slideCount >= 3 && slideCount <= 30;
  const canRun = topic.trim().length >= 2 && validSlideCount && !previewing && !downloading;

  async function requestSpec(): Promise<DeckSpecPreview> {
    const requestedFingerprint = fingerprint;
    const res = await fetch('/api/ai/presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic.trim(), pathway, locale, slideCount, templateId, mode: 'spec' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    setSpec(data.spec);
    setSpecFingerprint(requestedFingerprint);
    return data.spec;
  }

  async function renderSpec(deckSpec: DeckSpecPreview) {
    return fetch('/api/ai/presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'render', spec: deckSpec }),
    });
  }

  async function handlePreview() {
    setError(null);
    setPreviewing(true);
    setSpec(null);
    try {
      await requestSpec();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed.');
    } finally {
      setPreviewing(false);
    }
  }

  async function handleDownload() {
    setError(null);
    setDownloading(true);
    try {
      const reusableSpec = spec && specFingerprint === fingerprint ? spec : null;
      if (!reusableSpec) {
        setSpec(null);
        setSpecFingerprint(null);
      }
      const deckSpec = reusableSpec || await requestSpec();
      const res = await renderSpec(deckSpec);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('application/json')) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Generation failed (${res.status})`);
      }
      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const fileName = match ? match[1] : 'presentation.pptx';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presentations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate a branded, source-grounded slide deck. Pick a pathway and a topic — the deck
            draws from the resource library and your branding automatically.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ---- Form ---- */}
        <div className="lg:col-span-1 space-y-6">
          <Card padding="lg">
            <h3 className="font-bold mb-4">1 · Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {DECK_TEMPLATES.map((template) => {
                const active = template.id === templateId;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setTemplateId(template.id)}
                    className={cn(
                      'overflow-hidden rounded-xl border-2 text-left transition-all bg-white',
                      active ? 'border-violet-600 shadow-sm ring-2 ring-violet-100' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Image src={template.preview} alt={`${template.name} preview`} width={640} height={360} className="aspect-video w-full object-cover border-b border-gray-100" />
                    <span className="block p-2.5">
                      <span className="block text-xs font-semibold text-gray-900">{template.name}</span>
                      <span className="mt-0.5 block text-[10px] leading-4 text-gray-500">{template.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-bold mb-4">2 · Pathway</h3>
            <div className="space-y-2">
              {EXAM_PATH_ORDER.map((id) => {
                const p = EXAM_PATHS[id];
                const copy = p.copy[locale];
                const active = pathway === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPathway(id)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl border-2 transition-all',
                      active ? 'border-transparent shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={active ? { backgroundColor: p.color + '12', borderColor: p.color } : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-sm font-semibold text-gray-900">{copy.label}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{copy.shortLabel}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-bold mb-4">3 · Topic & language</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The Stakeholder Performance Domain"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="presentation-slide-count">
                  Number of slides
                </label>
                <input
                  id="presentation-slide-count"
                  type="number"
                  min={3}
                  max={30}
                  step={1}
                  inputMode="numeric"
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <p className="text-xs text-gray-400 mt-1">Enter any whole number from 3 to 30.</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Language</label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as DeckLocale)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white"
                >
                  {LOCALES.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            <Button onClick={handlePreview} loading={previewing} disabled={!canRun} variant="secondary">
              Preview outline
            </Button>
            <Button onClick={handleDownload} loading={downloading} disabled={!canRun}>
              Generate & download .pptx
            </Button>
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ---- Preview ---- */}
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Outline preview</h3>
            {spec && <Badge variant="success">Grounded in library</Badge>}
          </div>

          {!spec && !previewing && (
            <div className="text-center py-16 text-gray-400 text-sm">
              Run <span className="font-medium text-gray-500">Preview outline</span> to see the deck
              structure here before generating the file.
            </div>
          )}
          {previewing && (
            <div className="text-center py-16 text-gray-400 text-sm">Architecting the deck…</div>
          )}

          {spec && (
            <div className="space-y-5">
              <div>
                <div className="text-lg font-bold text-gray-900">{spec.title}</div>
                <div className="text-sm text-gray-500">{spec.subtitle}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {spec.slides.length} slides · {spec.meta.pathwayLabel}
                </div>
              </div>

              <div className="space-y-2">
                {spec.slides.map((s) => (
                  <div key={s.n} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-base leading-6">{LAYOUT_ICON[s.layout] || '▫️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{s.headline}</div>
                      <div className="text-[11px] text-gray-400 uppercase tracking-wide">{s.layout.replace(/_/g, ' ')}</div>
                      {s.citationRefs.length > 0 && (
                        <div className="text-[11px] text-emerald-600 mt-0.5">
                          Evidence {s.citationRefs.map((ref) => `[${ref}]`).join(' ')}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-300 font-mono">{s.n}</span>
                  </div>
                ))}
              </div>

              {spec.citations.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Sources</div>
                  <ul className="space-y-1">
                    {spec.citations.map((c) => (
                      <li key={c.ref} className="text-xs text-gray-500">
                        <span className="font-mono text-gray-400">[{c.ref}]</span> {c.source_title} — {c.chunk_title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <Button onClick={handleDownload} loading={downloading} disabled={!canRun}>
                  Generate & download .pptx
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
