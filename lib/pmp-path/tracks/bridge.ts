/**
 * lib/pmp-path/tracks/bridge.ts
 * Track: Bridge 7 → 8 (transition path · for candidates already prepared on PMBOK 7
 *                     who need to focus on what's NEW, CHANGED, or DEPRECATED in PMBOK 8)
 * Strict framework: 4 phases · 10 modules · 7-step learning loop · single CTA.
 * ECO weight shift: People 42 → 33% · Process 50 → 41% · Business Environment 8 → 26%.
 */

import type { Lesson, Module, Phase, Track } from '../types';

const TRACK_ID = 'bridge-7-to-8' as const;

function L(
  id: string,
  titleEn: string,
  titleAr: string,
  objectiveEn: string,
  objectiveAr: string,
  minutes: number,
  practiceQ: number,
  tags: string[] = []
): Lesson {
  return {
    id: `${TRACK_ID}-${id}`,
    code: id,
    title: { en: titleEn, ar: titleAr },
    objective: { en: objectiveEn, ar: objectiveAr },
    estimatedMinutes: minutes,
    practiceQuestionCount: practiceQ,
    reviewTags: tags,
  };
}

// ============================================================
// PHASE 1 — ORIENT (2 modules · 6 lessons · ~3h)
// ============================================================

const B1: Module = {
  id: `${TRACK_ID}-B1`,
  code: 'B1',
  phaseId: 'foundation',
  trackId: TRACK_ID,
  title: { en: 'What changed at a glance', ar: 'ما الذي تغيّر بنظرة سريعة' },
  description: {
    en: 'The architecture shift from PMBOK 7 to PMBOK 8 — consolidation logic, weight redistribution, new concepts, deprecations.',
    ar: 'التحول البنيوي من PMBOK 7 إلى PMBOK 8 — منطق الدمج، إعادة توزيع الأوزان، المفاهيم الجديدة، والملغى.',
  },
  prerequisiteModuleId: null,
  lessons: [
    L('B1.L1', 'The PMBOK 8 thesis — why this edition', 'فرضية PMBOK 8 — لماذا هذا الإصدار',
      'Understand the editorial intent behind the 8th edition.',
      'فهم القصد التحريري وراء الإصدار الثامن.',
      30, 6, ['bridge', 'overview']),
    L('B1.L2', 'High-level diff — what stayed, changed, added, removed', 'الفرق العام — ما بقي وما تغيّر وما أُضيف وما حُذف',
      'See the 7-vs-8 map at a glance.',
      'رؤية خريطة المقارنة بين الإصدارين السابع والثامن بنظرة سريعة.',
      30, 7, ['bridge', 'diff']),
    L('B1.L3', 'ECO weight shift — what it means for your prep', 'تحول أوزان ECO — ماذا يعني ذلك لتحضيرك',
      'Internalize the People 42→33, Process 50→41, BE 8→26 shift.',
      'استيعاب التحول: الأفراد من 42 إلى 33، العملية من 50 إلى 41، بيئة الأعمال من 8 إلى 26.',
      30, 8, ['bridge', 'eco-shift']),
  ],
};

const B2: Module = {
  id: `${TRACK_ID}-B2`,
  code: 'B2',
  phaseId: 'foundation',
  trackId: TRACK_ID,
  title: { en: '12 principles → 6 — the consolidation map', ar: '12 مبدأً → 6 — خريطة الدمج' },
  description: {
    en: 'How the 12 PMBOK 7 principles map into the 6 consolidated principles of PMBOK 8. Nothing was lost — but the framing changed.',
    ar: 'كيف تنطوي مبادئ PMBOK 7 الاثنا عشر تحت المبادئ المُدمَجة الستة في PMBOK 8. لم يُفقد شيء — لكن الإطار تغيّر.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B1`,
  lessons: [
    L('B2.L1', 'The mapping table — 12 to 6', 'جدول التطابق — من 12 إلى 6',
      'Memorize which of the 12 went where in the 6.',
      'حفظ أيٌّ من الاثني عشر دُمج في كل واحد من الستة.',
      30, 7, ['bridge', 'principles']),
    L('B2.L2', 'What the 6 emphasize that the 12 underplayed', 'ما الذي تُبرزه الستة وكان مكتوماً في الاثني عشر',
      'Spot the new emphasis points.',
      'تحديد نقاط التأكيد الجديدة.',
      30, 8, ['bridge', 'principles']),
    L('B2.L3', 'Quick principle-recall self-check', 'اختبار سريع لاستحضار المبادئ',
      'Drill yourself on both sets in parallel.',
      'تدريب نفسك على المجموعتين بالتوازي.',
      30, 8, ['bridge', 'self-check']),
  ],
};

// ============================================================
// PHASE 2 — MASTER THE DELTAS (4 modules · 16 lessons · ~10h)
// ============================================================

const B3: Module = {
  id: `${TRACK_ID}-B3`,
  code: 'B3',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  ecoWeightPct: 33,
  title: { en: 'People domain delta (42% → 33%)', ar: 'تغيرات مجال الأفراد (42% → 33%)' },
  description: {
    en: 'The People domain shrank in weight but the rigor expectations grew. New emphasis on emotional intelligence patterns and virtual-team mastery.',
    ar: 'تقلّص وزن مجال الأفراد لكن سقف التوقعات في الدقة ارتفع. تأكيد جديد على الذكاء العاطفي وإتقان الفرق الافتراضية.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B2`,
  lessons: [
    L('B3.L1', 'What stayed identical in People', 'ما بقي على حاله في الأفراد',
      'Confirm tasks unchanged so you don\'t re-study them.',
      'تأكيد المهام التي لم تتغيّر حتى لا تعيد دراستها.',
      35, 7, ['bridge', 'people']),
    L('B3.L2', 'What deepened — emotional intelligence and virtual teams', 'ما تعمّق — الذكاء العاطفي والفرق الافتراضية',
      'Study the expanded EI framework and virtual-team patterns.',
      'دراسة إطار الذكاء العاطفي الموسّع وأنماط الفرق الافتراضية.',
      35, 8, ['bridge', 'people']),
    L('B3.L3', 'New question patterns in People — what the 2026 exam tests', 'أنماط الأسئلة الجديدة في الأفراد — ما يختبره امتحان 2026',
      'Recognize the new scenario styles and answer signals.',
      'التعرّف على أساليب السيناريو الجديدة ودلالات الإجابة.',
      35, 8, ['bridge', 'people', 'exam']),
    L('B3.L4', 'People delta drill', 'تدريب على تغيرات الأفراد',
      'Practice the People-domain deltas only.',
      'التدريب على تغيرات مجال الأفراد فقط.',
      35, 10, ['bridge', 'people', 'practice']),
  ],
};

const B4: Module = {
  id: `${TRACK_ID}-B4`,
  code: 'B4',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  ecoWeightPct: 41,
  title: { en: 'Process domain delta (50% → 41%)', ar: 'تغيرات مجال العملية (50% → 41%)' },
  description: {
    en: 'Process lost 9 weight points but absorbed value-delivery and methodology-tailoring depth. Some tasks rephrased, several enablers added.',
    ar: 'فقدت العملية 9 نقاط وزن لكنها استوعبت عمق تقديم القيمة وتكييف المنهجية. إعادة صياغة لبعض المهام وإضافة عدة ممكّنات.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B3`,
  lessons: [
    L('B4.L1', 'What stayed identical in Process', 'ما بقي على حاله في العملية',
      'Confirm tasks unchanged.',
      'تأكيد المهام التي لم تتغيّر.',
      35, 7, ['bridge', 'process']),
    L('B4.L2', 'Method/methodology tailoring — the new depth', 'تكييف الأسلوب/المنهجية — العمق الجديد',
      'Study the expanded tailoring framework.',
      'دراسة إطار التكييف الموسّع.',
      35, 8, ['bridge', 'process', 'tailoring']),
    L('B4.L3', 'Value-delivery integration into Process tasks', 'إدماج تقديم القيمة في مهام العملية',
      'See how value language now permeates Process.',
      'رؤية كيف تتغلغل لغة القيمة الآن في مجال العملية.',
      35, 8, ['bridge', 'process', 'value']),
    L('B4.L4', 'Process delta drill', 'تدريب على تغيرات العملية',
      'Practice the Process-domain deltas only.',
      'التدريب على تغيرات مجال العملية فقط.',
      35, 10, ['bridge', 'process', 'practice']),
  ],
};

const B5: Module = {
  id: `${TRACK_ID}-B5`,
  code: 'B5',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  ecoWeightPct: 26,
  title: { en: 'Business Environment delta (8% → 26%) — the biggest jump', ar: 'تغيرات بيئة الأعمال (8% → 26%) — أكبر قفزة' },
  description: {
    en: 'Three-fold expansion. The single highest-impact change in ECO 2026. Strategic alignment, compliance, organizational change, and continuous improvement now carry roughly the same weight as the People domain.',
    ar: 'توسّع ثلاثي. التغيير الأعلى أثراً في ECO 2026. المواءمة الاستراتيجية والامتثال والتغيير التنظيمي والتحسين المستمر تحمل الآن وزناً قريباً من مجال الأفراد.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B4`,
  lessons: [
    L('B5.L1', 'Why BE tripled in weight', 'لماذا تضاعف وزن بيئة الأعمال ثلاثاً',
      'Understand the editorial reasoning.',
      'فهم المنطق التحريري.',
      35, 7, ['bridge', 'be']),
    L('B5.L2', 'Strategic alignment — the new BE task', 'المواءمة الاستراتيجية — المهمة الجديدة',
      'Study the strategic-alignment task in depth — it is new to BE.',
      'دراسة مهمة المواءمة الاستراتيجية بعمق — وهي جديدة على بيئة الأعمال.',
      35, 8, ['bridge', 'be', 'strategy']),
    L('B5.L3', 'Continuous process improvement — newly elevated', 'التحسين المستمر للعمليات — تم رفعه حديثاً',
      'See how CPI moves from background to foreground in PMBOK 8.',
      'رؤية كيف ينتقل التحسين المستمر من الخلفية إلى المقدمة في PMBOK 8.',
      35, 8, ['bridge', 'be']),
    L('B5.L4', 'BE delta drill — heavy practice', 'تدريب مكثّف على تغيرات بيئة الأعمال',
      'Heavy practice on the highest-shift domain.',
      'تدريب مكثّف على المجال الأكثر تحوّلاً.',
      35, 12, ['bridge', 'be', 'practice']),
  ],
};

const B6: Module = {
  id: `${TRACK_ID}-B6`,
  code: 'B6',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  title: { en: 'The six PMBOK 8 principles in depth', ar: 'المبادئ الستة لـ PMBOK 8 بعمق' },
  description: {
    en: 'Move beyond the mapping into the framing language used in PMBOK 8 — exam questions test the new wording.',
    ar: 'تجاوز التطابق إلى لغة الإطار المستخدمة في PMBOK 8 — تختبر أسئلة الامتحان الصياغة الجديدة.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B5`,
  lessons: [
    L('B6.L1', 'Stewardship & team consolidated', 'الإشراف والفريق مُدمَجين',
      'Master the consolidated framing of stewardship and team.',
      'إتقان الصياغة المُدمَجة للإشراف والفريق.',
      35, 8, ['bridge', 'principles']),
    L('B6.L2', 'Stakeholders, value, systems thinking', 'أصحاب المصلحة والقيمة والتفكير المنظومي',
      'See how the three are now framed as one decision lens.',
      'رؤية كيف تُؤطَّر الثلاثة الآن كعدسة قرار واحدة.',
      35, 8, ['bridge', 'principles']),
    L('B6.L3', 'Leadership — the unified principle', 'القيادة — المبدأ الموحَّد',
      'Study the unified leadership principle absorbing tailoring, quality, complexity, risk, adaptability, change.',
      'دراسة مبدأ القيادة الموحَّد الذي يستوعب التكييف والجودة والتعقيد والمخاطر والقدرة على التكيف والتغيير.',
      35, 9, ['bridge', 'principles', 'leadership']),
    L('B6.L4', 'Principles application drill', 'تدريب تطبيقي على المبادئ',
      'Apply all six principles to scenarios.',
      'تطبيق المبادئ الستة جميعها على سيناريوهات.',
      35, 12, ['bridge', 'principles', 'practice']),
  ],
};

// ============================================================
// PHASE 3 — INTEGRATE THE SHIFT (2 modules · 6 lessons · ~5h)
// ============================================================

const B7: Module = {
  id: `${TRACK_ID}-B7`,
  code: 'B7',
  phaseId: 'integration',
  trackId: TRACK_ID,
  title: { en: 'Performance domains 8 → 7', ar: 'مجالات الأداء 8 → 7' },
  description: {
    en: 'PMBOK 7\'s eight performance domains consolidate into seven in PMBOK 8 — see what merged, what got renamed, and what stayed.',
    ar: 'تنطوي مجالات الأداء الثمانية في PMBOK 7 في سبعة في PMBOK 8 — اعرف ما الذي اندمج وما الذي أُعيدت تسميته وما الذي بقي.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B6`,
  lessons: [
    L('B7.L1', 'The domain mapping table', 'جدول تطابق المجالات',
      'Memorize the 8-to-7 mapping.',
      'حفظ تطابق المجالات من 8 إلى 7.',
      45, 8, ['bridge', 'domains']),
    L('B7.L2', 'Stakeholders and team — slightly reframed', 'أصحاب المصلحة والفريق — إعادة تأطير طفيف',
      'Study the language change.',
      'دراسة تغيّر الصياغة.',
      45, 8, ['bridge', 'domains']),
    L('B7.L3', 'Domain integration scenarios', 'سيناريوهات تكامل المجالات',
      'Practice scenarios that span multiple domains in the new framing.',
      'التدرّب على سيناريوهات تشمل مجالات متعددة في الصياغة الجديدة.',
      45, 10, ['bridge', 'domains', 'practice']),
  ],
};

const B8: Module = {
  id: `${TRACK_ID}-B8`,
  code: 'B8',
  phaseId: 'integration',
  trackId: TRACK_ID,
  title: { en: 'The 5 focus areas — entirely new in PMBOK 8', ar: 'مجالات التركيز الخمسة — جديدة كليّاً في PMBOK 8' },
  description: {
    en: 'Strategic value · Team performance · Customer & stakeholder engagement · Adaptive delivery · Organizational change. This concept did not exist in PMBOK 7 — entirely new study area.',
    ar: 'القيمة الاستراتيجية · أداء الفريق · إشراك العميل وأصحاب المصلحة · التقديم التكيفي · التغيير التنظيمي. لم يكن هذا المفهوم موجوداً في PMBOK 7 — منطقة دراسة جديدة بالكامل.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B7`,
  lessons: [
    L('B8.L1', 'What focus areas are and why they exist', 'ما هي مجالات التركيز ولماذا وُجدت',
      'Understand the role of focus areas as the synthesis layer.',
      'فهم دور مجالات التركيز كطبقة التركيب.',
      45, 8, ['bridge', 'focus-areas']),
    L('B8.L2', 'Walking through the 5 focus areas', 'استعراض مجالات التركيز الخمسة',
      'Cover all five in depth with examples.',
      'تغطية الخمسة جميعها بعمق مع أمثلة.',
      45, 9, ['bridge', 'focus-areas']),
    L('B8.L3', 'Focus areas in exam questions — what to look for', 'مجالات التركيز في أسئلة الامتحان — ما الذي تبحث عنه',
      'Spot focus-area cues in scenario wording.',
      'التقاط إشارات مجالات التركيز في صياغة السيناريو.',
      45, 10, ['bridge', 'focus-areas', 'exam']),
  ],
};

// ============================================================
// PHASE 4 — BRIDGE SIMULATION (2 modules · 2 lessons · ~4h)
// ============================================================

const B9: Module = {
  id: `${TRACK_ID}-B9`,
  code: 'B9',
  phaseId: 'simulation',
  trackId: TRACK_ID,
  questionCount: 60,
  title: { en: '60-question targeted bridge mock', ar: 'امتحان جسري موجّه من 60 سؤال' },
  description: {
    en: 'Every question targets a delta area — new content, changed content, or reweighted content. Time: 80 minutes. Target: 75%.',
    ar: 'كل سؤال يستهدف منطقة تغيّر — محتوى جديد أو معدَّل أو معاد ترجيحه. الوقت: 80 دقيقة. الهدف: 75%.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B8`,
  lessons: [
    L('B9.L1', 'Take the 60Q bridge mock', 'أداء امتحان الجسر من 60 سؤال',
      'Complete 60 delta-targeted questions in 80 minutes.',
      'إكمال 60 سؤالاً موجّهاً نحو التغيرات في 80 دقيقة.',
      90, 60, ['bridge', 'simulation']),
  ],
};

const B10: Module = {
  id: `${TRACK_ID}-B10`,
  code: 'B10',
  phaseId: 'simulation',
  trackId: TRACK_ID,
  questionCount: 120,
  title: { en: '120-question bridge readiness check', ar: 'فحص جاهزية الجسر من 120 سؤال' },
  description: {
    en: 'Full ECO 2026 weighting applied to delta-only questions plus a 25% mix of unchanged content as control. Time: 150 minutes. Target: 78%. Pass and you are bridge-ready.',
    ar: 'تطبيق الوزن الكامل لـ ECO 2026 على أسئلة التغيرات فقط مع مزيج 25% من المحتوى غير المتغير للتحكّم. الوقت: 150 دقيقة. الهدف: 78%. اجتيازه يعني أنك جاهز جسرياً.',
  },
  prerequisiteModuleId: `${TRACK_ID}-B9`,
  lessons: [
    L('B10.L1', 'Take the 120Q bridge readiness check', 'أداء فحص الجاهزية من 120 سؤال',
      'Complete 120 questions in 150 minutes with one break.',
      'إكمال 120 سؤالاً في 150 دقيقة مع استراحة واحدة.',
      170, 120, ['bridge', 'simulation', 'readiness']),
  ],
};

// ============================================================
// Track assembly
// ============================================================

const PHASES: Phase[] = [
  {
    id: 'foundation', number: 1,
    title: { en: 'Orient', ar: 'التهيئة' },
    promise: { en: 'See what changed', ar: 'رؤية ما الذي تغيّر' },
    modules: [B1, B2],
  },
  {
    id: 'mastery', number: 2,
    title: { en: 'Master the deltas', ar: 'إتقان التغيرات' },
    promise: { en: 'Internalize every changed area', ar: 'استيعاب كل منطقة تغيّرت' },
    modules: [B3, B4, B5, B6],
  },
  {
    id: 'integration', number: 3,
    title: { en: 'Integrate the shift', ar: 'دمج التحوّل' },
    promise: { en: 'Retrain your mental models', ar: 'إعادة تدريب نماذجك الذهنية' },
    modules: [B7, B8],
  },
  {
    id: 'simulation', number: 4,
    title: { en: 'Bridge simulation', ar: 'محاكاة الجسر' },
    promise: { en: 'Prove bridge readiness', ar: 'إثبات الجاهزية الجسرية' },
    modules: [B9, B10],
  },
];

const TOTAL_LESSONS = PHASES.reduce((sum, p) => sum + p.modules.reduce((s, m) => s + m.lessons.length, 0), 0);
const TOTAL_MINUTES = PHASES.reduce((sum, p) => sum + p.modules.reduce((s, m) => s + m.lessons.reduce((ls, l) => ls + l.estimatedMinutes, 0), 0), 0);

export const BRIDGE_TRACK: Track = {
  meta: {
    id: TRACK_ID,
    shortName: { en: 'Bridge 7 → 8', ar: 'الجسر 7 → 8' },
    fullName: { en: 'Bridge 7 → 8 — transition path', ar: 'الجسر 7 → 8 — مسار التحوّل' },
    description: {
      en: 'For candidates already prepared on PMBOK 7 who only need to learn the deltas to move to the 2026 exam.',
      ar: 'للمرشحين المُحضَّرين أصلاً على PMBOK 7 والذين يحتاجون فقط لتعلّم التغيرات للانتقال إلى امتحان 2026.',
    },
    badgeLabel: { en: 'Bridge', ar: 'جسر' },
    icon: 'transfer',
    estimatedHours: Math.round(TOTAL_MINUTES / 60),
    moduleCount: PHASES.reduce((s, p) => s + p.modules.length, 0),
    lessonCount: TOTAL_LESSONS,
    ecoWeights: { people: 33, process: 41, businessEnvironment: 26 },
    available: true,
  },
  phases: PHASES,
};
