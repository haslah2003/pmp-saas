import assert from 'node:assert/strict';
import {
  readDeckLocale,
  readPathway,
  readSlideCount,
  validateDeckSpec,
} from '../lib/study-studio/presentation/validation';

const baseSpec = {
  meta: {
    topic: 'Stakeholder engagement',
    pathway: 'pmbok8',
    locale: 'en',
    pathwayLabel: 'PMBOK 8 + ECO 2026',
    generatedAt: new Date().toISOString(),
    requestedSlideCount: 3,
    grounded: false,
  },
  title: 'Stakeholder Engagement',
  subtitle: 'An evidence-grounded overview',
  slides: [
    { n: 9, layout: 'title', headline: 'Stakeholder Engagement', subhead: 'PMBOK 8 + ECO 2026', citationRefs: [] },
    { n: 8, layout: 'definition_callout', headline: 'Engage with intent', body: 'Understand needs and align expectations.', citationRefs: [1] },
    { n: 7, layout: 'closing', headline: 'Apply the mindset', body: 'Engage early and adapt deliberately.', citationRefs: [] },
  ],
  citations: [{ ref: 1, source_title: 'ECO 2026', chunk_title: 'People tasks', framework: 'pmbok8' }],
};

const valid = validateDeckSpec(baseSpec, 3);
assert.equal(valid.slides.length, 3);
assert.deepEqual(valid.slides.map((slide) => slide.n), [1, 2, 3]);
assert.equal(valid.meta.grounded, true);
assert.equal(readPathway('bridge'), 'bridge');
assert.equal(readDeckLocale('ar'), 'ar');
assert.equal(readSlideCount(30), 30);
const withoutTitleSubhead = validateDeckSpec({
  ...baseSpec,
  meta: { ...baseSpec.meta, templateId: 'pmpeco-medium' },
  slides: [{ ...baseSpec.slides[0], subhead: undefined }, baseSpec.slides[1], baseSpec.slides[2]],
});
assert.equal(withoutTitleSubhead.slides[0].subhead, undefined);
assert.equal(withoutTitleSubhead.meta.templateId, 'pmpeco-medium');

const repairableSpec = validateDeckSpec({
  ...baseSpec,
  slides: [
    baseSpec.slides[0],
    {
      n: 2,
      layout: 'levels_ladder',
      headline: 'A repairable ladder',
      levels: [{ name: 'One level', desc: 'A'.repeat(220) }],
      citationRefs: [1],
    },
    baseSpec.slides[2],
  ],
});
assert.equal(repairableSpec.slides[1].layout, 'definition_callout');
assert.ok((repairableSpec.slides[1].body?.length || 0) <= 180 + 'One level: '.length);

const overlongItemsSpec = validateDeckSpec({
  ...baseSpec,
  slides: [
    baseSpec.slides[0],
    {
      n: 2,
      layout: 'outcomes_grid',
      headline: 'Bounded cards',
      items: Array.from({ length: 6 }, (_, index) => ({ title: `Item ${index + 1}`, desc: 'word '.repeat(60) })),
      citationRefs: [1],
    },
    baseSpec.slides[2],
  ],
});
assert.equal(overlongItemsSpec.slides[1].items?.length, 4);
assert.ok((overlongItemsSpec.slides[1].items?.[0] as { desc: string }).desc.length <= 180);

assert.throws(() => readPathway('pmbok-8'), /Pathway/);
assert.throws(() => readDeckLocale('fr'), /English or Arabic/);
assert.throws(() => readSlideCount(31), /3 to 30/);
assert.throws(
  () => validateDeckSpec({ ...baseSpec, slides: [baseSpec.slides[0], { ...baseSpec.slides[1], citationRefs: [99] }, baseSpec.slides[2]] }),
  /invalid evidence reference/
);

console.log('presentation validation tests passed');
