import 'server-only';
import pptxgen from 'pptxgenjs';
import type { DeckSpec, DeckSlide, DeckBranding } from './types';

/**
 * Agent 2 — Deck Builder.
 * Turns a DeckSpec (from Agent 1) into a branded, fully-editable .pptx returned
 * as a Node Buffer (no filesystem writes, so it runs in a serverless route).
 * The visual system matches the approved PMPeco presentation template: deep navy
 * dominance, teal/violet accents, lavender cards, Poppins/Open Sans typography.
 */

const WHITE = 'FFFFFF';
const W = 13.333, H = 7.5;

// mix a hex toward white by pct (0..1)
function lighten(hex: string, pct: number): string {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * pct);
  return [mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

type Ctx = { pptx: pptxgen; b: DeckBranding; iceOnNavy: string };

// ---- shared building blocks -----------------------------------------
function footer(ctx: Ctx, slide: pptxgen.Slide, siteFooter: string, dark: boolean) {
  slide.addText(siteFooter, {
    x: 0.5, y: H - 0.42, w: 9, h: 0.3, fontFace: ctx.b.fontBody, fontSize: 9,
    color: dark ? ctx.iceOnNavy : '9A9AAB', align: 'left', margin: 0,
  });
  if (ctx.b.logoDataUri) {
    slide.addImage({ data: ctx.b.logoDataUri, x: W - 0.95, y: H - 0.62, w: 0.42, h: 0.42 });
  }
}

function chip(ctx: Ctx, slide: pptxgen.Slide, x: number, y: number, txt: string, onDark: boolean) {
  slide.addText((txt || '').toUpperCase(), {
    x, y, w: 3.2, h: 0.34, fontFace: ctx.b.fontBody, fontSize: 10.5, bold: true, charSpacing: 1,
    color: onDark ? ctx.b.navy : WHITE,
    fill: { color: onDark ? ctx.b.teal : ctx.b.violet },
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
    x: 0.85, y: 1.05, w: 11.6, h: 0.95, fontFace: ctx.b.fontHeading, fontSize: 32, bold: true, color,
  });
}

function itemText(it: { title?: string; desc: string } | string) {
  return typeof it === 'string' ? { desc: it } : it;
}

// alternate accent colour per index (teal, violet, purple)
function accentAt(ctx: Ctx, i: number): string {
  return [ctx.b.teal, ctx.b.violet, ctx.b.purple][i % 3];
}

// ---- layout renderers -----------------------------------------------
function renderTitle(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, spec: DeckSpec) {
  const { b } = ctx;
  slide.background = { color: b.navy };
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 9.8, y: -1.7, w: 5.2, h: 5.2, rectRadius: 0.5, fill: { color: b.teal, transparency: 62 }, line: { type: 'none' } });
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 11.1, y: 3.5, w: 3.5, h: 3.5, rectRadius: 0.45, fill: { color: b.violet, transparency: 66 }, line: { type: 'none' } });
  chip(ctx, slide, 0.9, 1.5, s.kicker || spec.meta.pathwayLabel, false);
  slide.addText(s.headline || spec.title, { x: 0.85, y: 2.1, w: 9.7, h: 2.3, fontFace: b.fontHeading, fontSize: 42, bold: true, color: WHITE, lineSpacingMultiple: 1.0 });
  slide.addText(s.subhead || spec.subtitle, { x: 0.9, y: 4.55, w: 9.2, h: 0.9, fontFace: b.fontBody, fontSize: 18, color: ctx.iceOnNavy, lineSpacingMultiple: 1.1 });
  if (b.logoDataUri) slide.addImage({ data: b.logoDataUri, x: 0.9, y: 5.7, w: 0.6, h: 0.6 });
  slide.addText(b.siteName, { x: 1.62, y: 5.75, w: 5, h: 0.5, fontFace: b.fontHeading, fontSize: 16, bold: true, color: WHITE, valign: 'middle', margin: 0 });
}

function renderDefinition(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Definition', true);
  title(ctx, slide, s.headline, b.navy);
  slide.addText(s.body || '', { x: 0.9, y: 2.15, w: 7.2, h: 3.2, fontFace: b.fontBody, fontSize: 18, color: b.bodyInk, lineSpacingMultiple: 1.2 });
  if (s.stat) {
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 8.7, y: 1.95, w: 3.7, h: 3.0, rectRadius: 0.18, fill: { color: b.cardBg }, line: { color: b.cardBorder, width: 1 } });
    slide.addText(s.stat.value, { x: 8.7, y: 2.25, w: 3.7, h: 1.55, fontFace: b.fontSerif, fontSize: 54, bold: true, color: b.teal, align: 'center', margin: 0 });
    slide.addText(s.stat.label, { x: 8.85, y: 3.85, w: 3.4, h: 0.9, fontFace: b.fontBody, fontSize: 15, color: b.navy, align: 'center', margin: 0 });
  }
  footer(ctx, slide, siteFooter, false);
}

function renderOutcomes(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Intended outcomes', true);
  title(ctx, slide, s.headline, b.navy);
  const items = (s.items || []).slice(0, 4).map(itemText);
  const cols = 2, gapX = 0.4, gapY = 0.4, x0 = 0.9, y0 = 2.15;
  const cw = (W - x0 * 2 - gapX) / cols, ch = 2.15;
  items.forEach((it, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const x = x0 + c * (cw + gapX), y = y0 + r * (ch + gapY);
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.14, fill: { color: b.cardBg }, line: { color: b.cardBorder, width: 1 } });
    badge(ctx, slide, x + 0.3, y + 0.3, 0.7, String(i + 1), accentAt(ctx, i));
    if (it.title) slide.addText(it.title, { x: x + 1.2, y: y + 0.32, w: cw - 1.5, h: 0.7, fontFace: b.fontHeading, fontSize: 17, bold: true, color: b.navy, valign: 'middle', margin: 0 });
    slide.addText(it.desc, { x: x + 0.32, y: y + (it.title ? 1.2 : 0.35), w: cw - 0.6, h: it.title ? 0.8 : 1.5, fontFace: b.fontBody, fontSize: 14, color: b.bodyInk, margin: 0, lineSpacingMultiple: 1.05, valign: it.title ? 'top' : 'middle' });
  });
  footer(ctx, slide, siteFooter, false);
}

function renderProcess(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Process', true);
  title(ctx, slide, s.headline, b.navy);
  const steps = (s.steps || []).slice(0, 5);
  const n = Math.max(steps.length, 1), x0 = 0.9, y = 2.9, gap = 0.35;
  const bw = (W - x0 * 2 - gap * (n - 1)) / n, bh = 1.7;
  steps.forEach((st, i) => {
    const x = x0 + i * (bw + gap);
    const dark = i % 2 === 0;
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x, y, w: bw, h: bh, rectRadius: 0.12, fill: { color: dark ? b.navy : b.cardBg }, line: dark ? { type: 'none' } : { color: b.cardBorder, width: 1 } });
    slide.addText(String(i + 1), { x, y: y + 0.18, w: bw, h: 0.5, fontFace: b.fontHeading, fontSize: 15, bold: true, color: dark ? b.teal : b.violet, align: 'center', margin: 0 });
    slide.addText(st, { x: x + 0.1, y: y + 0.62, w: bw - 0.2, h: 0.95, fontFace: b.fontHeading, fontSize: 14, bold: true, color: dark ? WHITE : b.navy, align: 'center', valign: 'top', margin: 0, lineSpacingMultiple: 0.95 });
    if (i < n - 1) slide.addText('›', { x: x + bw - 0.02, y: y + 0.45, w: gap + 0.04, h: 0.9, fontFace: b.fontHeading, fontSize: 26, bold: true, color: b.teal, align: 'center', valign: 'middle', margin: 0 });
  });
  if (s.caption) slide.addText(s.caption, { x: 0.9, y: 5.0, w: 11.5, h: 0.6, fontFace: b.fontBody, fontSize: 15, italic: true, color: b.violet });
  footer(ctx, slide, siteFooter, false);
}

function renderLevels(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: b.navy };
  chip(ctx, slide, 0.9, 0.55, s.kicker || 'Levels', false);
  title(ctx, slide, s.headline, WHITE);
  const levels = (s.levels || []).slice(0, 5);
  const y0 = 2.1, rh = 0.66, gap = 0.12;
  levels.forEach((lv, i) => {
    const y = y0 + i * (rh + gap);
    const wStep = 4.2 + i * 1.7;
    const last = i === levels.length - 1;
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 0.9, y, w: wStep, h: rh, rectRadius: 0.1, fill: { color: last ? b.teal : b.violet, transparency: 6 + (levels.length - 1 - i) * 9 }, line: { type: 'none' } });
    slide.addText(lv.name, { x: 1.1, y, w: 2.4, h: rh, fontFace: b.fontHeading, fontSize: 15, bold: true, color: WHITE, valign: 'middle', margin: 0 });
    slide.addText(lv.desc, { x: 3.4, y, w: Math.max(wStep - 2.6, 1.5), h: rh, fontFace: b.fontBody, fontSize: 12.5, color: ctx.iceOnNavy, valign: 'middle', margin: 0 });
  });
  if (s.caption) slide.addText(s.caption, { x: 0.9, y: 6.55, w: 11.5, h: 0.5, fontFace: b.fontBody, fontSize: 14, italic: true, color: ctx.iceOnNavy });
  footer(ctx, slide, siteFooter, true);
}

function renderTwoColumn(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Application', true);
  title(ctx, slide, s.headline, b.navy);
  const y = 2.2, colW = 5.6, colH = 4.1, x1 = 0.9, x2 = 0.9 + colW + 0.55;
  const col = (x: number, colTitle: string, items: string[], accent: string) => {
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x, y, w: colW, h: colH, rectRadius: 0.14, fill: { color: b.cardBg }, line: { color: b.cardBorder, width: 1 } });
    slide.addText(colTitle, { x: x + 0.35, y: y + 0.3, w: colW - 0.7, h: 0.55, fontFace: b.fontHeading, fontSize: 19, bold: true, color: accent, margin: 0 });
    slide.addText((items || []).map((t, i, arr) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < arr.length - 1 } })), { x: x + 0.4, y: y + 1.0, w: colW - 0.75, h: colH - 1.3, fontFace: b.fontBody, fontSize: 15, color: b.bodyInk, paraSpaceAfter: 10, lineSpacingMultiple: 1.02, margin: 0 });
  };
  col(x1, s.left_title || 'Do', s.left || [], b.teal);
  col(x2, s.right_title || 'Avoid', s.right || [], b.purple);
  footer(ctx, slide, siteFooter, false);
}

function renderExamFocus(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: WHITE };
  chip(ctx, slide, 0.9, 0.6, s.kicker || 'Exam focus', true);
  title(ctx, slide, s.headline, b.navy);
  const items = (s.items || []).slice(0, 4).map((it) => itemText(it).desc);
  const y0 = 2.25, rh = 0.92, gap = 0.22;
  items.forEach((it, i) => {
    const y = y0 + i * (rh + gap);
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 0.9, y, w: 11.5, h: rh, rectRadius: 0.1, fill: { color: b.cardBg }, line: { color: b.cardBorder, width: 1 } });
    badge(ctx, slide, 1.1, y + 0.14, 0.64, '✓', b.teal);
    slide.addText(it, { x: 2.0, y, w: 10.2, h: rh, fontFace: b.fontBody, fontSize: 16, color: b.navy, valign: 'middle', margin: 0 });
  });
  footer(ctx, slide, siteFooter, false);
}

function renderClosing(ctx: Ctx, slide: pptxgen.Slide, s: DeckSlide, spec: DeckSpec, siteFooter: string) {
  const { b } = ctx;
  slide.background = { color: b.navy };
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: -1.6, y: 4.1, w: 5.2, h: 5.2, rectRadius: 0.5, fill: { color: b.violet, transparency: 64 }, line: { type: 'none' } });
  slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 10.6, y: -1.4, w: 4, h: 4, rectRadius: 0.4, fill: { color: b.teal, transparency: 66 }, line: { type: 'none' } });
  chip(ctx, slide, 0.9, 1.2, s.kicker || 'Key takeaway', false);
  slide.addText(s.headline, { x: 0.85, y: 1.75, w: 10.6, h: 0.9, fontFace: b.fontHeading, fontSize: 34, bold: true, color: WHITE });
  slide.addText(s.body || '', { x: 0.9, y: 2.85, w: 10.6, h: 2.1, fontFace: b.fontBody, fontSize: 20, color: ctx.iceOnNavy, lineSpacingMultiple: 1.2 });
  if (s.cta) {
    slide.addShape(ctx.pptx.ShapeType.roundRect, { x: 0.9, y: 5.25, w: 7.6, h: 0.75, rectRadius: 0.1, fill: { color: b.teal }, line: { type: 'none' } });
    slide.addText(s.cta, { x: 0.9, y: 5.25, w: 7.6, h: 0.75, fontFace: b.fontHeading, fontSize: 16, bold: true, color: b.navy, align: 'center', valign: 'middle', margin: 0 });
  }
  if (spec.citations.length) {
    const src = spec.citations.map((c) => `[${c.ref}] ${c.source_title}`).join('   ');
    slide.addText(src, { x: 0.9, y: 6.35, w: 11.5, h: 0.5, fontFace: b.fontBody, fontSize: 9, color: ctx.iceOnNavy, margin: 0 });
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

  const ctx: Ctx = { pptx, b: branding, iceOnNavy: lighten(branding.violet, 0.72) };
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
