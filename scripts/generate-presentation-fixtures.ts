import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildDeckPptx } from '../lib/study-studio/presentation/deck-builder';
import { buildCleanTemplateDeck } from '../lib/study-studio/presentation/deck-builder-clean';
import { buildMediumTemplateDeck } from '../lib/study-studio/presentation/deck-builder-medium';
import { validateDeckSpec } from '../lib/study-studio/presentation/validation';
import type { DeckBranding, DeckSpec } from '../lib/study-studio/presentation/types';

const outputDir = process.argv[2] || '/tmp/pmpeco-presentation-fixtures';

const branding: DeckBranding = {
  siteName: 'PMPeco',
  logoDataUri: null,
  navy: '0A4065',
  teal: '00BFB7',
  violet: '5955EB',
  purple: 'A003BA',
  cardBg: 'EAE8F3',
  cardBorder: 'D7D6F5',
  bodyInk: '49495A',
  fontHeading: 'Poppins',
  fontBody: 'Open Sans',
  fontSerif: 'Libre Baskerville',
};

const citations = [
  { ref: 1, source_title: 'PMP Examination Content Outline 2026', chunk_title: 'People domain tasks', framework: 'pmbok8' },
  { ref: 2, source_title: 'PMBOK Guide Eighth Edition', chunk_title: 'Stakeholder performance domain', framework: 'pmbok8' },
];

function meta(locale: 'en' | 'ar', count: number) {
  return {
    topic: locale === 'ar' ? 'إشراك أصحاب المصلحة' : 'Stakeholder engagement',
    pathway: 'pmbok8' as const,
    locale,
    pathwayLabel: 'PMBOK 8 + ECO 2026',
    generatedAt: new Date().toISOString(),
    requestedSlideCount: count,
    templateId: 'pmpeco-clean' as const,
    grounded: false,
  };
}

const english = validateDeckSpec({
  meta: meta('en', 8),
  title: 'Stakeholder Engagement',
  subtitle: 'Evidence-grounded decisions across the project lifecycle',
  citations,
  slides: [
    { layout: 'title', headline: 'Stakeholder Engagement', subhead: 'Align expectations before they become issues', citationRefs: [], notes: 'Open with the value of deliberate engagement.' },
    { layout: 'definition_callout', headline: 'Engagement is an ongoing leadership practice', kicker: 'Core idea', body: 'Identify stakeholders, understand their needs, and adapt communication throughout delivery.', stat: { value: 'Early', label: 'Engage before decisions harden' }, citationRefs: [1, 2], notes: 'Emphasize that engagement is continuous.' },
    { layout: 'outcomes_grid', headline: 'Four outcomes keep expectations aligned', kicker: 'Outcomes', items: [{ title: 'Trust', desc: 'Make commitments visible.' }, { title: 'Clarity', desc: 'Confirm needs and constraints.' }, { title: 'Support', desc: 'Build ownership of decisions.' }, { title: 'Adaptation', desc: 'Respond to changing influence.' }], citationRefs: [1], notes: 'Connect each outcome to exam decisions.' },
    { layout: 'process_flow', headline: 'Move from identification to adaptation', kicker: 'Flow', steps: ['Identify', 'Analyze', 'Engage', 'Monitor', 'Adapt'], caption: 'Repeat the cycle as the project context changes.', citationRefs: [1, 2], notes: 'Walk through the engagement loop.' },
    { layout: 'levels_ladder', headline: 'Choose the depth of engagement intentionally', kicker: 'Approach', levels: [{ name: 'Inform', desc: 'Share relevant facts.' }, { name: 'Consult', desc: 'Invite input before deciding.' }, { name: 'Collaborate', desc: 'Shape decisions together.' }, { name: 'Empower', desc: 'Delegate appropriate ownership.' }], citationRefs: [2], notes: 'Match engagement depth to influence and impact.' },
    { layout: 'two_column', headline: 'Use evidence, not assumptions', kicker: 'Practice', left_title: 'Do', left: ['Listen before proposing', 'Tailor communication', 'Reassess influence'], right_title: 'Avoid', right: ['Treating the register as static', 'Using one message for everyone', 'Escalating before engaging'], citationRefs: [1, 2], notes: 'Contrast sound judgment with common traps.' },
    { layout: 'exam_focus', headline: 'The best response engages before escalating', kicker: 'Exam focus', items: ['Clarify the concern directly.', 'Assess impact and influence.', 'Adapt the engagement approach.', 'Escalate only when appropriate.'], citationRefs: [1], notes: 'Reinforce the PMI mindset.' },
    { layout: 'closing', headline: 'Engage early, listen continuously, adapt deliberately', body: 'Stakeholder alignment is maintained through purposeful communication and timely adjustment.', cta: 'Apply the mindset to your next scenario', citationRefs: [], notes: 'Close by returning to deliberate engagement.' },
  ],
}, 8);

const arabic = validateDeckSpec({
  meta: meta('ar', 5),
  title: 'إشراك أصحاب المصلحة',
  subtitle: 'قرارات قائمة على الأدلة طوال دورة حياة المشروع',
  citations,
  slides: [
    { layout: 'title', headline: 'إشراك أصحاب المصلحة', subhead: 'وحّد التوقعات قبل أن تتحول إلى مشكلات', citationRefs: [], notes: 'ابدأ بقيمة المشاركة المقصودة.' },
    { layout: 'definition_callout', headline: 'الإشراك ممارسة قيادية مستمرة', kicker: 'الفكرة الأساسية', body: 'حدّد أصحاب المصلحة وافهم احتياجاتهم وكيّف التواصل طوال تنفيذ المشروع.', citationRefs: [1, 2], notes: 'وضّح أن الإشراك عملية مستمرة.' },
    { layout: 'process_flow', headline: 'انتقل من التحديد إلى التكيّف', kicker: 'المسار', steps: ['حدّد', 'حلّل', 'أشرك', 'راقب', 'كيّف'], caption: 'كرّر الدورة كلما تغيّر سياق المشروع.', citationRefs: [1, 2], notes: 'اشرح دورة الإشراك.' },
    { layout: 'exam_focus', headline: 'ابدأ بالإشراك قبل التصعيد', kicker: 'تركيز الاختبار', items: ['وضّح القلق مباشرة.', 'قيّم التأثير والنفوذ.', 'كيّف نهج الإشراك.', 'صعّد عند الحاجة فقط.'], citationRefs: [1], notes: 'عزّز عقلية PMI.' },
    { layout: 'closing', headline: 'أشرك مبكراً واستمع باستمرار', body: 'تحافظ على المواءمة من خلال التواصل الهادف والتكيّف في الوقت المناسب.', cta: 'طبّق العقلية على السيناريو التالي', citationRefs: [], notes: 'اختم بالعودة إلى الإشراك المقصود.' },
  ],
}, 5);

async function imageData(file: string) {
  const bytes = await readFile(path.join(process.cwd(), 'public', 'illustrations', file));
  return `data:image/jpeg;base64,${bytes.toString('base64')}`;
}

async function render(name: string, spec: DeckSpec, files: string[]) {
  const illustrations: Record<number, string> = {};
  for (let i = 0; i < Math.min(files.length, spec.slides.length); i += 1) {
    illustrations[spec.slides[i].n] = await imageData(files[i]);
  }
  const buffer = await buildDeckPptx(spec, branding, illustrations);
  await writeFile(path.join(outputDir, name), buffer);
}

async function renderClean(name: string, spec: DeckSpec) {
  const buffer = await buildCleanTemplateDeck(spec);
  await writeFile(path.join(outputDir, name), buffer);
}

async function renderMedium(name: string, spec: DeckSpec) {
  const mediumSpec = validateDeckSpec({ ...spec, meta: { ...spec.meta, templateId: 'pmpeco-medium' } });
  const buffer = await buildMediumTemplateDeck(mediumSpec);
  await writeFile(path.join(outputDir, name), buffer);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await render('presentation-en-8-slides.pptx', english, ['stakeholders-engagement.jpg', 'team-planning.jpg']);
  await render('presentation-ar-5-slides.pptx', arabic, ['stakeholders-engagement.jpg', 'process-leadership.jpg']);
  await renderClean('presentation-clean-en-8-slides.pptx', english);
  await renderClean('presentation-clean-ar-5-slides.pptx', arabic);
  await renderMedium('presentation-medium-en-8-slides.pptx', english);
  await renderMedium('presentation-medium-ar-5-slides.pptx', arabic);
  console.log(outputDir);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
