import 'server-only';
import pptxgen from 'pptxgenjs';
import type { DeckSpec, DeckSlide, DeckBranding } from './types';

/**
 * Agent 2 — Deck Builder.
 * Turns a DeckSpec (from Agent 1) + resolved platform branding into a branded,
 * fully-editable .pptx returned as a Node Buffer (no filesystem writes, so it runs
 * in a serverless route). All colour/typography comes from DeckBranding, which is
 * sourced from branding_config — the deck is never given its own palette.
 */

// ---- colour helpers (all hex are 6-digit, no '#') -------------------
function lighten(hex: string, pct: number): string {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * pct);
  return [mix(r), mix(g), mix(b)]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

const WHITE = 'FFFFFF';
const W = 13.333, H = 7.5;

type Ctx = {
  pptx: pptxgen;
  b: DeckBranding;
  tints: { card: string; cardBorder: string; ice: string; softInk: string };
};

// ---- shared building blocks -----------------------------------------
function footer(ctx: Ctx, slide: pptxgen.Slide, siteFooter: string, dark: boolean) {
  slide.addText(siteFooter, {
    x: 0.5, y: H - 0.42, w: 9, h: 0.3, fontFace: ctx.b.fontBody, fontSize: 9,
    color: dark ? ctx.tints.ice : '8B8B9E', align: 'left', margin: 0,
  });
  if (ctx.b.logoDataUri) {
    slide.addImage({ data: ctx.b.logoDataUri, x: W - 0.95, y: H - 0.62, w: 0.42, h: 0.42 });
  }
}

function chip(ctx: Ctx, slide: pptxgen.Slide, x: number, y: number, txt: string, onDark: boolean) {
  slide.addText((txt || '').toUpperCase(), {
    x, y, w: 3.0, h: 0.34, fontFace: ctx.b.fontBody, fontSize: 10.5, bold: true,
    color: onDark ? ctx.b.ink : WHITE,
    fill: { color: onDark ? ctx.tints.ice : ctx.b.primary },
    align: 'center', valign: 'middle', rectRadius: 0.08,
    shape: ctx.pptx.ShapeType.roundRect, margin: 0,
  });
}

function badge(ctx: Ctx, slide: pptxgen.Slide, x: number, y: number, s: number, label: string, fill: string) {
  slide.addText(label, {
    x, y, w: s, h: s, fontFace: ctx.b.fontHeading, fontSize: 18, bold: true, color: WHITE,
    fill: { color: fill }, align: 'center', valign: 'middle',
    rectRadius: 0.1, shape: ctx.pptx.ShapeType.roundRect, margin: 0,
  });
}

function title(ctx: Ctx, slide: pptxgen.Slide, text: string, color: string) {
  slide.addText(text, {
    x: 0.85, y: 1.05, w: 11.6, h: 0.95, fontFace: ctx.b.fontHeading, fontSize: 34,
    bold: true, color,
  });
}

function itemText(it: { title?: string; desc: string } | string) {
  return typeof it === 'string' ? { desc: it } : it;
}

// ---- layout renderers -----------------------------------------------
function renderTitle(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, spec: DeckSpec) {
  slide.background = { color: ctx.b.ink };
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 9.7, y: -1.6, w: 5, h: 5, rectRadius: 0.5, fill: { color: ctx.b.primary, transparency: 55 }, line: { type: 'none' } });
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 11.0, y: 3.4, w: 3.4, h: 3.4, rectRadius: 0.4, fill: { color: ctx.b.accent, transparency: 70 }, line: { type: 'none' } });
  chip(ctx, slide, 0.9, 1.5, s.kicker || spec.meta.pathwayLabel, false);
  slide.addText(s.headline || spec.title, { x: 0.85, y: 2.15, w: 9.6, h: 2.2, fontFace: ctx.b.fontHeading, fontSize: 44, bold: true, color: WHITE, lineSpacingMultiple: 0.98 });
  slide.addText(s.subhead || spec.subtitle, { x: 0.9, y: 4.5, w: 9, h: 0.7, fontFace: ctx.b.fontBody, fontSize: 18, color: ctx.tints.ice });
  if (ctx.b.logoDataUri) slide.addImage({ data: ctx.b.logoDataUri, x: 0.9, y: 5.6, w: 0.6, h: 0.6 });
  slide.addText(ctx.b.siteName, { x: 1.62, y: 5.65, w: 5, h: 0.5, fontFace: ctx.b.fontHeading, fontSize: 16, bold: true, color: WHITE, valign: 'middle', margin: 0 });
}

function renderDefinition(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Definition', true);
  title(ctx, slide, s.headline, ctx.b.ink);
  slide.addText(s.body || '', { x: 0.9, y: 2.15, w: 7.2, h: 3.2, fontFace: ctx.b.fontBody, fontSize: 19, color: ctx.tints.softInk, lineSpacingMultiple: 1.15 });
  if (s.stat) {
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 8.7, y: 1.9, w: 3.7, h: 3.1, rectRadius: 0.18, fill: { color: ctx.tints.card }, line: { type: 'none' }, shadow: { type: 'outer', color: '9096C7', blur: 10, offset: 3, angle: 90, opacity: 0.35 } });
    slide.addText(s.stat.value, { x: 8.7, y: 2.25, w: 3.7, h: 1.6, fontFace: ctx.b.fontHeading, fontSize: 60, bold: true, color: ctx.b.primary, align: 'center', margin: 0 });
    slide.addText(s.stat.label, { x: 8.85, y: 3.9, w: 3.4, h: 0.9, fontFace: ctx.b.fontBody, fontSize: 15, color: ctx.b.ink, align: 'center', margin: 0 });
  }
  footer(ctx, slide, siteFooter, false);
}

function renderOutcomes(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Intended outcomes', true);
  title(ctx, slide, s.headline, ctx.b.ink);
  const items = (s.items || []).slice(0, 4).map(itemText);
  const cols = 2, gapX = 0.4, gapY = 0.4, x0 = 0.9, y0 = 2.15;
  const cw = (W - x0 * 2 - gapX) / cols, ch = 2.15;
  const iconColors = [ctx.b.primary, ctx.b.accent, ctx.b.primary, ctx.b.accent];
  items.forEach((it, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const x = x0 + c * (cw + gapX), y = y0 + r * (ch + gapY);
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.14, fill: { color: ctx.tints.card }, line: { color: ctx.tints.cardBorder, width: 1 } });
    badge(ctx, slide, x + 0.3, y + 0.3, 0.7, String(i + 1), iconColors[i]);
    if (it.title) slide.addText(it.title, { x: x + 1.2, y: y + 0.32, w: cw - 1.5, h: 0.7, fontFace: ctx.b.fontHeading, fontSize: 18, bold: true, color: ctx.b.ink, valign: 'middle', margin: 0 });
    slide.addText(it.desc, { x: x + 0.32, y: y + (it.title ? 1.2 : 0.35), w: cw - 0.6, h: it.title ? 0.8 : 1.5, fontFace: ctx.b.fontBody, fontSize: 14.5, color: ctx.tints.softInk, margin: 0, lineSpacingMultiple: 1.05, valign: it.title ? 'top' : 'middle' });
  });
  footer(ctx, slide, siteFooter, false);
}

function renderProcess(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Process', true);
  title(ctx, slide, s.headline, ctx.b.ink);
  const steps = (s.steps || []).slice(0, 5);
  const n = Math.max(steps.length, 1), x0 = 0.9, y = 2.9, gap = 0.35;
  const bw = (W - x0 * 2 - gap * (n - 1)) / n, bh = 1.7;
  steps.forEach((st, i) => {
    const x = x0 + i * (bw + gap);
    const dark = i % 2 === 0;
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x, y, w: bw, h: bh, rectRadius: 0.12, fill: { color: dark ? ctx.b.primary : ctx.tints.card }, line: { type: 'none' } });
    slide.addText(String(i + 1), { x, y: y + 0.18, w: bw, h: 0.5, fontFace: ctx.b.fontHeading, fontSize: 15, bold: true, color: dark ? ctx.tints.ice : ctx.b.primary, align: 'center', margin: 0 });
    slide.addText(st, { x: x + 0.1, y: y + 0.62, w: bw - 0.2, h: 0.95, fontFace: ctx.b.fontHeading, fontSize: 14, bold: true, color: dark ? WHITE : ctx.b.ink, align: 'center', valign: 'top', margin: 0, lineSpacingMultiple: 0.95 });
    if (i < n - 1) slide.addText('›', { x: x + bw - 0.02, y: y + 0.45, w: gap + 0.04, h: 0.9, fontFace: ctx.b.fontHeading, fontSize: 26, bold: true, color: ctx.b.accent, align: 'center', valign: 'middle', margin: 0 });
  });
  if (s.caption) slide.addText(s.caption, { x: 0.9, y: 5.0, w: 11.5, h: 0.6, fontFace: ctx.b.fontBody, fontSize: 15, italic: true, color: ctx.b.primary });
  footer(ctx, slide, siteFooter, false);
}

function renderLevels(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  slide.background = { color: ctx.b.ink };
  chip(ctx, slide, 0.9, 0.55, s.kicker || 'Levels', false);
  title(ctx, slide, s.headline, WHITE);
  const levels = (s.levels || []).slice(0, 5);
  const y0 = 2.1, rh = 0.66, gap = 0.12;
  levels.forEach((lv, i) => {
    const y = y0 + i * (rh + gap);
    const wStep = 4.2 + i * 1.7;
    const last = i === levels.length - 1;
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 0.9, y, w: wStep, h: rh, rectRadius: 0.1, fill: { color: last ? ctx.b.accent : ctx.b.primary, transparency: 8 + (levels.length - 1 - i) * 9 }, line: { type: 'none' } });
    slide.addText(lv.name, { x: 1.1, y, w: 2.4, h: rh, fontFace: ctx.b.fontHeading, fontSize: 15, bold: true, color: WHITE, valign: 'middle', margin: 0 });
    slide.addText(lv.desc, { x: 3.4, y, w: Math.max(wStep - 2.6, 1.5), h: rh, fontFace: ctx.b.fontBody, fontSize: 12.5, color: ctx.tints.ice, valign: 'middle', margin: 0 });
  });
  if (s.caption) slide.addText(s.caption, { x: 0.9, y: 6.55, w: 11.5, h: 0.5, fontFace: ctx.b.fontBody, fontSize: 14, italic: true, color: ctx.tints.ice });
  footer(ctx, slide, siteFooter, true);
}

function renderTwoColumn(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Application', true);
  title(ctx, slide, s.headline, ctx.b.ink);
  const y = 2.2, colW = 5.6, colH = 4.1, x1 = 0.9, x2 = 0.9 + colW + 0.55;
  const col = (x: number, colTitle: string, items: string[], accentCol: boolean) => {
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x, y, w: colW, h: colH, rectRadius: 0.14, fill: { color: accentCol ? ctx.tints.card : 'FFF4F2' }, line: { color: accentCol ? ctx.tints.cardBorder : 'F3CDC5', width: 1 } });
    slide.addText(colTitle, { x: x + 0.35, y: y + 0.3, w: colW - 0.7, h: 0.55, fontFace: ctx.b.fontHeading, fontSize: 20, bold: true, color: accentCol ? ctx.b.primary : 'B2493B', margin: 0 });
    slide.addText((items || []).map((t, i, arr) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < arr.length - 1 } })), { x: x + 0.4, y: y + 1.0, w: colW - 0.75, h: colH - 1.3, fontFace: ctx.b.fontBody, fontSize: 15, color: ctx.tints.softInk, paraSpaceAfter: 10, lineSpacingMultiple: 1.02, margin: 0 });
  };
  col(x1, s.left_title || 'Do', s.left || [], true);
  col(x2, s.right_title || 'Avoid', s.right || [], false);
  footer(ctx, slide, siteFooter, false);
}

function renderExamFocus(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Exam focus', true);
  title(ctx, slide, s.headline, ctx.b.ink);
  const items = (s.items || []).slice(0, 4).map((it) => itemText(it).desc);
  const y0 = 2.25, rh = 0.92, gap = 0.22;
  items.forEach((it, i) => {
    const y = y0 + i * (rh + gap);
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 0.9, y, w: 11.5, h: rh, rectRadius: 0.1, fill: { color: ctx.tints.card }, line: { type: 'none' } });
    badge(ctx, slide, 1.1, y + 0.14, 0.64, '✓', ctx.b.primary);
    slide.addText(it, { x: 2.0, y, w: 10.2, h: rh, fontFace: ctx.b.fontBody, fontSize: 16, color: ctx.b.ink, valign: 'middle', margin: 0 });
  });
  footer(ctx, slide, siteFooter, false);
}

function renderClosing(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, spec: DeckSpec, siteFooter: string) {
  slide.background = { color: ctx.b.ink };
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: -1.5, y: 4.2, w: 5, h: 5, rectRadius: 0.5, fill: { color: ctx.b.primary, transparency: 60 }, line: { type: 'none' } });
  chip(ctx, slide, 0.9, 1.2, s.kicker || 'Key takeaway', false);
  slide.addText(s.headline, { x: 0.85, y: 1.75, w: 10.5, h: 0.9, fontFace: ctx.b.fontHeading, fontSize: 36, bold: true, color: WHITE });
  slide.addText(s.body || '', { x: 0.9, y: 2.85, w: 10.6, h: 2.1, fontFace: ctx.b.fontBody, fontSize: 21, color: ctx.tints.ice, lineSpacingMultiple: 1.2 });
  if (s.cta) {
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 0.9, y: 5.25, w: 7.6, h: 0.75, rectRadius: 0.1, fill: { color: ctx.b.accent }, line: { type: 'none' } });
    slide.addText(s.cta, { x: 0.9, y: 5.25, w: 7.6, h: 0.75, fontFace: ctx.b.fontHeading, fontSize: 16, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0 });
  }
  if (spec.citations.length) {
    const src = spec.citations.map((c) => `[${c.ref}] ${c.source_title}`).join('   ');
    slide.addText(src, { x: 0.9, y: 6.35, w: 11.5, h: 0.5, fontFace: ctx.b.fontBody, fontSize: 9, color: ctx.tints.ice, margin: 0 });
    slide.addNotes(spec.citations.map((c) => `[${c.ref}] ${c.source_title} — ${c.chunk_title} (${c.framework})`).join('\n'));
  }
  footer(ctx, slide, siteFooter, true);
}

// ---- entry point ----------------------------------------------------
export async function buildDeckPptx(spec: DeckSpec, branding: DeckBranding): Promise<Buffer> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = `${branding.siteName} — Deck Builder`;
  pptx.company = branding.siteName;
  pptx.title = spec.title;

  const ctx: Ctx = {
    pptx,
    b: branding,
    tints: {
      card: lighten(branding.primary, 0.94),
      cardBorder: lighten(branding.primary, 0.82),
      ice: lighten(branding.primary, 0.78),
      softInk: lighten(branding.ink, 0.25),
    },
  };
  const siteFooter = `${branding.siteName} · Grounded in ${spec.meta.pathwayLabel}`;

  for (const s of spec.slides) {
    const slide = pptx.addSlide();
    switch (s.layout) {
      case 'title': renderTitle(ctx, slide, s, spec); break;
      case 'definition_callout': renderDefinition(ctx, slide, s, siteFooter); break;
      case 'outcomes_grid': renderOutcomes(ctx, slide, s, siteFooter); break;
      case 'process_flow': renderProcess(ctx, slide, s, siteFooter); break;
      case 'levels_ladder': renderLevels(ctx, slide, s, siteFooter); break;
      case 'two_column': renderTwoColumn(ctx, slide, s, siteFooter); break;
      case 'exam_focus': renderExamFocus(ctx, slide, s, siteFooter); break;
      case 'closing': renderClosing(ctx, slide, s, spec, siteFooter); break;
      default: renderDefinition(ctx, slide, s, siteFooter); break;
    }
    if (s.notes && s.layout !== 'closing') slide.addNotes(s.notes);
  }

  const out = await pptx.write({ outputType: 'nodebuffer' });
  return out as Buffer;
}
