export function dt(value: unknown, isArabic: boolean): string {
  if (value === null || value === undefined) return ''

  const raw = String(value)
  if (!isArabic || raw.trim() === '') return raw

  const leading = raw.match(/^\s*/)?.[0] ?? ''
  const trailing = raw.match(/\s*$/)?.[0] ?? ''
  const core = raw.trim()

  const stripLeadingSymbol = (text: string) =>
    text.replace(/^[^\w\u0600-\u06FF]+/u, '').trim()

  const exact: Record<string, string> = {
    // Global
    '← Dashboard': 'لوحة التحكم ←',
    'Dashboard ←': 'لوحة التحكم ←',
    'Dashboard': 'لوحة التحكم',
    'Back': 'رجوع',
    'All': 'الكل',
    'Clear filters': 'مسح التصفية',

    // Exam
    'PMP Mock Exam': 'اختبار PMP التجريبي',
    'Simulate the real PMP exam experience': 'حاكِ تجربة اختبار PMP الحقيقي',
    'Ready for the Challenge?': 'هل أنت مستعد للتحدي؟',
    '180 questions in 230 minutes, split into two sections with a 10-minute break.': '180 سؤالًا خلال 230 دقيقة، مقسمة إلى قسمين مع استراحة مدتها 10 دقائق.',
    'Questions': 'الأسئلة',
    'Minutes': 'الدقائق',
    'Sections': 'الأقسام',
    'Demo: 10 questions. Full 180 in production.': 'تجربة: 10 أسئلة. النسخة الكاملة 180 سؤالًا في الإنتاج.',
    'Begin Exam': 'ابدأ الاختبار',
    'Previous Attempts': 'المحاولات السابقة',
    'PASS': 'ناجح',
    'FAIL': 'راسب',

    // Formulas page
    'PMP Formulas': 'معادلات PMP',
    'PMP Formulas 📐': 'معادلات PMP 📐',
    'essential formulas': 'معادلات أساسية',
    'Exam scenarios': 'سيناريوهات اختبار',
    "Rita's techniques": 'تقنيات ريتا',
    'Rita Mulcahy’s Formula Strategy': 'استراتيجية ريتا ملقاهي للمعادلات',
    "Rita Mulcahy's Formula Strategy": 'استراتيجية ريتا ملقاهي للمعادلات',
    'Master technique for all EVM formulas': 'تقنية رئيسية لجميع معادلات EVM',
    'EV always comes first': 'EV تأتي دائمًا أولًا',
    'in every EVM formula.': 'في كل معادلة من معادلات EVM.',
    'Variance = subtraction': 'التباين = طرح',
    'EV minus something': 'EV ناقص شيء ما',
    'Index = division': 'المؤشر = قسمة',
    'EV divided by something': 'EV مقسوم على شيء ما',
    'Cost formulas use AC': 'معادلات التكلفة تستخدم AC',
    'Schedule formulas use PV': 'معادلات الجدول الزمني تستخدم PV',
    'Negative variance = bad': 'التباين السلبي = سيئ',
    'Index less than 1 = bad': 'المؤشر الأقل من 1 = سيئ',
    'Except TCPI — opposite!': 'باستثناء TCPI — العكس!',
    'Cost Variance (CV)': 'تباين التكلفة (CV)',
    'Schedule Variance (SV)': 'تباين الجدول الزمني (SV)',
    'Shows whether the project is over or under budget at this point in time': 'يوضح ما إذا كان المشروع أعلى أو أقل من الميزانية في هذه اللحظة.',
    'Shows whether the project is ahead of or behind schedule': 'يوضح ما إذا كان المشروع متقدمًا أو متأخرًا عن الجدول الزمني.',
    'Positive = under budget': 'الموجب = أقل من الميزانية',
    'Negative = over budget': 'السالب = أعلى من الميزانية',
    'Positive = ahead of schedule': 'الموجب = متقدم على الجدول',
    'Negative = behind schedule': 'السالب = متأخر عن الجدول',

    // Formula page remaining UI
    'essential formulas · Exam scenarios · Rita techniques': 'معادلات أساسية · سيناريوهات اختبارية · تقنيات ريتا',
    'Search formulas... (e.g., CPI, earned value, variance)': 'ابحث في المعادلات... مثل CPI أو القيمة المكتسبة أو التباين',
    'Ready to test your formula knowledge?': 'هل أنت مستعد لاختبار معرفتك بالمعادلات؟',
    'Practice questions that use these formulas in real exam scenarios.': 'تدرّب على أسئلة تستخدم هذه المعادلات في سيناريوهات اختبار واقعية.',
    'Practice Now': 'ابدأ التدريب الآن',

    // Formula names
    'Cost Performance Index (CPI)': 'مؤشر أداء التكلفة (CPI)',
    'Schedule Performance Index (SPI)': 'مؤشر أداء الجدول الزمني (SPI)',
    'Estimate at Completion — CPI trend (EAC)': 'التقدير عند الإكمال — حسب اتجاه CPI ‏(EAC)',
    'Estimate at Completion — Atypical (EAC)': 'التقدير عند الإكمال — حالة غير نمطية (EAC)',
    'Estimate at Completion — Re-estimate (EAC)': 'التقدير عند الإكمال — إعادة التقدير (EAC)',
    'Estimate to Complete (ETC)': 'التقدير اللازم للإكمال (ETC)',
    'Variance at Completion (VAC)': 'التباين عند الإكمال (VAC)',
    'To-Complete Performance Index (TCPI)': 'مؤشر الأداء المطلوب للإكمال (TCPI)',
    'Three-Point Estimate — Triangular': 'التقدير ثلاثي النقاط — التوزيع المثلث',
    'Three-Point Estimate — Beta (PERT)': 'التقدير ثلاثي النقاط — بيتا (PERT)',
    'Total Float (Slack)': 'الهامش الكلي (Total Float)',
    'Communication Channels': 'قنوات الاتصال',
    'Expected Monetary Value (EMV)': 'القيمة النقدية المتوقعة (EMV)',
    'Standard Deviation (σ) — PERT': 'الانحراف المعياري (σ) — PERT',
    'Present Value (PV)': 'القيمة الحالية (PV)',

    // Formula interpretations
    'Shows whether the project is over or under budget at this point in time.': 'يوضح ما إذا كان المشروع أعلى أو أقل من الميزانية في هذه اللحظة.',
    'Shows whether the project is ahead of or behind schedule.': 'يوضح ما إذا كان المشروع متقدمًا أو متأخرًا عن الجدول الزمني.',
    'For every $1 spent, how much value are we getting? Shows cost efficiency.': 'يوضح مقدار القيمة التي يحصل عليها المشروع مقابل كل وحدة تكلفة يتم إنفاقها، ويقيس كفاءة التكلفة.',
    'Shows what percentage of planned schedule progress has been achieved.': 'يوضح النسبة التي تم تحقيقها من التقدم المخطط في الجدول الزمني.',
    'If current cost performance trends continue, what will the total project cost?': 'إذا استمرت اتجاهات أداء التكلفة الحالية، فما التكلفة الإجمالية المتوقعة للمشروع؟',
    'If current variances are ATYPICAL (one-time events), what will the total project cost?': 'إذا كانت التباينات الحالية غير نمطية أو حدثت لمرة واحدة، فما التكلفة الإجمالية المتوقعة للمشروع؟',
    'When original estimates are fundamentally flawed, re-estimate all remaining work.': 'عندما تكون التقديرات الأصلية غير دقيقة جذريًا، يتم إعادة تقدير العمل المتبقي بالكامل.',
    'How much MORE money is needed to finish the project from this point?': 'ما مقدار التكلفة الإضافية المطلوبة لإنهاء المشروع من هذه النقطة؟',
    'How much over or under budget will we be at the END of the project?': 'ما مقدار الزيادة أو النقص المتوقع في الميزانية عند نهاية المشروع؟',
    'What cost efficiency rate must be achieved on remaining work to stay within budget?': 'ما معدل كفاءة التكلفة المطلوب تحقيقه في العمل المتبقي للبقاء ضمن الميزانية؟',
    'Simple average of three estimates. Each estimate has equal weight.': 'متوسط بسيط لثلاثة تقديرات، بحيث يكون لكل تقدير الوزن نفسه.',
    'Weighted average giving 4x importance to the Most Likely estimate.': 'متوسط مرجح يعطي التقدير الأكثر احتمالًا وزنًا أكبر بأربع مرات.',
    'How much can an activity be delayed without delaying the project end date?': 'ما المدة التي يمكن أن يتأخر فيها النشاط دون تأخير تاريخ انتهاء المشروع؟',
    'Total number of potential communication channels in the project.': 'إجمالي عدد قنوات الاتصال المحتملة في المشروع.',
    'The weighted monetary value of a risk event. Used in decision tree analysis.': 'القيمة النقدية المرجحة لحدث خطر، وتُستخدم في تحليل شجرة القرار.',
    'Measures the range/uncertainty of an estimate. Larger σ = more uncertainty.': 'يقيس نطاق عدم اليقين في التقدير؛ وكلما زادت σ زادت درجة عدم اليقين.',
    'What is future money worth today? Used in project selection.': 'ما قيمة المال المستقبلي اليوم؟ وتُستخدم في اختيار المشاريع.',

    // Formula categories
    'Statistics & Quality': 'الإحصاء والجودة',
    'Procurement': 'المشتريات',
    'Cost Forecasting': 'توقعات التكلفة',
    'Schedule': 'الجدول الزمني',
    'Earned Value': 'القيمة المكتسبة',
    'Communication': 'الاتصال',

    // Artifacts page
    'PMP Artifacts': 'وثائق ومخرجات PMP',
    'PMP Artifacts 📋': 'وثائق ومخرجات PMP 📋',
    'key artifacts': 'وثائق رئيسية',
    'What they are': 'ماهيتها',
    'When to use': 'متى تُستخدم',
    'Exam tips': 'نصائح للاختبار',
    'Artifact Quick Guide': 'دليل سريع للوثائق',
    'Key distinctions for the exam': 'تمييزات رئيسية للاختبار',
    'Strategy artifacts': 'وثائق الاستراتيجية',
    'Logs & registers': 'السجلات والقوائم',
    'Plans': 'الخطط',
    'Baselines': 'خطوط الأساس',
    'Data → Information → Reports': 'البيانات ← المعلومات ← التقارير',
    'Business Case': 'دراسة الجدوى',
    'Project Charter': 'ميثاق المشروع',
    'Project Vision Statement': 'بيان رؤية المشروع',
    'A value proposition for the proposed project that may include financial and nonfinancial benefits.': 'عرض قيمة للمشروع المقترح قد يشمل فوائد مالية وغير مالية.',
    'Justifies why the project should be undertaken': 'يبرر سبب تنفيذ المشروع.',
    'A document issued by the project sponsor that formally authorizes the existence of a project': 'وثيقة يصدرها راعي المشروع وتخوّل رسميًا وجود المشروع.',
    'gives the PM authority to apply organizational resources': 'وتمنح مدير المشروع صلاحية استخدام موارد المؤسسة.',
    'A concise, high-level description of the project that states the purpose and inspires the team to contribute': 'وصف موجز عالي المستوى للمشروع يوضح الغرض ويلهم الفريق للمساهمة.',
    'Visual & Data': 'المرئيات والبيانات',
       'Logs & Registers': 'السجلات والقوائم',
    'Strategy': 'الاستراتيجية',
    'Other Key Documents': 'وثائق رئيسية أخرى',
    'Dev Approach and Life Cycle': 'منهج التطوير ودورة الحياة',
    'Planning': 'التخطيط',
    'Stakeholders': 'المعنيون',
    'Team': 'الفريق',
  }

  // Handles labels like "Earned Value (4)" or "Visual & Data (4)".
  const counted = core.match(/^(.+?)\s*\((\d+)\)$/)
  if (counted) {
    const base = counted[1].trim()
    const count = counted[2]
    const baseWithoutSymbol = stripLeadingSymbol(base)
    const translatedBase =
      exact[base] ??
      (exact[baseWithoutSymbol] ? base.replace(baseWithoutSymbol, exact[baseWithoutSymbol]) : base)
    return `${leading}${translatedBase} (${count})${trailing}`
  }

  if (exact[core]) return `${leading}${exact[core]}${trailing}`

  const coreWithoutSymbol = stripLeadingSymbol(core)
  if (coreWithoutSymbol !== core && exact[coreWithoutSymbol]) {
    return `${leading}${core.replace(coreWithoutSymbol, exact[coreWithoutSymbol])}${trailing}`
  }

  const partial: Array<[string, string]> = [
    // Header fragments
    ['essential formulas', 'معادلات أساسية'],
    ['Exam scenarios', 'سيناريوهات اختبار'],
    ["Rita's techniques", 'تقنيات ريتا'],
    ['key artifacts', 'وثائق رئيسية'],
    ['What they are', 'ماهيتها'],
    ['When to use', 'متى تُستخدم'],
    ['Exam tips', 'نصائح للاختبار'],

    // Formula fragments
    ['EV always comes first', 'EV تأتي دائمًا أولًا'],
    ['in every EVM formula', 'في كل معادلة من معادلات EVM'],
    ['Variance = subtraction', 'التباين = طرح'],
    ['EV minus something', 'EV ناقص شيء ما'],
    ['Index = division', 'المؤشر = قسمة'],
    ['EV divided by something', 'EV مقسوم على شيء ما'],
    ['Cost formulas use AC', 'معادلات التكلفة تستخدم AC'],
    ['Schedule formulas use PV', 'معادلات الجدول الزمني تستخدم PV'],
    ['Negative variance = bad', 'التباين السلبي = سيئ'],
    ['Index less than 1 = bad', 'المؤشر الأقل من 1 = سيئ'],
    ['Except TCPI — opposite', 'باستثناء TCPI — العكس'],
    ['Shows whether the project is over or under budget at this point in time', 'يوضح ما إذا كان المشروع أعلى أو أقل من الميزانية في هذه اللحظة'],
    ['Shows whether the project is ahead of or behind schedule', 'يوضح ما إذا كان المشروع متقدمًا أو متأخرًا عن الجدول الزمني'],
    ['Positive = under budget', 'الموجب = أقل من الميزانية'],
    ['Negative = over budget', 'السالب = أعلى من الميزانية'],
    ['Positive = ahead of schedule', 'الموجب = متقدم على الجدول'],
    ['Negative = behind schedule', 'السالب = متأخر عن الجدول'],

    // Artifact fragments
    ['Strategy artifacts', 'وثائق الاستراتيجية'],
    ['are created at project start and rarely change', 'تُنشأ في بداية المشروع ونادرًا ما تتغير'],
    ['charter, business case', 'ميثاق المشروع، دراسة الجدوى'],
    ['Logs & registers', 'السجلات والقوائم'],
    ['are living documents updated continuously', 'وثائق حية يتم تحديثها باستمرار'],
    ['risk register, issue log, lessons learned', 'سجل المخاطر، سجل المشكلات، الدروس المستفادة'],
    ['Plans define HOW to manage each area', 'الخطط تحدد كيف تتم إدارة كل مجال'],
    ["they don't contain the actual work details", 'ولا تحتوي تفاصيل العمل الفعلية'],
    ['Baselines are the approved versions used to measure performance', 'خطوط الأساس هي النسخ المعتمدة المستخدمة لقياس الأداء'],
    ['scope + schedule + cost = PMB', 'النطاق + الجدول الزمني + التكلفة = PMB'],
    ['Data → Information → Reports is the work performance flow', 'البيانات ← المعلومات ← التقارير هو تدفق أداء العمل'],
    ['know the difference', 'اعرف الفرق'],
    ['A value proposition for the proposed project that may include financial and nonfinancial benefits.', 'عرض قيمة للمشروع المقترح قد يشمل فوائد مالية وغير مالية.'],
    ['Justifies why the project should be undertaken', 'يبرر سبب تنفيذ المشروع'],
    ['A document issued by the project sponsor that formally authorizes the existence of a project', 'وثيقة يصدرها راعي المشروع وتخوّل رسميًا وجود المشروع'],
    ['gives the PM authority to apply organizational resources', 'وتمنح مدير المشروع صلاحية استخدام موارد المؤسسة'],
    ['A concise, high-level description of the project that states the purpose and inspires the team to contribute', 'وصف موجز عالي المستوى للمشروع يوضح الغرض ويلهم الفريق للمساهمة'],
  ]

  let result = raw
  for (const [en, ar] of partial) {
    result = result.split(en).join(ar)
  }

  return result
}

export function rtlClass(isArabic: boolean): string {
  return isArabic ? 'text-right' : 'text-left'
}

export function rtlDir(isArabic: boolean): 'rtl' | 'ltr' {
  return isArabic ? 'rtl' : 'ltr'
}
