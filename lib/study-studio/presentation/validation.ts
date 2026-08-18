import type { AppLocale, ExamPathId } from '@/lib/pmp/exam-paths';
import type { DeckCitation, DeckSlide, DeckSpec, DeckTemplateId, SlideLayout } from './types';

export const MIN_DECK_SLIDES = 3;
export const MAX_DECK_SLIDES = 30;
export const MAX_DECK_TOPIC_LENGTH = 200;

const PATHWAYS = new Set<ExamPathId>(['pmbok7', 'pmbok8', 'bridge']);
const LOCALES = new Set<AppLocale>(['en', 'ar']);
const LAYOUTS = new Set<SlideLayout>([
  'title',
  'definition_callout',
  'outcomes_grid',
  'process_flow',
  'levels_ladder',
  'two_column',
  'exam_focus',
  'closing',
]);
const TEMPLATES = new Set<DeckTemplateId>(['pmpeco-clean', 'pmpeco-bold']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string, max = 500): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required.`);
  const text = value.trim();
  if (text.length > max) throw new Error(`${field} is too long.`);
  return text;
}

function optionalString(value: unknown, field: string, max = 500): string | undefined {
  if (value == null || value === '') return undefined;
  return requiredString(value, field, max);
}

function stringArray(value: unknown, field: string, min: number, max: number): string[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    throw new Error(`${field} must contain ${min}-${max} items.`);
  }
  return value.map((item, index) => requiredString(item, `${field}[${index}]`, 180));
}

export function readPathway(value: unknown): ExamPathId {
  if (typeof value !== 'string' || !PATHWAYS.has(value as ExamPathId)) {
    throw new Error('Pathway must be pmbok7, pmbok8, or bridge.');
  }
  return value as ExamPathId;
}

export function readDeckLocale(value: unknown): AppLocale {
  if (typeof value !== 'string' || !LOCALES.has(value as AppLocale)) {
    throw new Error('Language must be English or Arabic.');
  }
  return value as AppLocale;
}

export function readSlideCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < MIN_DECK_SLIDES || value > MAX_DECK_SLIDES) {
    throw new Error(`Number of slides must be a whole number from ${MIN_DECK_SLIDES} to ${MAX_DECK_SLIDES}.`);
  }
  return value;
}

export function readTopic(value: unknown): string {
  const topic = requiredString(value, 'Topic', MAX_DECK_TOPIC_LENGTH);
  if (topic.length < 2) throw new Error('Topic must contain at least 2 characters.');
  return topic;
}

export function readDeckTemplate(value: unknown): DeckTemplateId {
  if (typeof value !== 'string' || !TEMPLATES.has(value as DeckTemplateId)) {
    throw new Error('Presentation template is invalid.');
  }
  return value as DeckTemplateId;
}

function validateCitation(value: unknown, index: number): DeckCitation {
  if (!isRecord(value)) throw new Error(`citations[${index}] is invalid.`);
  if (!Number.isInteger(value.ref) || Number(value.ref) < 1) throw new Error(`citations[${index}].ref is invalid.`);
  return {
    ref: Number(value.ref),
    source_title: requiredString(value.source_title, `citations[${index}].source_title`, 240),
    chunk_title: requiredString(value.chunk_title, `citations[${index}].chunk_title`, 240),
    framework: requiredString(value.framework, `citations[${index}].framework`, 80),
  };
}

function validateSlide(value: unknown, index: number, validRefs: Set<number>): DeckSlide {
  if (!isRecord(value)) throw new Error(`slides[${index}] is invalid.`);
  const layout = value.layout;
  if (typeof layout !== 'string' || !LAYOUTS.has(layout as SlideLayout)) {
    throw new Error(`slides[${index}].layout is unsupported.`);
  }
  const refs = Array.isArray(value.citationRefs)
    ? Array.from(new Set(value.citationRefs.map(Number)))
    : [];
  if (!refs.every((ref) => Number.isInteger(ref) && validRefs.has(ref))) {
    throw new Error(`slides[${index}] contains an invalid evidence reference.`);
  }

  const slide: DeckSlide = {
    n: index + 1,
    layout: layout as SlideLayout,
    headline: requiredString(value.headline, `slides[${index}].headline`, 90),
    kicker: optionalString(value.kicker, `slides[${index}].kicker`, 45),
    subhead: optionalString(value.subhead, `slides[${index}].subhead`, 180),
    body: optionalString(value.body, `slides[${index}].body`, 700),
    caption: optionalString(value.caption, `slides[${index}].caption`, 180),
    cta: optionalString(value.cta, `slides[${index}].cta`, 100),
    notes: optionalString(value.notes, `slides[${index}].notes`, 700),
    citationRefs: refs,
  };

  if (isRecord(value.stat)) {
    slide.stat = {
      value: requiredString(value.stat.value, `slides[${index}].stat.value`, 40),
      label: requiredString(value.stat.label, `slides[${index}].stat.label`, 120),
    };
  }
  if (Array.isArray(value.items)) {
    slide.items = value.items.slice(0, 6).map((item, itemIndex) => {
      if (typeof item === 'string') return requiredString(item, `slides[${index}].items[${itemIndex}]`, 180);
      if (!isRecord(item)) throw new Error(`slides[${index}].items[${itemIndex}] is invalid.`);
      return {
        title: optionalString(item.title, `slides[${index}].items[${itemIndex}].title`, 80),
        desc: requiredString(item.desc, `slides[${index}].items[${itemIndex}].desc`, 180),
      };
    });
  }
  if (value.steps != null) slide.steps = stringArray(value.steps, `slides[${index}].steps`, 2, 5);
  if (Array.isArray(value.levels)) {
    if (value.levels.length < 2 || value.levels.length > 5) throw new Error(`slides[${index}].levels must contain 2-5 items.`);
    slide.levels = value.levels.map((level, levelIndex) => {
      if (!isRecord(level)) throw new Error(`slides[${index}].levels[${levelIndex}] is invalid.`);
      return {
        name: requiredString(level.name, `slides[${index}].levels[${levelIndex}].name`, 60),
        desc: requiredString(level.desc, `slides[${index}].levels[${levelIndex}].desc`, 180),
      };
    });
  }
  slide.left_title = optionalString(value.left_title, `slides[${index}].left_title`, 80);
  slide.right_title = optionalString(value.right_title, `slides[${index}].right_title`, 80);
  if (value.left != null) slide.left = stringArray(value.left, `slides[${index}].left`, 2, 5);
  if (value.right != null) slide.right = stringArray(value.right, `slides[${index}].right`, 2, 5);

  switch (slide.layout) {
    case 'title':
      if (!slide.subhead) throw new Error(`slides[${index}].subhead is required for a title slide.`);
      break;
    case 'definition_callout':
      if (!slide.body) throw new Error(`slides[${index}].body is required for a definition slide.`);
      break;
    case 'outcomes_grid':
      if (!slide.items || slide.items.length < 2 || slide.items.length > 4) {
        throw new Error(`slides[${index}].items must contain 2-4 items.`);
      }
      break;
    case 'process_flow':
      if (!slide.steps) throw new Error(`slides[${index}].steps are required for a process slide.`);
      break;
    case 'levels_ladder':
      if (!slide.levels) throw new Error(`slides[${index}].levels are required for a levels slide.`);
      break;
    case 'two_column':
      if (!slide.left_title || !slide.right_title || !slide.left || !slide.right) {
        throw new Error(`slides[${index}] requires both columns and their titles.`);
      }
      break;
    case 'exam_focus':
      if (!slide.items || slide.items.length < 2 || slide.items.length > 4) {
        throw new Error(`slides[${index}].items must contain 2-4 exam-focus items.`);
      }
      break;
    case 'closing':
      if (!slide.body) throw new Error(`slides[${index}].body is required for a closing slide.`);
      break;
  }

  if (slide.layout !== 'title' && slide.layout !== 'closing' && slide.citationRefs.length === 0) {
    throw new Error(`Slide ${slide.n} must cite at least one retrieved evidence source.`);
  }
  return slide;
}

export function validateDeckSpec(value: unknown, expectedSlideCount?: number): DeckSpec {
  if (!isRecord(value) || !isRecord(value.meta)) throw new Error('Deck specification is invalid.');
  const citationsRaw = Array.isArray(value.citations) ? value.citations : [];
  const citations = citationsRaw.map(validateCitation);
  const validRefs = new Set(citations.map((citation) => citation.ref));
  if (validRefs.size !== citations.length) throw new Error('Citation references must be unique.');
  if (!Array.isArray(value.slides)) throw new Error('Deck slides are missing.');
  const requestedSlideCount = readSlideCount(value.meta.requestedSlideCount);
  if (expectedSlideCount != null && requestedSlideCount !== expectedSlideCount) {
    throw new Error('Deck slide count does not match the request.');
  }
  if (value.slides.length !== requestedSlideCount) {
    throw new Error(`Deck must contain exactly ${requestedSlideCount} slides.`);
  }
  const slides = value.slides.map((slide, index) => validateSlide(slide, index, validRefs));
  if (slides[0]?.layout !== 'title' || slides.at(-1)?.layout !== 'closing') {
    throw new Error('Deck must begin with a title slide and end with a closing slide.');
  }

  return {
    meta: {
      topic: readTopic(value.meta.topic),
      pathway: readPathway(value.meta.pathway),
      locale: readDeckLocale(value.meta.locale),
      pathwayLabel: requiredString(value.meta.pathwayLabel, 'meta.pathwayLabel', 120),
      generatedAt: requiredString(value.meta.generatedAt, 'meta.generatedAt', 80),
      requestedSlideCount,
      templateId: readDeckTemplate(value.meta.templateId ?? 'pmpeco-clean'),
      grounded: slides.slice(1, -1).every((slide) => slide.citationRefs.length > 0),
    },
    title: requiredString(value.title, 'title', 120),
    subtitle: requiredString(value.subtitle, 'subtitle', 240),
    slides,
    citations,
  };
}
