import 'server-only';
import { loadImageDataUri } from './branding';
import type { DeckSpec } from './types';

/**
 * Curated illustration library (Ship 2).
 * Hand-drawn sketch illustrations in the approved PMPeco style, seeded from the
 * branded template and stored in /public/illustrations. Agent 2 auto-places one
 * per illustrated slide by matching the slide's topic/keywords to each asset's
 * tags. Adding more later = drop a file in /public/illustrations and add a row.
 */

export interface Illustration {
  id: string;
  /** file under /public/illustrations */
  file: string;
  tags: string[];
  hasPeople: boolean;
}

export const ILLUSTRATIONS: Illustration[] = [
  { id: 'org-building', file: 'org-building.jpg', hasPeople: false,
    tags: ['organization', 'governance', 'business', 'environment', 'enterprise', 'compliance', 'company', 'structure', 'strategy', 'منظمة', 'حوكمة', 'اعمال', 'بيئة', 'امتثال', 'استراتيجية', 'هيكل'] },
  { id: 'team-planning', file: 'team-planning.jpg', hasPeople: true,
    tags: ['planning', 'team', 'principles', 'systems', 'thinking', 'collaboration', 'foundations', 'mindset', 'holistic', 'kickoff', 'scope', 'تخطيط', 'فريق', 'مبادئ', 'انظمة', 'تفكير', 'تعاون', 'نطاق'] },
  { id: 'process-leadership', file: 'process-leadership.jpg', hasPeople: true,
    tags: ['process', 'leadership', 'strategy', 'delivery', 'roadmap', 'vision', 'facilitation', 'domains', 'value', 'principles', 'engagement', 'عملية', 'عمليات', 'قيادة', 'استراتيجية', 'تسليم', 'رؤية', 'قيمة', 'مشاركة'] },
  { id: 'schedule-scope', file: 'schedule-scope.jpg', hasPeople: true,
    tags: ['schedule', 'scope', 'execution', 'domains', 'planning', 'timeline', 'wbs', 'requirements', 'governance', 'change', 'جدول', 'نطاق', 'تنفيذ', 'تخطيط', 'متطلبات', 'حوكمة', 'تغيير'] },
  { id: 'measurement-metrics', file: 'measurement-metrics.jpg', hasPeople: true,
    tags: ['measurement', 'metrics', 'data', 'performance', 'analytics', 'kpi', 'evm', 'reporting', 'finance', 'value', 'uncertainty', 'risk', 'قياس', 'مؤشرات', 'بيانات', 'اداء', 'تحليل', 'تقارير', 'مالية', 'قيمة', 'مخاطر', 'عدم', 'يقين'] },
  { id: 'stakeholders-engagement', file: 'stakeholders-engagement.jpg', hasPeople: true,
    tags: ['stakeholders', 'engagement', 'communication', 'team', 'people', 'collaboration', 'relationships', 'alignment', 'meeting', 'اصحاب', 'مصلحة', 'مشاركة', 'تواصل', 'فريق', 'افراد', 'تعاون', 'علاقات', 'مواءمة', 'اجتماع'] },
  { id: 'delivery-agile', file: 'delivery-agile.jpg', hasPeople: true,
    tags: ['delivery', 'agile', 'hybrid', 'workflow', 'kanban', 'backlog', 'adaptive', 'iteration', 'sprint', 'team', 'process', 'تسليم', 'رشيق', 'مرن', 'هجين', 'تدفق', 'كانبان', 'تكرار', 'فريق', 'عملية'] },
  { id: 'study-notes', file: 'study-notes.jpg', hasPeople: false,
    tags: ['study', 'notes', 'tailoring', 'exam', 'summary', 'takeaway', 'principles', 'review', 'documents', 'preparation', 'دراسة', 'ملاحظات', 'تكييف', 'اختبار', 'ملخص', 'مبادئ', 'مراجعة', 'وثائق', 'تحضير'] },
];

function keywordsFor(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

function scoreIllustration(illo: Illustration, keywords: string[]): number {
  let score = 0;
  for (const k of keywords) {
    for (const tag of illo.tags) {
      if (tag === k) score += 3;
      else if (tag.includes(k) || k.includes(tag)) score += 1;
    }
  }
  return score;
}

/**
 * Pick a distinct illustration for a slide given free-text context.
 * `preferId` biases toward a specific asset (e.g. still-life for closings) but
 * never reuses one already chosen for this deck.
 */
export function pickIllustration(
  context: string,
  used: Set<string>,
  preferId?: string
): Illustration | null {
  const available = ILLUSTRATIONS.filter((i) => !used.has(i.id));
  if (available.length === 0) return null;

  if (preferId) {
    const preferred = available.find((i) => i.id === preferId);
    if (preferred) {
      used.add(preferred.id);
      return preferred;
    }
  }

  const keywords = keywordsFor(context);
  let best = available[0];
  let bestScore = -1;
  for (const illo of available) {
    const s = scoreIllustration(illo, keywords);
    if (s > bestScore) {
      bestScore = s;
      best = illo;
    }
  }
  if (bestScore === 0) {
    const hash = Array.from(context).reduce((sum, char) => (sum * 31 + char.codePointAt(0)!) >>> 0, 0);
    best = available[hash % available.length];
  }
  used.add(best.id);
  return best;
}

/**
 * Selects and loads illustrations for the slides we illustrate (title hero,
 * definition side-panel, closing side), returning slideNumber -> data URI.
 * Fetches from /public/illustrations via the app base URL (same mechanism as
 * the logo). Any asset that fails to load is simply omitted — the deck still
 * renders. Choices are distinct across the deck.
 */
export async function resolveDeckIllustrations(spec: DeckSpec): Promise<Record<number, string>> {
  const used = new Set<string>();
  const topic = spec.meta.topic;
  const picks: Array<{ n: number; illo: ReturnType<typeof pickIllustration> }> = [];

  const title = spec.slides.find((s) => s.layout === 'title');
  const def = spec.slides.find((s) => s.layout === 'definition_callout');
  const closing = spec.slides.find((s) => s.layout === 'closing');

  if (title) picks.push({ n: title.n, illo: pickIllustration(`${title.headline} ${title.kicker || ''} ${topic}`, used) });
  if (def) picks.push({ n: def.n, illo: pickIllustration(`${def.headline} ${def.kicker || ''} ${topic}`, used) });
  // Closing prefers the still-life (no people) for a calmer "wrap up" feel.
  if (closing) picks.push({ n: closing.n, illo: pickIllustration(`${closing.headline} ${topic}`, used, 'study-notes') });

  const out: Record<number, string> = {};
  await Promise.all(
    picks.map(async ({ n, illo }) => {
      if (!illo) return;
      const dataUri = await loadImageDataUri(`/illustrations/${illo.file}`);
      if (dataUri) out[n] = dataUri;
    })
  );
  return out;
}
