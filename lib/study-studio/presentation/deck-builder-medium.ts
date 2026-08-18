import 'server-only';
import path from 'node:path';
import Automizer, { modify, type ISlide, type ShapeModificationCallback } from 'pptx-automizer';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import type JSZip from 'jszip';
import type { DeckSlide, DeckSpec } from './types';

const TEMPLATE_FILE = 'pmpeco-medium.pptx';

function rtlModifier(): ShapeModificationCallback {
  return (element) => {
    for (const body of Array.from(element.getElementsByTagName('a:bodyPr'))) body.setAttribute('rtlCol', '1');
    for (const paragraph of Array.from(element.getElementsByTagName('a:p'))) {
      let props = paragraph.getElementsByTagName('a:pPr').item(0);
      if (!props) {
        props = paragraph.ownerDocument!.createElement('a:pPr');
        paragraph.insertBefore(props, paragraph.firstChild);
      }
      props.setAttribute('algn', 'r');
      props.setAttribute('rtl', '1');
    }
    for (const props of Array.from(element.getElementsByTagName('a:rPr'))) props.setAttribute('lang', 'ar-SA');
  };
}

function setText(text: string, rtl: boolean) {
  return rtl ? [modify.setText(text), rtlModifier()] : modify.setText(text);
}

function sourceSlideFor(layout: DeckSlide['layout']) {
  switch (layout) {
    case 'title': return 1;
    case 'definition_callout': return 2;
    case 'process_flow': return 6;
    case 'two_column': return 8;
    case 'exam_focus': return 9;
    case 'closing': return 10;
    default: return 5;
  }
}

function addTitle(slide: ISlide, s: DeckSlide, spec: DeckSpec, rtl: boolean) {
  slide.modifyElement('Text 3', setText(s.headline || spec.title, rtl));
  slide.modifyElement('Text 2', setText(spec.meta.pathwayLabel, false));
}

function addDefinition(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.kicker || (rtl ? 'الفكرة الأساسية' : 'KEY IDEA'), rtl));
  slide.modifyElement('Text 1', setText(s.headline, rtl));
  slide.modifyElement('Text 2', setText(s.body || s.subhead || '', rtl));
  slide.modifyElement('Text 4', setText(s.stat?.value || '1', rtl));
  slide.modifyElement('Text 5', setText(s.stat?.label || s.caption || s.kicker || '', rtl));
}

const CARD_TEXT = [
  { number: 'Text 3', title: 'Text 4', body: 'Text 5' },
  { number: 'Text 7', title: 'Text 8', body: 'Text 9' },
  { number: 'Text 11', title: 'Text 12', body: 'Text 13' },
  { number: 'Text 15', title: 'Text 16', body: 'Text 17' },
];

function addCards(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.kicker || (rtl ? 'نقاط رئيسية' : 'KEY POINTS'), rtl));
  slide.modifyElement('Text 1', setText(s.headline, rtl));
  const items = s.items || s.levels?.map((level) => ({ title: level.name, desc: level.desc })) || [];
  CARD_TEXT.forEach((slot, index) => {
    const item = items[index];
    const normalized = typeof item === 'string' ? { title: String(index + 1), desc: item } : item;
    slide.modifyElement(slot.number, setText(normalized ? String(index + 1) : '', rtl));
    slide.modifyElement(slot.title, setText(normalized?.title || '', rtl));
    slide.modifyElement(slot.body, setText(normalized?.desc || '', rtl));
  });
}

function addProcess(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.kicker || (rtl ? 'العملية' : 'PROCESS'), rtl));
  slide.modifyElement('Text 1', setText(s.headline, rtl));
  const steps = s.steps || [];
  [0, 1, 2, 3, 4].forEach((index) => {
    slide.modifyElement(`Text ${index * 4 + 3}`, setText(String(index + 1), rtl));
    slide.modifyElement(`Text ${index * 4 + 4}`, setText(steps[index] || '', rtl));
  });
  slide.modifyElement('Text 21', setText(s.caption || '', rtl));
}

function addColumns(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.kicker || (rtl ? 'مقارنة' : 'COMPARISON'), rtl));
  slide.modifyElement('Text 1', setText(s.headline, rtl));
  slide.modifyElement('Text 3', setText(s.left_title || '', rtl));
  slide.modifyElement('Text 4', setText((s.left || []).join('\n'), rtl));
  slide.modifyElement('Text 6', setText(s.right_title || '', rtl));
  slide.modifyElement('Text 7', setText((s.right || []).join('\n'), rtl));
}

function addExam(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.kicker || (rtl ? 'اختبر فهمك' : 'TEST YOUR RECALL'), rtl));
  slide.modifyElement('Text 1', setText(s.headline, rtl));
  const items = s.items || [];
  [4, 7, 10, 13].forEach((name, index) => {
    const item = items[index];
    slide.modifyElement(`Text ${name}`, setText(typeof item === 'string' ? item : item?.desc || '', rtl));
  });
}

function addClosing(slide: ISlide, s: DeckSlide, spec: DeckSpec, rtl: boolean) {
  slide.modifyElement('Text 2', setText(spec.meta.pathwayLabel, false));
  slide.modifyElement('Text 3', setText(s.headline, rtl));
  slide.modifyElement('Text 4', setText(s.body || '', rtl));
  slide.modifyElement('Text 6', setText(s.cta || (rtl ? 'طبّق الفكرة في السيناريو التالي.' : 'Apply the idea to your next scenario.'), rtl));
}

function noteText(slide: DeckSlide, spec: DeckSpec) {
  const cited = spec.citations.filter((citation) => slide.citationRefs.includes(citation.ref));
  return [slide.notes || '', cited.length ? '[Sources]\n' + cited.map((c) => `[${c.ref}] ${c.source_title} — ${c.chunk_title} (${c.framework})`).join('\n') : '']
    .filter(Boolean).join('\n\n');
}

async function replaceNotes(zip: JSZip, spec: DeckSpec) {
  await Promise.all(spec.slides.map(async (slide, index) => {
    const file = zip.file(`ppt/notesSlides/notesSlide${index + 1}.xml`);
    if (!file) return;
    const doc = new DOMParser().parseFromString(await file.async('string'), 'application/xml');
    const body = Array.from(doc.getElementsByTagName('p:sp')).find((shape) =>
      Array.from(shape.getElementsByTagName('p:ph')).some((ph) => ph.getAttribute('type') === 'body'));
    const txBody = body?.getElementsByTagName('p:txBody').item(0);
    if (!txBody) return;
    for (const p of Array.from(txBody.getElementsByTagName('a:p'))) txBody.removeChild(p);
    const p = doc.createElement('a:p');
    const r = doc.createElement('a:r');
    const t = doc.createElement('a:t');
    t.appendChild(doc.createTextNode(noteText(slide, spec)));
    r.appendChild(t);
    p.appendChild(r);
    txBody.appendChild(p);
    zip.file(`ppt/notesSlides/notesSlide${index + 1}.xml`, new XMLSerializer().serializeToString(doc));
  }));
}

export async function buildMediumTemplateDeck(spec: DeckSpec): Promise<Buffer> {
  const automizer = new Automizer({
    templateDir: path.join(process.cwd(), 'assets', 'presentation-templates'),
    removeExistingSlides: true,
    autoImportSlideMasters: true,
    cleanup: false,
    cleanupPlaceholders: false,
    verbosity: 0,
  });
  const presentation = automizer.loadRoot(TEMPLATE_FILE).load(TEMPLATE_FILE, 'medium');
  const rtl = spec.meta.locale === 'ar';
  for (const s of spec.slides) {
    presentation.addSlide('medium', sourceSlideFor(s.layout), (slide) => {
      switch (s.layout) {
        case 'title': addTitle(slide, s, spec, rtl); break;
        case 'definition_callout': addDefinition(slide, s, rtl); break;
        case 'outcomes_grid':
        case 'levels_ladder': addCards(slide, s, rtl); break;
        case 'process_flow': addProcess(slide, s, rtl); break;
        case 'two_column': addColumns(slide, s, rtl); break;
        case 'exam_focus': addExam(slide, s, rtl); break;
        case 'closing': addClosing(slide, s, spec, rtl); break;
      }
    });
  }
  const zip = await presentation.getJSZip();
  await replaceNotes(zip, spec);
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}
