// Seed hand-authored bilingual questions for the new + thin ECO 2026 formats:
// matching (drag-and-drop), ordering (sequencing), plus top-up multiple_response & pull_down.
// No API used. Run: node scripts/seed-interactive-formats.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = {};
for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); }
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const base = { framework: 'pmbok8', is_active: true, correct_answer: 'a', option_a: '—', option_b: '—', option_c: '—', option_d: '—', pmbok_reference: 'PMBOK 8', eco_reference: 'ECO 2026' };

const rows = [
  // ── MATCHING 1 ── domains
  {
    ...base, domain: 'process', subdomain: 'ECO domains', difficulty: 'paced', question_type: 'matching',
    question_text: 'Drag each project activity into the ECO 2026 exam domain it primarily belongs to.',
    question_text_ar: 'اسحب كل نشاط من أنشطة المشروع إلى مجال اختبار ECO 2026 الذي ينتمي إليه بشكل أساسي.',
    explanation: 'People covers leading and developing the team (conflict resolution, coaching). Process covers the technical work of managing the project (scheduling). Business Environment covers compliance and organizational/strategy alignment.',
    explanation_ar: 'يغطي مجال «الأفراد» قيادة الفريق وتطويره (حل النزاعات، الإرشاد). ويغطي «العمليات» العمل الفني لإدارة المشروع (الجدولة). ويغطي «بيئة الأعمال» الامتثال والمواءمة مع استراتيجية المنظمة.',
    rita_tip: 'On the exam, sort each scenario by what it is really testing: leading people, running the process, or the business/organizational context.',
    rita_tip_ar: 'في الاختبار، صنّف كل سيناريو حسب ما يختبره فعليًا: قيادة الأفراد، أم إدارة العملية، أم سياق الأعمال والمنظمة.',
    answer_data: { items: [
      { id: 'i1', text: 'Resolving a conflict between two team members' },
      { id: 'i2', text: 'Sequencing activities to build the schedule' },
      { id: 'i3', text: 'Assessing new regulatory compliance requirements' },
      { id: 'i4', text: 'Coaching a team member on servant leadership' },
    ], categories: [ { id: 'people', label: 'People' }, { id: 'process', label: 'Process' }, { id: 'be', label: 'Business Environment' } ],
      correct: { i1: 'people', i2: 'process', i3: 'be', i4: 'people' } },
    answer_data_ar: { items: [
      { id: 'i1', text: 'حل نزاع بين عضوين في الفريق' },
      { id: 'i2', text: 'تسلسل الأنشطة لبناء الجدول الزمني' },
      { id: 'i3', text: 'تقييم متطلبات امتثال تنظيمية جديدة' },
      { id: 'i4', text: 'إرشاد عضو في الفريق على القيادة الخادمة' },
    ], categories: [ { id: 'people', label: 'الأفراد' }, { id: 'process', label: 'العمليات' }, { id: 'be', label: 'بيئة الأعمال' } ],
      correct: { i1: 'people', i2: 'process', i3: 'be', i4: 'people' } },
  },
  // ── MATCHING 2 ── risk responses
  {
    ...base, domain: 'process', subdomain: 'Risk', difficulty: 'difficult', question_type: 'matching',
    question_text: 'Match each description to the correct negative-risk (threat) response strategy.',
    question_text_ar: 'طابق كل وصف مع استراتيجية الاستجابة الصحيحة للمخاطر السلبية (التهديدات).',
    explanation: 'Avoid eliminates the threat/cause; Transfer shifts impact to a third party (e.g., insurance); Mitigate reduces probability or impact; Accept takes no proactive action.',
    explanation_ar: 'التفادي يزيل التهديد أو سببه؛ والتحويل ينقل الأثر إلى طرف ثالث (كالتأمين)؛ والتخفيف يقلل الاحتمالية أو الأثر؛ والقبول لا يتخذ إجراءً استباقيًا.',
    rita_tip: 'Watch the verb: "eliminate" = Avoid, "insurance/outsource" = Transfer, "reduce" = Mitigate, "contingency only" = Accept.',
    rita_tip_ar: 'انتبه للفعل: «إزالة» = تفادٍ، «تأمين/إسناد خارجي» = تحويل، «تقليل» = تخفيف، «احتياطي فقط» = قبول.',
    answer_data: { items: [
      { id: 'r1', text: 'Eliminate the threat by removing its root cause' },
      { id: 'r2', text: 'Shift the financial impact to an insurer' },
      { id: 'r3', text: 'Add testing to reduce the defect probability' },
      { id: 'r4', text: 'Take no action, but set aside a contingency reserve' },
    ], categories: [ { id: 'avoid', label: 'Avoid' }, { id: 'transfer', label: 'Transfer' }, { id: 'mitigate', label: 'Mitigate' }, { id: 'accept', label: 'Accept' } ],
      correct: { r1: 'avoid', r2: 'transfer', r3: 'mitigate', r4: 'accept' } },
    answer_data_ar: { items: [
      { id: 'r1', text: 'إزالة التهديد عبر معالجة سببه الجذري' },
      { id: 'r2', text: 'نقل الأثر المالي إلى شركة تأمين' },
      { id: 'r3', text: 'إضافة اختبارات لتقليل احتمالية العيوب' },
      { id: 'r4', text: 'عدم اتخاذ إجراء، مع تخصيص احتياطي للطوارئ' },
    ], categories: [ { id: 'avoid', label: 'التفادي' }, { id: 'transfer', label: 'التحويل' }, { id: 'mitigate', label: 'التخفيف' }, { id: 'accept', label: 'القبول' } ],
      correct: { r1: 'avoid', r2: 'transfer', r3: 'mitigate', r4: 'accept' } },
  },
  // ── ORDERING 1 ── change request flow
  {
    ...base, domain: 'process', subdomain: 'Change control', difficulty: 'paced', question_type: 'ordering',
    question_text: 'Put the steps of processing a change request in the correct order.',
    question_text_ar: 'رتّب خطوات معالجة طلب التغيير بالترتيب الصحيح.',
    explanation: 'Document the change, analyze its impact, route it through integrated change control (CCB) for a decision, then update baselines and communicate.',
    explanation_ar: 'وثّق التغيير، ثم حلّل أثره، ثم مرّره عبر التحكم المتكامل في التغيير (مجلس التحكم في التغيير) لاتخاذ قرار، ثم حدّث الخطوط المرجعية وأبلغ المعنيين.',
    rita_tip: 'Never touch the baseline before an approved decision — analysis and CCB come first.',
    rita_tip_ar: 'لا تمس الخط المرجعي قبل صدور قرار معتمد — التحليل ومجلس التحكم في التغيير يأتيان أولًا.',
    answer_data: { items: [
      { id: 'c1', text: 'Document the requested change' },
      { id: 'c2', text: 'Analyze its impact on scope, schedule, and cost' },
      { id: 'c3', text: 'Submit it to integrated change control (CCB)' },
      { id: 'c4', text: 'Obtain the approval or rejection decision' },
      { id: 'c5', text: 'Update baselines and communicate to stakeholders' },
    ], correct_order: ['c1', 'c2', 'c3', 'c4', 'c5'] },
    answer_data_ar: { items: [
      { id: 'c1', text: 'توثيق التغيير المطلوب' },
      { id: 'c2', text: 'تحليل أثره على النطاق والجدول الزمني والتكلفة' },
      { id: 'c3', text: 'تقديمه إلى التحكم المتكامل في التغيير (مجلس التحكم في التغيير)' },
      { id: 'c4', text: 'الحصول على قرار الموافقة أو الرفض' },
      { id: 'c5', text: 'تحديث الخطوط المرجعية وإبلاغ المعنيين' },
    ], correct_order: ['c1', 'c2', 'c3', 'c4', 'c5'] },
  },
  // ── ORDERING 2 ── risk process
  {
    ...base, domain: 'process', subdomain: 'Risk', difficulty: 'difficult', question_type: 'ordering',
    question_text: 'Arrange the project risk management activities in their logical sequence.',
    question_text_ar: 'رتّب أنشطة إدارة مخاطر المشروع في تسلسلها المنطقي.',
    explanation: 'Identify risks, qualify them, quantify the significant ones, plan responses, then implement those responses.',
    explanation_ar: 'حدّد المخاطر، ثم قيّمها نوعيًا، ثم قيّم المهم منها كميًا، ثم خطّط الاستجابات، ثم نفّذ تلك الاستجابات.',
    rita_tip: 'Qualitative analysis always precedes quantitative — you prioritize before you model numbers.',
    rita_tip_ar: 'التحليل النوعي يسبق دائمًا الكمي — تُرتّب الأولويات قبل نمذجة الأرقام.',
    answer_data: { items: [
      { id: 'k1', text: 'Identify risks' },
      { id: 'k2', text: 'Perform qualitative risk analysis' },
      { id: 'k3', text: 'Perform quantitative risk analysis' },
      { id: 'k4', text: 'Plan risk responses' },
      { id: 'k5', text: 'Implement risk responses' },
    ], correct_order: ['k1', 'k2', 'k3', 'k4', 'k5'] },
    answer_data_ar: { items: [
      { id: 'k1', text: 'تحديد المخاطر' },
      { id: 'k2', text: 'إجراء التحليل النوعي للمخاطر' },
      { id: 'k3', text: 'إجراء التحليل الكمي للمخاطر' },
      { id: 'k4', text: 'تخطيط الاستجابات للمخاطر' },
      { id: 'k5', text: 'تنفيذ الاستجابات للمخاطر' },
    ], correct_order: ['k1', 'k2', 'k3', 'k4', 'k5'] },
  },
  // ── MULTIPLE_RESPONSE top-up 1 ──
  {
    ...base, domain: 'people', subdomain: 'Servant leadership', difficulty: 'paced', question_type: 'multiple_response',
    question_text: 'A servant-leader project manager wants to strengthen team ownership. Which THREE actions best reflect servant leadership? (Select 3)',
    question_text_ar: 'يريد مدير مشروع يتبنّى القيادة الخادمة تعزيز ملكية الفريق. أي ثلاثة إجراءات تعكس القيادة الخادمة على أفضل وجه؟ (اختر 3)',
    explanation: 'Servant leaders remove impediments, coach/grow people, and foster shared decision-making. Command-and-control behaviors (a, e) contradict it.',
    explanation_ar: 'يزيل القادة الخدم العوائق، ويطوّرون الأفراد ويرشدونهم، ويعزّزون اتخاذ القرار المشترك. أما سلوكيات الأمر والتحكم (أ، هـ) فتناقضها.',
    rita_tip: 'Servant leadership = enable the team, not control it.',
    rita_tip_ar: 'القيادة الخادمة = تمكين الفريق لا التحكم فيه.',
    answer_data: { select_count: 3, options: {
      a: 'Assign every task personally to keep tight control',
      b: 'Remove impediments the team raises',
      c: 'Coach team members to grow their skills',
      d: 'Facilitate the team making its own commitments',
      e: 'Escalate to management whenever the team disagrees',
      f: 'Approve all decisions yourself before work proceeds',
    }, correct: ['b', 'c', 'd'] },
    answer_data_ar: { select_count: 3, options: {
      a: 'إسناد كل مهمة بنفسك للحفاظ على تحكم صارم',
      b: 'إزالة العوائق التي يثيرها الفريق',
      c: 'إرشاد أعضاء الفريق لتنمية مهاراتهم',
      d: 'تيسير وضع الفريق لالتزاماته بنفسه',
      e: 'التصعيد للإدارة كلما اختلف الفريق',
      f: 'اعتماد جميع القرارات بنفسك قبل بدء العمل',
    }, correct: ['b', 'c', 'd'] },
  },
  // ── PULL_DOWN top-up 1 ──
  {
    ...base, domain: 'process', subdomain: 'Schedule', difficulty: 'paced', question_type: 'pull_down',
    question_text: 'Complete the schedule-compression guidance by choosing the correct term for each blank.',
    question_text_ar: 'أكمل إرشادات ضغط الجدول الزمني باختيار المصطلح الصحيح لكل فراغ.',
    explanation: 'Crashing adds resources to critical-path activities (increasing cost); fast tracking runs activities in parallel (increasing risk).',
    explanation_ar: 'يضيف تسريع الجدول الزمني موارد إلى أنشطة المسار الحرج (فيزيد التكلفة)؛ ويشغّل المسار السريع الأنشطة بالتوازي (فيزيد المخاطر).',
    rita_tip: 'Crashing costs money; fast tracking adds risk.',
    rita_tip_ar: 'تسريع الجدول الزمني يكلّف مالًا؛ والمسار السريع يضيف مخاطر.',
    answer_data: { blanks: [
      { id: 'b1', prompt_before: 'To shorten the schedule by adding resources, use', prompt_after: ', which typically increases cost.', options: ['crashing', 'fast tracking', 'leveling'], correct: 'crashing' },
      { id: 'b2', prompt_before: 'To run activities in parallel, use', prompt_after: ', which typically increases risk.', options: ['crashing', 'fast tracking', 'smoothing'], correct: 'fast tracking' },
    ] },
    answer_data_ar: { blanks: [
      { id: 'b1', prompt_before: 'لتقصير الجدول الزمني بإضافة موارد، استخدم', prompt_after: '، وهو ما يزيد التكلفة عادةً.', options: ['تسريع الجدول الزمني', 'المسار السريع', 'تسوية الموارد'], correct: 'تسريع الجدول الزمني' },
      { id: 'b2', prompt_before: 'لتشغيل الأنشطة بالتوازي، استخدم', prompt_after: '، وهو ما يزيد المخاطر عادةً.', options: ['تسريع الجدول الزمني', 'المسار السريع', 'التنعيم'], correct: 'المسار السريع' },
    ] },
  },
];

(async () => {
  console.log(`Seeding ${rows.length} interactive-format questions...`);
  let ok = 0;
  for (const r of rows) {
    // Idempotent: skip if a question with this exact text already exists.
    const { data: existing } = await s.from('questions').select('id').eq('question_text', r.question_text).limit(1);
    if (existing && existing.length) { console.log('  = exists, skipped:', r.question_type, '·', r.subdomain); continue; }
    const { error } = await s.from('questions').insert(r);
    if (error) { console.log('FAIL', r.question_type, r.subdomain, '—', error.message); continue; }
    ok++;
    console.log('  +', r.question_type, '·', r.domain, '·', r.subdomain);
  }
  console.log(`Done: ${ok}/${rows.length} inserted.`);
  const { data } = await s.from('questions').select('question_type').eq('is_active', true);
  const c = {}; for (const q of data) c[q.question_type] = (c[q.question_type] || 0) + 1;
  console.log('Active question_type counts now:', JSON.stringify(c));
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
