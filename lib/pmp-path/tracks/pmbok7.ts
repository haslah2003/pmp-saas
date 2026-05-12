/**
 * lib/pmp-path/tracks/pmbok7.ts
 * Track: PMBOK 7 + ECO 2021 (the classic exam · for candidates sitting before the July 2026 update)
 * Strict framework: 4 phases · 14 modules · 7-step learning loop · single CTA.
 * ECO 2021 weights: People 42% · Process 50% · Business Environment 8%.
 */

import type { Lesson, Module, Phase, Track } from '../types';

const TRACK_ID = 'pmbok7-eco2021' as const;

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
// PHASE 1 — FOUNDATION (4 modules · 22 lessons · ~10h)
// ============================================================

const F1: Module = {
  id: `${TRACK_ID}-F1`,
  code: 'F1',
  phaseId: 'foundation',
  trackId: TRACK_ID,
  title: { en: 'Adopt the PMP mindset', ar: 'تبنّي عقلية محترف إدارة المشاريع' },
  description: {
    en: 'Think like a project leader — the PMI value system grounded in PMBOK 7 and the ECO 2021 examination outline.',
    ar: 'فكّر كقائد مشروع — منظومة قيم PMI استناداً إلى PMBOK 7 ومخطط امتحان ECO 2021.',
  },
  prerequisiteModuleId: null,
  lessons: [
    L('F1.L1', 'What the PMP mindset is', 'ماهية عقلية محترف إدارة المشاريع', 'Define the PMP mindset and how it differs from operational thinking.', 'تعريف عقلية محترف إدارة المشاريع وكيف تختلف عن التفكير التشغيلي.', 25, 5, ['mindset']),
    L('F1.L2', 'PMI Code of Ethics & Professional Responsibility', 'ميثاق الأخلاقيات والمسؤولية المهنية', 'Apply the four values: responsibility, respect, fairness, honesty.', 'تطبيق القيم الأربع: المسؤولية، الاحترام، الإنصاف، والصدق.', 25, 6, ['ethics']),
    L('F1.L3', 'Servant leadership in practice', 'القيادة الخادمة في التطبيق', 'Recognize servant-leader behaviors and when to apply them.', 'التعرّف على سلوكيات القائد الخادم ومتى يتم تطبيقها.', 25, 6, ['leadership']),
    L('F1.L4', 'Tailoring over prescription (PMBOK 7 view)', 'التكييف بدلاً من الوصف (منظور PMBOK 7)', 'Choose the right approach for each project context.', 'اختيار النهج الملائم لكل سياق مشروع.', 25, 6, ['tailoring']),
    L('F1.L5', 'Stakeholder-first thinking', 'التفكير من منظور أصحاب المصلحة', 'Always start from stakeholder needs.', 'ابدأ دائمًا من احتياجات أصحاب المصلحة.', 25, 6, ['stakeholders']),
    L('F1.L6', 'Mindset self-check', 'اختبار العقلية الذاتي', 'Diagnose your mental defaults against the PMP standard.', 'تشخيص الإعدادات الذهنية مقارنةً بمعيار PMP.', 25, 7, ['self-check']),
  ],
};

const F2: Module = {
  id: `${TRACK_ID}-F2`,
  code: 'F2',
  phaseId: 'foundation',
  trackId: TRACK_ID,
  title: { en: 'PMBOK 7 — the 12 principles', ar: 'PMBOK 7 — المبادئ الاثنا عشر' },
  description: {
    en: 'Stewardship · team · stakeholders · value · systems thinking · leadership · tailoring · quality · complexity · risk · adaptability · change. The full PMBOK 7 principle set.',
    ar: 'الإشراف · الفريق · أصحاب المصلحة · القيمة · التفكير المنظومي · القيادة · التكييف · الجودة · التعقيد · المخاطر · القدرة على التكيف · التغيير. مجموعة مبادئ PMBOK 7 كاملة.',
  },
  prerequisiteModuleId: `${TRACK_ID}-F1`,
  lessons: [
    L('F2.L1', 'Stewardship and team', 'الإشراف والفريق', 'Be a diligent, respectful, caring steward; foster a collaborative project team.', 'كن مشرفاً مجدّاً ومحترماً وراعياً؛ عزّز فريق مشروع تعاوني.', 25, 7, ['principles']),
    L('F2.L2', 'Stakeholders and value', 'أصحاب المصلحة والقيمة', 'Effectively engage with stakeholders; focus on value.', 'إشراك أصحاب المصلحة بفعالية؛ التركيز على القيمة.', 25, 7, ['principles', 'value']),
    L('F2.L3', 'Systems thinking and leadership', 'التفكير المنظومي والقيادة', 'Recognize, evaluate, and respond to system interactions; demonstrate leadership behaviors.', 'التعرّف على تفاعلات النظام وتقييمها والاستجابة لها؛ إظهار سلوكيات القيادة.', 25, 7, ['principles']),
    L('F2.L4', 'Tailoring and quality', 'التكييف والجودة', 'Tailor based on context; build quality into processes and deliverables.', 'التكييف بناءً على السياق؛ بناء الجودة في العمليات والمخرجات.', 25, 6, ['principles', 'quality']),
    L('F2.L5', 'Complexity and risk', 'التعقيد والمخاطر', 'Navigate complexity; optimize risk responses.', 'التنقل في التعقيد؛ تحسين الاستجابات للمخاطر.', 25, 7, ['principles', 'risk']),
    L('F2.L6', 'Adaptability, resiliency, and change', 'القدرة على التكيف والمرونة والتغيير', 'Embrace adaptability and resiliency; enable change to achieve the envisioned future state.', 'تبنّي القدرة على التكيف والمرونة؛ تمكين التغيير لتحقيق الحالة المستقبلية المنشودة.', 25, 7, ['principles', 'change']),
  ],
};

const F3: Module = {
  id: `${TRACK_ID}-F3`,
  code: 'F3',
  phaseId: 'foundation',
  trackId: TRACK_ID,
  title: { en: 'The value delivery system', ar: 'منظومة تقديم القيمة' },
  description: {
    en: 'How projects, programs, portfolios, and operations create and sustain value end to end.',
    ar: 'كيف تخلق المشاريع والبرامج والمحافظ والعمليات قيمةً مستدامة من البداية إلى النهاية.',
  },
  prerequisiteModuleId: `${TRACK_ID}-F2`,
  lessons: [
    L('F3.L1', 'Projects, programs, portfolios, operations', 'المشاريع والبرامج والمحافظ والعمليات', 'Distinguish each type of work and how they relate.', 'التمييز بين كل نوع من الأعمال وكيف ترتبط ببعضها.', 30, 6, ['vds']),
    L('F3.L2', 'Value streams and outcomes', 'تدفقات القيمة والمخرجات', 'Map outputs to outcomes to value.', 'ربط المخرجات بالنتائج ثم بالقيمة.', 30, 6, ['vds', 'value']),
    L('F3.L3', 'Governance and oversight', 'الحوكمة والإشراف', 'Use governance to align decisions with strategy.', 'استخدام الحوكمة لمواءمة القرارات مع الاستراتيجية.', 30, 6, ['vds', 'governance']),
    L('F3.L4', 'Functions associated with projects', 'الوظائف المرتبطة بالمشاريع', 'Identify the functions that enable project delivery.', 'تحديد الوظائف التي تتيح تنفيذ المشروع.', 30, 6, ['vds']),
    L('F3.L5', 'Project environment & enterprise factors', 'بيئة المشروع وعوامل المؤسسة', 'Recognize EEFs and OPAs that shape execution.', 'التعرّف على العوامل البيئية وأصول العمليات التي تشكّل التنفيذ.', 30, 7, ['vds', 'eef-opa']),
  ],
};

const F4: Module = {
  id: `${TRACK_ID}-F4`,
  code: 'F4',
  phaseId: 'foundation',
  trackId: TRACK_ID,
  title: { en: 'ECO 2021 — exam structure', ar: 'ECO 2021 — هيكل الامتحان' },
  description: {
    en: 'People 42% · Process 50% · Business Environment 8%. Predictive, hybrid, and agile question mix.',
    ar: 'الأفراد 42% · العملية 50% · بيئة الأعمال 8%. مزيج الأسئلة التنبؤية والهجينة والمرنة.',
  },
  prerequisiteModuleId: `${TRACK_ID}-F3`,
  lessons: [
    L('F4.L1', 'The three ECO 2021 domains', 'مجالات ECO 2021 الثلاثة', 'Map every question type to its ECO domain.', 'ربط كل نوع من الأسئلة بمجاله في ECO.', 30, 6, ['eco']),
    L('F4.L2', 'Tasks and enablers', 'المهام والممكّنات', 'Use enablers as answer hints for every task.', 'استخدام الممكّنات كدلالات للإجابة عن كل مهمة.', 30, 6, ['eco']),
    L('F4.L3', 'Predictive vs hybrid vs agile question signals', 'إشارات الأسئلة التنبؤية مقابل الهجينة والمرنة', 'Recognize which approach the question scenario expects.', 'التعرّف على النهج الذي يتوقعه سيناريو السؤال.', 30, 7, ['exam-style']),
    L('F4.L4', 'Situational vs technical question types', 'الأسئلة الموقفية مقابل التقنية', 'Apply the right reasoning pattern for each type.', 'تطبيق نمط التفكير الصحيح لكل نوع.', 30, 7, ['exam-style']),
    L('F4.L5', 'Time strategy on the 180-question exam', 'استراتيجية الوقت في امتحان الـ 180 سؤال', '230 minutes · two breaks · flag-and-move discipline.', '230 دقيقة · استراحتان · انضباط التعليم والمتابعة.', 30, 8, ['exam-strategy']),
  ],
};

// ============================================================
// PHASE 2 — MASTERY (3 modules · 26 lessons · ~14h)
// Note: ECO 2021 weights are People 42%, Process 50%, BE 8%
// ============================================================

const M1: Module = {
  id: `${TRACK_ID}-M1`,
  code: 'M1',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  ecoWeightPct: 42,
  title: { en: 'People — lead and engage the team', ar: 'الأفراد — قيادة الفريق وإشراكه' },
  description: {
    en: '14 ECO People tasks: conflict, leadership, performance, empowerment, training, team-building, impediments, collaboration, mentoring, virtual teams, ground rules, negotiation, emotional intelligence.',
    ar: '14 مهمة من مجال الأفراد: النزاع، القيادة، الأداء، التمكين، التدريب، بناء الفريق، العوائق، التعاون، الإرشاد، الفرق الافتراضية، القواعد الأساسية، التفاوض، الذكاء العاطفي.',
  },
  prerequisiteModuleId: `${TRACK_ID}-F4`,
  lessons: [
    L('M1.L1', 'Manage conflict', 'إدارة النزاع', 'Resolve conflict using appropriate techniques per situation.', 'حل النزاع باستخدام التقنيات الملائمة لكل موقف.', 30, 8, ['people']),
    L('M1.L2', 'Lead a team', 'قيادة الفريق', 'Set vision and align the team toward outcomes.', 'وضع الرؤية ومواءمة الفريق نحو النتائج.', 30, 8, ['people']),
    L('M1.L3', 'Support team performance', 'دعم أداء الفريق', 'Coach and remove blockers to maximize performance.', 'التوجيه وإزالة العوائق لزيادة الأداء.', 30, 7, ['people']),
    L('M1.L4', 'Empower team members & stakeholders', 'تمكين أعضاء الفريق وأصحاب المصلحة', 'Delegate decisions to the right level.', 'تفويض القرارات إلى المستوى الصحيح.', 30, 7, ['people']),
    L('M1.L5', 'Ensure team is adequately trained', 'ضمان تدريب الفريق بشكل كافٍ', 'Identify and close skill gaps.', 'تحديد فجوات المهارات وسدها.', 30, 7, ['people']),
    L('M1.L6', 'Build a team', 'بناء الفريق', 'Assemble high-performing teams with diverse skills.', 'تشكيل فرق عالية الأداء بمهارات متنوعة.', 30, 7, ['people']),
    L('M1.L7', 'Address and remove impediments', 'معالجة العوائق وإزالتها', 'Systematically clear the path for the team.', 'تطهير المسار للفريق بشكل منهجي.', 30, 8, ['people']),
    L('M1.L8', 'Collaborate with stakeholders', 'التعاون مع أصحاب المصلحة', 'Maintain trust through transparency.', 'الحفاظ على الثقة عبر الشفافية.', 30, 8, ['people']),
    L('M1.L9', 'Mentor relevant stakeholders', 'إرشاد أصحاب المصلحة ذوي الصلة', 'Mentor for capability transfer.', 'الإرشاد لنقل القدرات.', 30, 8, ['people']),
  ],
};

const M2: Module = {
  id: `${TRACK_ID}-M2`,
  code: 'M2',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  ecoWeightPct: 50,
  title: { en: 'Process — deliver business value', ar: 'العملية — تقديم القيمة التجارية' },
  description: {
    en: '17 ECO Process tasks: scope, schedule, budget, quality, risk, communications, procurement, integration, methodology, governance, closure.',
    ar: '17 مهمة من مجال العملية: النطاق، الجدول، الميزانية، الجودة، المخاطر، الاتصالات، المشتريات، التكامل، المنهجية، الحوكمة، الإغلاق.',
  },
  prerequisiteModuleId: `${TRACK_ID}-M1`,
  lessons: [
    L('M2.L1', 'Execute project with urgency for business value', 'تنفيذ المشروع بإلحاح للقيمة التجارية', 'Prioritize work that delivers value soonest.', 'إعطاء الأولوية للعمل الذي يقدّم القيمة بأسرع وقت.', 30, 8, ['process']),
    L('M2.L2', 'Manage communications', 'إدارة الاتصالات', 'Use the right channel and cadence per stakeholder.', 'استخدام القناة والوتيرة الصحيحة لكل صاحب مصلحة.', 30, 7, ['process']),
    L('M2.L3', 'Assess and manage risks', 'تقييم المخاطر وإدارتها', 'Identify, analyze, respond, monitor risks.', 'تحديد المخاطر وتحليلها والاستجابة لها ومراقبتها.', 30, 8, ['process', 'risk']),
    L('M2.L4', 'Engage stakeholders', 'إشراك أصحاب المصلحة', 'Map influence and tailor engagement.', 'تحديد التأثير وتكييف الإشراك.', 30, 7, ['process']),
    L('M2.L5', 'Plan and manage budget & resources', 'تخطيط وإدارة الميزانية والموارد', 'Build and protect the budget.', 'بناء الميزانية وحمايتها.', 30, 7, ['process']),
    L('M2.L6', 'Plan and manage schedule', 'تخطيط وإدارة الجدول الزمني', 'Build realistic schedules.', 'بناء جداول زمنية واقعية.', 30, 7, ['process']),
    L('M2.L7', 'Plan and manage quality', 'تخطيط وإدارة الجودة', 'Define and enforce quality standards.', 'تحديد معايير الجودة وفرضها.', 30, 7, ['process']),
    L('M2.L8', 'Plan and manage scope', 'تخطيط وإدارة النطاق', 'Define, validate, control scope.', 'تعريف النطاق والتحقق منه والتحكم به.', 30, 8, ['process']),
    L('M2.L9', 'Integrate project planning activities', 'تكامل أنشطة تخطيط المشروع', 'Make all components work as one.', 'جعل جميع المكونات تعمل ككل واحد.', 30, 8, ['process']),
    L('M2.L10', 'Manage project changes', 'إدارة تغييرات المشروع', 'Control changes through change control.', 'التحكم في التغييرات عبر ضوابط التغيير.', 30, 7, ['process']),
    L('M2.L11', 'Plan and manage procurement', 'تخطيط وإدارة المشتريات', 'Plan, execute, and close procurement.', 'تخطيط المشتريات وتنفيذها وإغلاقها.', 30, 7, ['process', 'procurement']),
  ],
};

const M3: Module = {
  id: `${TRACK_ID}-M3`,
  code: 'M3',
  phaseId: 'mastery',
  trackId: TRACK_ID,
  ecoWeightPct: 8,
  title: { en: 'Business environment (8%) — strategic alignment', ar: 'بيئة الأعمال (8%) — المواءمة الاستراتيجية' },
  description: {
    en: '4 ECO Business Environment tasks: compliance, value delivery, change response, organizational change support.',
    ar: '4 مهام من مجال بيئة الأعمال: الامتثال، تقديم القيمة، الاستجابة للتغير، دعم التغيير التنظيمي.',
  },
  prerequisiteModuleId: `${TRACK_ID}-M2`,
  lessons: [
    L('M3.L1', 'Plan and manage project compliance', 'تخطيط وإدارة امتثال المشروع', 'Embed regulatory and contractual compliance.', 'دمج الامتثال التنظيمي والتعاقدي.', 30, 8, ['be']),
    L('M3.L2', 'Evaluate and deliver project benefits and value', 'تقييم وتقديم منافع المشروع وقيمته', 'Tie deliverables to measurable benefits.', 'ربط المخرجات بمنافع قابلة للقياس.', 30, 8, ['be']),
    L('M3.L3', 'Evaluate and address external business environment changes', 'تقييم ومعالجة تغيرات بيئة الأعمال الخارجية', 'Adapt to market and regulatory shifts.', 'التكيف مع تحولات السوق والتنظيم.', 30, 7, ['be']),
    L('M3.L4', 'Support organizational change', 'دعم التغيير التنظيمي', 'Drive adoption of project outputs.', 'قيادة تبني مخرجات المشروع.', 30, 7, ['be']),
    L('M3.L5', 'Employ continuous process improvement', 'توظيف التحسين المستمر للعمليات', 'Bake learning into every iteration.', 'دمج التعلّم في كل دورة.', 30, 7, ['be']),
    L('M3.L6', 'Strategic alignment of the project', 'المواءمة الاستراتيجية للمشروع', 'Anchor every decision to strategy.', 'ربط كل قرار بالاستراتيجية.', 30, 8, ['be']),
  ],
};

// ============================================================
// PHASE 3 — INTEGRATION (3 modules · 25 lessons · ~16h)
// ============================================================

const I1: Module = {
  id: `${TRACK_ID}-I1`,
  code: 'I1',
  phaseId: 'integration',
  trackId: TRACK_ID,
  title: { en: 'The 8 performance domains (PMBOK 7)', ar: 'مجالات الأداء الثمانية (PMBOK 7)' },
  description: {
    en: 'Stakeholders · Team · Development approach & life cycle · Planning · Project work · Delivery · Measurement · Uncertainty.',
    ar: 'أصحاب المصلحة · الفريق · نهج التطوير ودورة الحياة · التخطيط · عمل المشروع · التقديم · القياس · عدم اليقين.',
  },
  prerequisiteModuleId: `${TRACK_ID}-M3`,
  lessons: [
    L('I1.L1', 'Stakeholder performance domain', 'مجال أداء أصحاب المصلحة', 'Drive productive working relationships throughout.', 'تعزيز علاقات عمل منتجة طوال المشروع.', 35, 7, ['domains']),
    L('I1.L2', 'Team performance domain', 'مجال أداء الفريق', 'Build a culture of trust, ownership, and growth.', 'بناء ثقافة الثقة والملكية والنمو.', 35, 7, ['domains']),
    L('I1.L3', 'Development approach & life cycle', 'نهج التطوير ودورة الحياة', 'Match cadence and approach to project context.', 'مواءمة الوتيرة والنهج مع سياق المشروع.', 35, 7, ['domains']),
    L('I1.L4', 'Planning performance domain', 'مجال أداء التخطيط', 'Plan progressively to stay relevant.', 'التخطيط التدريجي للحفاظ على الملاءمة.', 35, 7, ['domains']),
    L('I1.L5', 'Project work performance domain', 'مجال أداء عمل المشروع', 'Establish efficient processes and learning systems.', 'إنشاء عمليات فعّالة وأنظمة تعلّم.', 35, 7, ['domains']),
    L('I1.L6', 'Delivery performance domain', 'مجال أداء التقديم', 'Validate value and meet acceptance criteria.', 'التحقق من القيمة وتلبية معايير القبول.', 35, 7, ['domains']),
    L('I1.L7', 'Measurement performance domain', 'مجال أداء القياس', 'Measure what matters; act on signals.', 'قياس ما يهم؛ التصرف بناءً على الإشارات.', 35, 8, ['domains']),
    L('I1.L8', 'Uncertainty performance domain', 'مجال أداء عدم اليقين', 'Manage ambiguity, complexity, and risk together.', 'إدارة الغموض والتعقيد والمخاطر معًا.', 35, 8, ['domains']),
  ],
};

const I2: Module = {
  id: `${TRACK_ID}-I2`,
  code: 'I2',
  phaseId: 'integration',
  trackId: TRACK_ID,
  title: { en: 'Tailoring and project life cycles', ar: 'التكييف ودورات حياة المشروع' },
  description: {
    en: 'Choose between predictive, hybrid, and adaptive life cycles; tailor processes, deliverables, and engagements per context.',
    ar: 'الاختيار بين دورات الحياة التنبؤية والهجينة والتكيفية؛ تكييف العمليات والمخرجات والمشاركات حسب السياق.',
  },
  prerequisiteModuleId: `${TRACK_ID}-I1`,
  lessons: [
    L('I2.L1', 'Predictive life cycle deep-dive', 'تعمّق في دورة الحياة التنبؤية', 'Recognize when waterfall is the right call.', 'التعرّف على متى يكون النهج التنبؤي الخيار الصحيح.', 35, 7, ['life-cycle']),
    L('I2.L2', 'Adaptive life cycle (Agile/iterative)', 'دورة الحياة التكيفية (المرنة/التكرارية)', 'Run iterative and incremental delivery effectively.', 'إدارة التقديم التكراري والتدريجي بفعالية.', 35, 7, ['life-cycle']),
    L('I2.L3', 'Hybrid models', 'النماذج الهجينة', 'Combine approaches without breaking governance.', 'دمج النهجين دون كسر الحوكمة.', 35, 7, ['life-cycle']),
    L('I2.L4', 'Tailoring guidelines', 'إرشادات التكييف', 'Tailor by project, team, and organizational factors.', 'التكييف حسب عوامل المشروع والفريق والمؤسسة.', 35, 7, ['tailoring']),
    L('I2.L5', 'Cadence selection', 'اختيار الوتيرة', 'Pick the right delivery cadence for the value flow.', 'اختيار وتيرة التقديم المناسبة لتدفق القيمة.', 35, 7, ['life-cycle']),
    L('I2.L6', 'Stage gates & governance fit', 'بوابات المراحل وملاءمة الحوكمة', 'Insert review points without slowing delivery.', 'إدراج نقاط المراجعة دون إبطاء التقديم.', 35, 7, ['life-cycle']),
  ],
};

const I3: Module = {
  id: `${TRACK_ID}-I3`,
  code: 'I3',
  phaseId: 'integration',
  trackId: TRACK_ID,
  title: { en: 'Models, methods, and artifacts', ar: 'النماذج والأساليب والمصنوعات' },
  description: {
    en: 'Choose the right model (e.g. Tuckman, OCM), method (e.g. EVM, MoSCoW), and artifact (e.g. risk register, burndown) for each scenario.',
    ar: 'اختيار النموذج المناسب (مثل توكمان، OCM)، والأسلوب (مثل EVM، MoSCoW)، والمصنوع (مثل سجل المخاطر، مخطط الإنجاز) لكل سيناريو.',
  },
  prerequisiteModuleId: `${TRACK_ID}-I2`,
  lessons: [
    L('I3.L1', 'Leadership & motivation models', 'نماذج القيادة والتحفيز', 'Apply Tuckman, situational leadership, and motivation models.', 'تطبيق توكمان والقيادة الموقفية ونماذج التحفيز.', 35, 7, ['models']),
    L('I3.L2', 'Communication & negotiation models', 'نماذج الاتصال والتفاوض', 'Apply Mehrabian, ladder of inference, push/pull.', 'تطبيق ميهرابيان وسلم الاستنتاج والدفع/الجذب.', 35, 7, ['models']),
    L('I3.L3', 'Estimation methods', 'أساليب التقدير', 'Use story points, planning poker, three-point estimation.', 'استخدام نقاط القصص وبوكر التخطيط والتقدير ثلاثي النقاط.', 35, 7, ['methods']),
    L('I3.L4', 'Earned value management essentials', 'أساسيات إدارة القيمة المكتسبة', 'Read SPI, CPI, EAC, ETC quickly.', 'قراءة SPI و CPI و EAC و ETC بسرعة.', 35, 8, ['methods', 'evm']),
    L('I3.L5', 'Risk methods & techniques', 'أساليب وتقنيات المخاطر', 'Apply Monte Carlo, decision trees, risk register patterns.', 'تطبيق مونت كارلو وأشجار القرار وأنماط سجل المخاطر.', 35, 8, ['methods', 'risk']),
    L('I3.L6', 'Artifacts — register, log, plan, baseline', 'المصنوعات — السجل، اللوج، الخطة، خط الأساس', 'Distinguish artifact families.', 'التمييز بين عائلات المصنوعات.', 35, 7, ['artifacts']),
    L('I3.L7', 'Putting it all together', 'تجميع كل شيء', 'Walk a full scenario applying everything.', 'استعراض سيناريو كامل بتطبيق كل شيء.', 35, 8, ['integration']),
  ],
};

// ============================================================
// PHASE 4 — SIMULATION (4 modules · 4 lessons · ~10h)
// ============================================================

const S1: Module = {
  id: `${TRACK_ID}-S1`, code: 'S1', phaseId: 'simulation', trackId: TRACK_ID, questionCount: 30,
  title: { en: '30-question warm-up', ar: 'تمرين 30 سؤال' },
  description: {
    en: 'Short calibration mock. Mixed domains. Time limit: 40 minutes. Target: 70%.',
    ar: 'امتحان تجريبي قصير لمعايرة الجاهزية. مجالات متنوعة. الوقت: 40 دقيقة. الهدف: 70%.',
  },
  prerequisiteModuleId: `${TRACK_ID}-I3`,
  lessons: [L('S1.L1', 'Take the 30Q warm-up', 'أداء امتحان الـ 30 سؤال التحضيري', 'Complete 30 mixed questions in 40 minutes.', 'إكمال 30 سؤالاً متنوعاً في 40 دقيقة.', 45, 30, ['simulation'])],
};

const S2: Module = {
  id: `${TRACK_ID}-S2`, code: 'S2', phaseId: 'simulation', trackId: TRACK_ID, questionCount: 60,
  title: { en: '60-question targeted', ar: 'امتحان 60 سؤال موجّه' },
  description: {
    en: 'Targets your weakest domain from the warm-up. Time limit: 80 minutes. Target: 72%.',
    ar: 'يستهدف أضعف مجال لديك. الوقت: 80 دقيقة. الهدف: 72%.',
  },
  prerequisiteModuleId: `${TRACK_ID}-S1`,
  lessons: [L('S2.L1', 'Take the 60Q targeted mock', 'أداء امتحان الـ 60 سؤال الموجّه', 'Complete 60 weighted questions in 80 minutes.', 'إكمال 60 سؤالاً موزوناً في 80 دقيقة.', 90, 60, ['simulation'])],
};

const S3: Module = {
  id: `${TRACK_ID}-S3`, code: 'S3', phaseId: 'simulation', trackId: TRACK_ID, questionCount: 120,
  title: { en: '120-question half-exam', ar: 'نصف امتحان من 120 سؤال' },
  description: {
    en: 'Full ECO weighting. Time limit: 150 minutes. Target: 75%. Includes one 10-minute break.',
    ar: 'الوزن الكامل لـ ECO. الوقت: 150 دقيقة. الهدف: 75%. مع استراحة 10 دقائق.',
  },
  prerequisiteModuleId: `${TRACK_ID}-S2`,
  lessons: [L('S3.L1', 'Take the 120Q half-exam', 'أداء نصف الامتحان من 120 سؤال', 'Complete 120 questions in 150 minutes with one break.', 'إكمال 120 سؤالاً في 150 دقيقة مع استراحة واحدة.', 170, 120, ['simulation'])],
};

const S4: Module = {
  id: `${TRACK_ID}-S4`, code: 'S4', phaseId: 'simulation', trackId: TRACK_ID, questionCount: 180,
  title: { en: '180-question full mock exam', ar: 'الامتحان الكامل من 180 سؤال' },
  description: {
    en: 'Full PMP exam simulation. Time limit: 230 minutes. Two breaks. Target: 78% before scheduling the real exam.',
    ar: 'محاكاة كاملة لامتحان PMP. الوقت: 230 دقيقة. استراحتان. الهدف: 78% قبل جدولة الامتحان الفعلي.',
  },
  prerequisiteModuleId: `${TRACK_ID}-S3`,
  lessons: [L('S4.L1', 'Take the full 180Q mock', 'أداء الامتحان الكامل من 180 سؤال', 'Complete 180 questions in 230 minutes with two breaks.', 'إكمال 180 سؤالاً في 230 دقيقة مع استراحتين.', 250, 180, ['simulation'])],
};

const PHASES: Phase[] = [
  {
    id: 'foundation', number: 1,
    title: { en: 'Foundation', ar: 'الأساس' },
    promise: { en: 'Build the PMP mindset', ar: 'بناء عقلية محترف إدارة المشاريع' },
    modules: [F1, F2, F3, F4],
  },
  {
    id: 'mastery', number: 2,
    title: { en: 'Mastery', ar: 'الإتقان' },
    promise: { en: 'Master the three ECO domains', ar: 'إتقان مجالات ECO الثلاثة' },
    modules: [M1, M2, M3],
  },
  {
    id: 'integration', number: 3,
    title: { en: 'Integration', ar: 'التكامل' },
    promise: { en: 'Connect domains, life cycles, and the toolkit', ar: 'ربط المجالات ودورات الحياة والأدوات' },
    modules: [I1, I2, I3],
  },
  {
    id: 'simulation', number: 4,
    title: { en: 'Simulation', ar: 'المحاكاة' },
    promise: { en: 'Exam-ready under timed conditions', ar: 'جاهز للامتحان تحت ظروف زمنية' },
    modules: [S1, S2, S3, S4],
  },
];

const TOTAL_LESSONS = PHASES.reduce((sum, p) => sum + p.modules.reduce((s, m) => s + m.lessons.length, 0), 0);
const TOTAL_MINUTES = PHASES.reduce((sum, p) => sum + p.modules.reduce((s, m) => s + m.lessons.reduce((ls, l) => ls + l.estimatedMinutes, 0), 0), 0);

export const PMBOK7_TRACK: Track = {
  meta: {
    id: TRACK_ID,
    shortName: { en: 'PMBOK 7 + ECO 2021', ar: 'PMBOK 7 + ECO 2021' },
    fullName: { en: 'PMBOK 7 + ECO 2021 — the classic exam', ar: 'PMBOK 7 + ECO 2021 — الامتحان الكلاسيكي' },
    description: {
      en: 'For candidates sitting the PMP exam before the July 2026 update — full prep on the 7th edition.',
      ar: 'للمرشحين الذين سيؤدون امتحان PMP قبل تحديث يوليو 2026 — تحضير كامل على الإصدار السابع.',
    },
    badgeLabel: { en: 'Classic', ar: 'الكلاسيكي' },
    icon: 'book',
    estimatedHours: Math.round(TOTAL_MINUTES / 60),
    moduleCount: PHASES.reduce((s, p) => s + p.modules.length, 0),
    lessonCount: TOTAL_LESSONS,
    ecoWeights: { people: 42, process: 50, businessEnvironment: 8 },
    available: true,
  },
  phases: PHASES,
};
