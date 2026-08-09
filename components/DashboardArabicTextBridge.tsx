'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'

const EXACT: Record<string, string> = {
  // Practice
  'Practice Questions': 'أسئلة التدريب',
  'Adaptive Learning Engine · PMBOK 7 & 8': 'محرك تعلم تكيفي · PMBOK 7 و 8',
  'Choose your framework': 'اختر الإطار المعرفي',
  'Choose your difficulty level': 'اختر مستوى الصعوبة',
  'Filter by domain': 'تصفية حسب المجال',
  'PMBOK 8 + ECO 2026': 'PMBOK 8 + ECO 2026',
  'PMBOK 7 + ECO 2021': 'PMBOK 7 + ECO 2021',
  'Paced': 'متدرج',
  'Entry': 'مبتدئ',
  'Challenging': 'تحدي',
  'Difficult': 'صعب',
  'Moderate — Apply your knowledge': 'متوسط — طبّق معرفتك',
  'Easy — Build your foundation': 'سهل — ابنِ أساسك المعرفي',
  'Professional level mastery': 'إتقان بمستوى احترافي',
  'Real exam-style questions': 'أسئلة بأسلوب الاختبار الحقيقي',
  'Business Environment (8%)': 'بيئة الأعمال (8%)',
  'Process (50%)': 'العمليات (50%)',
  'People (42%)': 'الأشخاص (42%)',
  'All Domains': 'جميع المجالات',
  'Start Practice Session 🚀': 'ابدأ جلسة التدريب 🚀',
  'questions per block · AI wrap-up after each block · Guru report after 15 questions': 'أسئلة في كل مجموعة · تلخيص ذكي بعد كل مجموعة · تقرير الخبير بعد 15 سؤالًا',

  // Exam
  'PMP Mock Exam': 'اختبار PMP التجريبي',
  'Simulate the real PMP exam experience': 'حاكِ تجربة اختبار PMP الحقيقي',
  'Ready for the Challenge?': 'هل أنت مستعد للتحدي؟',
  'Begin Exam': 'ابدأ الاختبار',
  'Previous Attempts': 'المحاولات السابقة',
  'Sections': 'الأقسام',
  'Minutes': 'الدقائق',
  'Questions': 'الأسئلة',
  'PASS': 'ناجح',
  'FAIL': 'راسب',
  'Demo: 10 questions. Full 180 in production.': 'تجربة: 10 أسئلة. النسخة الكاملة 180 سؤالًا في الإنتاج.',

  // Tutor
  'Clear chat': 'مسح المحادثة',
  'Zane': 'Zane',
  'Grounded in PMBOK 7 · ECO 2021 · Rita Mulcahy': 'مبني على PMBOK 7 · ECO 2021 · Rita Mulcahy',
  'Welcome to Zane 👋': 'مرحبًا بك مع Zane 👋',
  "I'm grounded in PMBOK 7 + ECO 2021 + Rita Mulcahy and ready to help you pass the PMP exam.": 'أنا مبني على PMBOK 7 + ECO 2021 + Rita Mulcahy وجاهز لمساعدتك على اجتياز اختبار PMP.',
  'I can help you': 'يمكنني مساعدتك في',
  'Understand concepts from all key exam sources 📚': 'فهم المفاهيم من جميع مصادر الاختبار الرئيسية 📚',
  'Practice questions with detailed explanations ✅': 'التدرب على أسئلة مع شروحات تفصيلية ✅',
  "Apply Rita's techniques for tricky questions 🎯": 'تطبيق تقنيات ريتا للأسئلة الصعبة 🎯',
  'Remember frameworks with mnemonics and examples 💡': 'تذكّر الأطر باستخدام وسائل التذكر والأمثلة 💡',
  'What would you like to study today?': 'ماذا تريد أن تدرس اليوم؟',
  'Suggested questions': 'أسئلة مقترحة',
  'What is the difference between a project and a program?': 'ما الفرق بين المشروع والبرنامج؟',
  'Explain the 12 PMBOK 7 principles with exam tips': 'اشرح مبادئ PMBOK 7 الاثني عشر مع نصائح للاختبار',
  'Explain servant leadership and when it appears on the exam': 'اشرح القيادة الخادمة ومتى تظهر في الاختبار',
  'How do I approach agile vs predictive questions on the exam?': 'كيف أتعامل مع أسئلة أجايل مقابل التنبؤي في الاختبار؟',
  'Ask anything about the PMP exam... (Enter to send, Shift+Enter for new line)': 'اسأل أي شيء عن اختبار PMP... (Enter للإرسال، Shift+Enter لسطر جديد)',
  'AI responses are for exam preparation only. Always verify with official PMI materials.': 'إجابات الذكاء الاصطناعي مخصصة للتحضير للاختبار فقط. تحقق دائمًا من مواد PMI الرسمية.',

  // Formulas
  'Dashboard ←': 'لوحة التحكم ←',
  'PMP Formulas 📐': 'معادلات PMP 📐',
  "essential formulas · Exam scenarios · Rita's techniques 17": 'معادلات أساسية · سيناريوهات اختبار · تقنيات ريتا 17',
  'Search formulas... (e.g., CPI, earned value, variance)': 'ابحث في المعادلات... (مثل CPI، القيمة المكتسبة، التباين)',
  "Rita Mulcahy's Formula Strategy": 'استراتيجية ريتا ملقاهي للمعادلات',
  'Master technique for all EVM formulas': 'تقنية رئيسية لجميع معادلات EVM',
  'EV always comes first in every EVM formula.': 'EV تأتي دائمًا أولًا في كل معادلات EVM.',
  'Variance = subtraction (EV minus something). Index = division (EV divided by something)': 'التباين = طرح (EV ناقص شيء ما). المؤشر = قسمة (EV مقسومة على شيء ما)',
  'Cost formulas use AC. Schedule formulas use PV': 'معادلات التكلفة تستخدم AC. معادلات الجدول تستخدم PV',
  'Negative variance = bad. Index less than 1 = bad. (Except TCPI — opposite!)': 'التباين السلبي = سيئ. المؤشر الأقل من 1 = سيئ. باستثناء TCPI — العكس!',
  'Cost Variance (CV)': 'تباين التكلفة (CV)',
  'Schedule Variance (SV)': 'تباين الجدول الزمني (SV)',
  'Shows whether the project is over or under budget at this point in time': 'يوضح ما إذا كان المشروع أعلى أو أقل من الميزانية في هذه اللحظة',
  'Shows whether the project is ahead of or behind schedule': 'يوضح ما إذا كان المشروع متقدمًا أو متأخرًا عن الجدول',
  'Positive = under budget': 'الموجب = أقل من الميزانية',
  'Negative = over budget': 'السالب = أعلى من الميزانية',
  'Positive = ahead of schedule': 'الموجب = متقدم على الجدول',
  'Negative = behind schedule': 'السالب = متأخر عن الجدول',

  // Processes
  'Process Relationships 🔄': 'علاقات العمليات 🔄',
  'Interactive map of how PMP processes connect and flow': 'خريطة تفاعلية توضح كيف ترتبط عمليات PMP وتتدفق',
  'PROCESS GROUP FLOW': 'تدفق مجموعات العمليات',
  'Click any process group to explore its activities, outputs, and exam tips.': 'انقر على أي مجموعة عمليات لاستكشاف أنشطتها ومخرجاتها ونصائح الاختبار.',
  'Initiating': 'البدء',
  'Planning': 'التخطيط',
  'Executing': 'التنفيذ',
  'Monitoring & Controlling': 'المراقبة والتحكم',
  'Closing': 'الإغلاق',
  'Defining and authorizing the project or phase. Obtaining approval to start': 'تعريف المشروع أو المرحلة واعتمادها. الحصول على الموافقة للبدء',
  'Establishing the scope, refining objectives, and defining the course of action': 'تحديد النطاق، وصقل الأهداف، وتحديد مسار العمل',
  'Completing the work defined in the project management plan to satisfy': 'إنجاز العمل المحدد في خطة إدارة المشروع لتحقيق المتطلبات',
  'Tracking, reviewing, and regulating progress. Identifying changes needed': 'تتبع التقدم ومراجعته وتنظيمه. تحديد التغييرات المطلوبة',
  'Finalizing all activities to formally close the project or phase': 'إنهاء جميع الأنشطة لإغلاق المشروع أو المرحلة رسميًا',
  'Dynamic flow: Planning, Executing, and M&C have bidirectional arrows — changes in execution often require re-planning. M&C runs throughout the entire project 🔁': 'تدفق ديناميكي: التخطيط والتنفيذ والمراقبة والتحكم بينها أسهم ثنائية الاتجاه — فالتغييرات أثناء التنفيذ غالبًا تتطلب إعادة التخطيط. وتستمر المراقبة والتحكم طوال المشروع 🔁',
  'KNOWLEDGE AREAS': 'مجالات المعرفة',
  'Click any knowledge area to see which process groups it spans and its key processes.': 'انقر على أي مجال معرفة لمعرفة مجموعات العمليات التي يشملها وعملياته الرئيسية.',
  'Procurement': 'المشتريات',
  'Risk': 'المخاطر',
  'Communications': 'الاتصالات',
  'Resources': 'الموارد',
  'Quality': 'الجودة',
  'Cost': 'التكلفة',
  'Schedule': 'الجدول الزمني',
  'Scope': 'النطاق',
  'Integration': 'التكامل',
  'Stakeholders': 'المعنيون',

  // Artifacts
  'PMP Artifacts 📋': 'مخرجات ووثائق PMP 📋',
  'key artifacts · What they are · When to use · Exam tips 27': 'وثائق رئيسية · ماهيتها · متى تُستخدم · نصائح للاختبار 27',
  'Search artifacts... (e.g., charter, WBS, risk register)': 'ابحث في الوثائق... (مثل ميثاق المشروع، WBS، سجل المخاطر)',
  'Artifact Quick Guide': 'دليل سريع للوثائق',
  'Key distinctions for the exam': 'تمييزات رئيسية للاختبار',
  'Strategy artifacts are created at project start and rarely change (charter, business case).': 'وثائق الاستراتيجية تُنشأ في بداية المشروع ونادرًا ما تتغير (الميثاق، دراسة الجدوى).',
  'Logs & registers are living documents updated continuously (risk register, issue log, lessons learned)': 'السجلات والقوائم وثائق حية تُحدّث باستمرار (سجل المخاطر، سجل المشكلات، الدروس المستفادة)',
  "Plans define HOW to manage each area — they don't contain the actual work details": 'الخطط تحدد كيف تتم إدارة كل مجال — ولا تحتوي تفاصيل العمل الفعلية',
  'Baselines are the approved versions used to measure performance (scope + schedule + cost = PMB)': 'خطوط الأساس هي النسخ المعتمدة المستخدمة لقياس الأداء (النطاق + الجدول + التكلفة = PMB)',
  'Data → Information → Reports is the work performance flow — know the difference!': 'البيانات ← المعلومات ← التقارير هو تدفق أداء العمل — اعرف الفرق!',
  'Business Case': 'دراسة الجدوى',
  'Project Charter': 'ميثاق المشروع',
  'Project Vision Statement': 'بيان رؤية المشروع',
  'A value proposition for the proposed project that may include financial and nonfinancial benefits. Justifies why the project should be undertaken': 'عرض قيمة للمشروع المقترح قد يشمل فوائد مالية وغير مالية. يبرر سبب تنفيذ المشروع',
  'A document issued by the project sponsor that formally authorizes the existence of a project and gives the PM authority to apply organizational resources': 'وثيقة يصدرها راعي المشروع وتخوّل رسميًا وجود المشروع وتمنح مدير المشروع صلاحية استخدام موارد المؤسسة',
  'A concise, high-level description of the project that states the purpose and inspires the team to contribute': 'وصف موجز عالي المستوى للمشروع يوضح الغرض ويلهم الفريق للمساهمة',

  // Billing
  'Billing & Subscription': 'الفوترة والاشتراك',
  'Manage your plan, payment method, and view billing history.': 'إدارة خطتك وطريقة الدفع وعرض سجل الفواتير.',
  'CURRENT PLAN': 'الخطة الحالية',
  'Free Plan': 'الخطة المجانية',
  'Free Tier': 'الفئة المجانية',
  'Status': 'الحالة',
  'Upgrade to Premium': 'الترقية إلى Premium',
  'Payment Method': 'طريقة الدفع',
  'Default': 'افتراضي',
  'Connected as': 'متصل باسم',
  'All payments are securely processed through PayPal.': 'تتم معالجة جميع المدفوعات بأمان عبر PayPal.',
  'Billing History': 'سجل الفواتير',
  'No billing history yet': 'لا يوجد سجل فواتير حتى الآن',
  'Your payment transactions will appear here.': 'ستظهر معاملات الدفع الخاصة بك هنا.',

  // Categories
  'All (17)': 'الكل (17)',
  'All (27)': 'الكل (27)',
  'Statistics & Quality (3)': 'الإحصاء والجودة (3)',
  'Procurement (0)': 'المشتريات (0)',
  'Cost Forecasting (6)': 'توقعات التكلفة (6)',
  'Schedule (3)': 'الجدول الزمني (3)',
  'Earned Value (4)': 'القيمة المكتسبة (4)',
  'Communication (1)': 'الاتصال (1)',
  'Visual & Data (4)': 'المرئيات والبيانات (4)',
  'Baselines (3)': 'خطوط الأساس (3)',
  'Plans (5)': 'الخطط (5)',
  'Logs & Registers (7)': 'السجلات والقوائم (7)',
  'Strategy (4)': 'الاستراتيجية (4)',
  'Other Key Documents (4)': 'وثائق رئيسية أخرى (4)',
  'Strategy': 'الاستراتيجية',
  'Dev Approach and Life Cycle': 'منهج التطوير ودورة الحياة',
  'Team': 'الفريق',
}

const PARTIAL: Array<[string, string]> = [
  ['questions in 230 minutes, split into two sections with a 10-180 minute break.', 'سؤالًا خلال 230 دقيقة، مقسمة إلى قسمين مع استراحة مدتها 10 دقائق بعد السؤال 180.'],
  ['Source:', 'المصادر:'],
]

function translateValue(value: string, toArabic: boolean) {
  if (!value || !toArabic) return value

  const leading = value.match(/^\s*/)?.[0] ?? ''
  const trailing = value.match(/\s*$/)?.[0] ?? ''
  const core = value.trim()

  if (EXACT[core]) return `${leading}${EXACT[core]}${trailing}`

  let result = value
  for (const [en, ar] of PARTIAL) {
    result = result.replaceAll(en, ar)
  }
  return result
}

function translateTextNodes(root: ParentNode, toArabic: boolean) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const parent = node.parentElement
    if (!parent) continue
    if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) continue
    if (!node.nodeValue || !node.nodeValue.trim()) continue
    nodes.push(node)
  }

  for (const node of nodes) {
    const next = translateValue(node.nodeValue ?? '', toArabic)
    if (next !== node.nodeValue) node.nodeValue = next
  }
}

function translateAttributes(root: ParentNode, toArabic: boolean) {
  const elements = root.querySelectorAll<HTMLElement>('[placeholder], [title], [aria-label]')

  elements.forEach((el) => {
    for (const attr of ['placeholder', 'title', 'aria-label']) {
      const value = el.getAttribute(attr)
      if (!value) continue
      const next = translateValue(value, toArabic)
      if (next !== value) el.setAttribute(attr, next)
    }
  })
}

export default function DashboardArabicTextBridge() {
  const { isArabic } = useLanguage()

  useEffect(() => {
    if (!isArabic) return

    const run = () => {
      translateTextNodes(document.body, isArabic)
      translateAttributes(document.body, isArabic)
    }

    run()

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(run)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label'],
    })

    return () => observer.disconnect()
  }, [isArabic])

  return null
}
