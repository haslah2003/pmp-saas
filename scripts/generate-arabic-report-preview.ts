import fs from 'node:fs';
import path from 'node:path';
import { buildIndividualReport } from '../lib/diagnostic/report';
import { generateArabicReadinessPdf } from '../lib/diagnostic/arabic-report-pdf';

const approaches = ['predictive', 'agile', 'hybrid'] as const;
const cognitive = ['recall', 'application', 'analysis'] as const;
const decisions = ['first', 'next', 'best'] as const;
const domains = ['people', 'process', 'business_environment'] as const;
const responses = Array.from({ length: 25 }, (_, index) => ({
  itemId: `sample-${index + 1}`,
  selectedOption: index % 4 === 0 ? 'B' : 'A',
  correct: ![0, 3, 7, 9, 12, 15, 18, 21, 23, 24].includes(index),
  seconds: index < 5 ? 38 : index > 22 ? 145 : 82 + index % 7,
}));
const items = responses.map((response, index) => ({
  id: response.itemId,
  stem: 'ما الإجراء الأنسب الذي ينبغي لمدير المشروع اتخاذه في هذا الموقف؟',
  domain: index < 10 ? domains[0] : index < 23 ? domains[1] : domains[2],
  approach: approaches[index % approaches.length],
  ecoTask: index < 10 ? 'إدارة النزاع' : index < 23 ? 'إدارة المخاطر' : 'الامتثال',
  cognitiveLevel: cognitive[index % cognitive.length],
  decisionPriority: decisions[index % decisions.length],
  rationaleDistractors: { B: index % 2 ? 'تم اختيار الإجراء قبل تقييم الأثر والقيود.' : 'تم اللجوء إلى التصعيد قبل التحليل التعاوني.' },
}));
const score = {
  readinessBand: 'developing' as const,
  weightedScore: .61,
  standardError: .08,
  domainScores: {
    people: { correct: 6, total: 10, proportion: .6, weighted: .252 },
    process: { correct: 8, total: 13, proportion: 8 / 13, weighted: 4 / 13 },
    business_environment: { correct: 1, total: 2, proportion: .5, weighted: .04 },
  },
  ecoTaskGaps: [
    { ecoTask: 'إدارة النزاع', mastery: .4, itemCount: 5 },
    { ecoTask: 'إدارة المخاطر', mastery: .5, itemCount: 6 },
    { ecoTask: 'الامتثال', mastery: .5, itemCount: 2 },
  ],
};
const base = buildIndividualReport(score, responses, items, 'ar');
const report = {
  ...base,
  learner: {
    fullName: 'سارة أحمد المنصوري',
    reportId: 'PMP-SAMPLE-AR-001',
    pathway: 'المسار الحالي - PMBOK 8 وECO 2026',
    language: 'العربية',
    assessedAt: '2026-09-15T09:00:00.000Z',
    attempt: 1,
    validity: 'نموذج مستقل للمراجعة',
  },
};
async function main() {
  const output = path.resolve('output/pdf/pmpeco-readiness-report-arabic-preview.pdf');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, await generateArabicReadinessPdf(report));
  console.log(output);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
