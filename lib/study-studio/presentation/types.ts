import type { ExamPathId, AppLocale } from '@/lib/pmp/exam-paths';

/**
 * Contract shared between the two presentation agents.
 *
 *   Agent 1 (deck-architect) — turns a { pathway, topic } request into a grounded,
 *   cited DeckSpec by retrieving evidence from the PMPeco resource library.
 *   Agent 2 (deck-builder)  — turns a DeckSpec + the platform branding into a
 *   branded, editable .pptx.
 *
 * Keeping this as an explicit, serialisable contract means either agent can be
 * swapped (e.g. a Gamma/Canva builder in place of pptxgenjs) without touching
 * the other.
 */

export type SlideLayout =
  | 'title'
  | 'definition_callout'
  | 'outcomes_grid'
  | 'process_flow'
  | 'levels_ladder'
  | 'two_column'
  | 'exam_focus'
  | 'closing';

export interface DeckSlide {
  n: number;
  layout: SlideLayout;
  headline: string;
  /** Optional short eyebrow/kicker chip above the headline. */
  kicker?: string;
  subhead?: string;
  body?: string;
  caption?: string;
  cta?: string;
  /** Single big-number callout, used by definition_callout. */
  stat?: { value: string; label: string };
  /** title + desc cards, used by outcomes_grid. */
  items?: Array<{ title?: string; desc: string } | string>;
  /** ordered step labels, used by process_flow. */
  steps?: string[];
  /** engagement/maturity ladder rows, used by levels_ladder. */
  levels?: Array<{ name: string; desc: string }>;
  /** two_column payload. */
  left_title?: string;
  left?: string[];
  right_title?: string;
  right?: string[];
  /** Speaker notes — also reused verbatim as the seed for Agent 3 narration. */
  notes?: string;
}

export interface DeckCitation {
  /** Index used inline in the deck, e.g. [1]. */
  ref: number;
  source_title: string;
  chunk_title: string;
  framework: string;
}

export interface DeckSpec {
  meta: {
    topic: string;
    pathway: ExamPathId;
    locale: AppLocale;
    /** Human-readable pathway label, e.g. "PMBOK 7 + ECO 2021". */
    pathwayLabel: string;
    generatedAt: string;
    /** true when the architect had real library evidence to ground on. */
    grounded: boolean;
  };
  title: string;
  subtitle: string;
  slides: DeckSlide[];
  citations: DeckCitation[];
}

/**
 * Resolved branding — mirrors the branding_config row (single source of truth),
 * normalised for the deck builder (hex WITHOUT leading '#').
 */
export interface DeckBranding {
  siteName: string;
  logoDataUri: string | null;
  /** All hex values are 6-digit, no '#'. */
  primary: string;
  secondary: string;
  accent: string;
  ink: string;
  fontHeading: string;
  fontBody: string;
}
