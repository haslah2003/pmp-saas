import 'server-only';
import path from 'node:path';
import Automizer, { modify, type ISlide, type ShapeModificationCallback } from 'pptx-automizer';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import type JSZip from 'jszip';
import type { DeckSlide, DeckSpec } from './types';

const TEMPLATE_FILE = 'pmpeco-clean.pptx';

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
    for (const tag of ['a:rPr', 'a:endParaRPr']) {
      for (const props of Array.from(element.getElementsByTagName(tag))) {
        props.setAttribute('lang', 'ar-SA');
        const size = Number(props.getAttribute('sz'));
        if (size) props.setAttribute('sz', String(Math.round(size * 0.9)));
      }
    }
  };
}

function setText(text: string, rtl: boolean) {
  return rtl ? [modify.setText(text), rtlModifier()] : modify.setText(text);
}

function noteText(slide: DeckSlide, spec: DeckSpec) {
  const cited = spec.citations.filter((citation) => slide.citationRefs.includes(citation.ref));
  const parts = slide.notes ? [slide.notes] : [];
  if (cited.length) {
    parts.push('[Sources]\n' + cited.map((c) => `[${c.ref}] ${c.source_title} — ${c.chunk_title} (${c.framework})`).join('\n'));
  }
  return parts.join('\n\n');
}

function addTitle(slide: ISlide, s: DeckSlide, spec: DeckSpec, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.headline || spec.title, rtl));
  slide.modifyElement('Text 1', setText(s.subhead || spec.subtitle, rtl));
  slide.modifyElement('Text 3', setText(spec.meta.pathwayLabel.split(' + ')[0], false));
  slide.modifyElement('Text 5', setText(spec.meta.locale === 'ar' ? 'العربية' : 'PMPeco', rtl));
}

function addDefinition(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.headline, rtl));
  slide.modifyElement('Text 1', setText(s.body || '', rtl));
  slide.modifyElement('Text 3', setText(s.stat ? `${s.stat.value}\n${s.stat.label}` : s.caption || s.kicker || '', rtl));
}

const GRID = [
  { bg: 'Shape 1', badge: 'Shape 2', icon: 'Image 0', title: 'Text 3', body: 'Text 4' },
  { bg: 'Shape 5', badge: 'Shape 6', icon: 'Image 1', title: 'Text 7', body: 'Text 8' },
  { bg: 'Shape 9', badge: 'Shape 10', icon: 'Image 2', title: 'Text 11', body: 'Text 12' },
  { bg: 'Shape 13', badge: 'Shape 14', icon: 'Image 3', title: 'Text 15', body: 'Text 16' },
  { bg: 'Shape 17', badge: 'Shape 18', icon: 'Image 4', title: 'Text 19', body: 'Text 20' },
  { bg: 'Shape 21', badge: 'Shape 22', icon: 'Image 5', title: 'Text 23', body: 'Text 24' },
];

function addGrid(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.headline, rtl));
  const payload = s.items || s.levels?.map((level) => ({ title: level.name, desc: level.desc })) || [];
  const items = payload.slice(0, 4).map((item) => typeof item === 'string' ? { desc: item } : item);
  GRID.forEach((slot, index) => {
    const item = items[index];
    if (item) {
      slide.modifyElement(slot.title, setText(item.title || String(index + 1), rtl));
      slide.modifyElement(slot.body, setText(item.desc, rtl));
    } else {
      slide.removeElement(slot.bg).removeElement(slot.badge).removeElement(slot.title).removeElement(slot.body);
    }
  });
}

function addProcessOrColumns(slide: ISlide, s: DeckSlide, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.headline, rtl));
  const labels = s.steps || s.left || [];
  [0, 1, 2, 3].forEach((index) => {
    slide.modifyElement(`Text ${index === 0 ? 2 : index === 1 ? 5 : index === 2 ? 8 : 11}`, setText(String(index + 1).padStart(2, '0'), rtl));
    slide.modifyElement(`Text ${index === 0 ? 4 : index === 1 ? 7 : index === 2 ? 10 : 13}`, setText(labels[index] || '', rtl));
  });
  slide.modifyElement('Text 1', setText(s.left_title || s.kicker || (rtl ? 'الخطوات' : 'Steps'), rtl));
  slide.modifyElement('Text 14', setText(s.right_title || s.caption || (rtl ? 'النتيجة' : 'Outcome'), rtl));
  slide.modifyElement('Text 15', setText((s.right || []).join('\n') || s.body || s.caption || '', rtl));
  slide.modifyElement('Text 17', setText(s.cta || (s.steps?.[4] ? `05  ${s.steps[4]}` : (rtl ? 'اختر الاستجابة التي تعزز المواءمة.' : 'Choose the response that builds alignment.')), rtl));
}

function addClosing(slide: ISlide, s: DeckSlide, spec: DeckSpec, rtl: boolean) {
  slide.modifyElement('Text 0', setText(s.headline, rtl));
  slide.modifyElement('Text 1', setText(s.body || '', rtl));
  slide.modifyElement('Text 3', setText(rtl ? 'التالي' : (s.cta || spec.meta.pathwayLabel), rtl));
  slide.modifyElement('Text 5', setText(spec.meta.locale === 'ar' ? 'الخلاصة' : 'KEY TAKEAWAY', rtl));
}

function sourceSlideFor(s: DeckSlide) {
  switch (s.layout) {
    case 'title': return 1;
    case 'definition_callout': return 5;
    case 'outcomes_grid': return 4;
    case 'levels_ladder': return 4;
    case 'process_flow':
    case 'two_column': return 9;
    case 'exam_focus': return 4;
    case 'closing': return 1;
    default: return 5;
  }
}

function replaceNotes(zip: JSZip, spec: DeckSpec) {
  return Promise.all(spec.slides.map(async (slide, index) => {
    const file = zip.file(`ppt/notesSlides/notesSlide${index + 1}.xml`);
    if (!file) return;
    const xml = await file.async('string');
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const shapes = Array.from(doc.getElementsByTagName('p:sp'));
    const bodyShape = shapes.find((shape) => Array.from(shape.getElementsByTagName('p:ph')).some((ph) => ph.getAttribute('type') === 'body'));
    const txBody = bodyShape?.getElementsByTagName('p:txBody').item(0);
    if (!txBody) return;
    for (const paragraph of Array.from(txBody.getElementsByTagName('a:p'))) txBody.removeChild(paragraph);
    const paragraph = doc.createElement('a:p');
    const run = doc.createElement('a:r');
    const runProps = doc.createElement('a:rPr');
    runProps.setAttribute('lang', spec.meta.locale === 'ar' ? 'ar-SA' : 'en-US');
    const text = doc.createElement('a:t');
    text.appendChild(doc.createTextNode(noteText(slide, spec)));
    run.appendChild(runProps);
    run.appendChild(text);
    paragraph.appendChild(run);
    txBody.appendChild(paragraph);
    zip.file(`ppt/notesSlides/notesSlide${index + 1}.xml`, new XMLSerializer().serializeToString(doc));
  }));
}

export async function buildCleanTemplateDeck(spec: DeckSpec): Promise<Buffer> {
  const templateDir = path.join(process.cwd(), 'assets', 'presentation-templates');
  const automizer = new Automizer({
    templateDir,
    removeExistingSlides: true,
    autoImportSlideMasters: true,
    // The source deck contains decorative image fills whose relationship lives
    // on the layout/master. Automizer's orphan cleanup assumes a slide-local
    // relationship and rejects those otherwise-valid inherited assets.
    cleanup: false,
    cleanupPlaceholders: false,
    verbosity: 0,
  });
  const presentation = automizer.loadRoot(TEMPLATE_FILE).load(TEMPLATE_FILE, 'clean');
  const rtl = spec.meta.locale === 'ar';

  for (const slideSpec of spec.slides) {
    presentation.addSlide('clean', sourceSlideFor(slideSpec), (slide) => {
      switch (slideSpec.layout) {
        case 'title': addTitle(slide, slideSpec, spec, rtl); break;
        case 'definition_callout': addDefinition(slide, slideSpec, rtl); break;
        case 'outcomes_grid':
        case 'exam_focus': addGrid(slide, slideSpec, rtl); break;
        case 'levels_ladder': addGrid(slide, slideSpec, rtl); break;
        case 'process_flow':
        case 'two_column': addProcessOrColumns(slide, slideSpec, rtl); break;
        case 'closing': addClosing(slide, slideSpec, spec, rtl); break;
      }
    });
  }

  const zip = await presentation.getJSZip();
  await replaceNotes(zip, spec);
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}
