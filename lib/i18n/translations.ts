export type Locale = 'en' | 'ar'

export const RTL_LOCALES: Locale[] = ['ar']

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale)
}

export const LANGUAGE_OPTIONS = [
  { code: 'en' as Locale, label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar' as Locale, label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  // { code: 'fr' as Locale, label: 'Français', flag: '🇫🇷', dir: 'ltr' }, // Phase 2
]

export type TranslationKeys = {
  // ── Auth ──
  'auth.welcome_back': string
  'auth.sign_in_continue': string
  'auth.email': string
  'auth.password': string
  'auth.sign_in': string
  'auth.signing_in': string
  'auth.no_account': string
  'auth.sign_up_free': string
  'auth.continue_google': string
  'auth.or': string
  'auth.forgot_password': string
  'auth.select_language': string
  'auth.create_account': string
  'auth.start_journey': string
  'auth.full_name': string
  'auth.sign_up': string
  'auth.signing_up': string
  'auth.have_account': string
  'auth.sign_in_link': string

  // ── Sidebar / Nav ──
  'nav.learning': string
  'nav.tools': string
  'nav.progress': string
  'nav.account': string
  'nav.dashboard': string
  'nav.today': string
  'nav.mindmap': string
  'nav.course': string
  'nav.pmp_path': string
  'nav.study_studio': string
  'nav.practice': string
  'nav.practice_lab': string
  'nav.mock_exam': string
  'nav.exam_simulator': string
  'nav.tutor': string
  'nav.ai_coach': string
  'nav.formulas': string
  'nav.processes': string
  'nav.artifacts': string
  'nav.billing': string
  'nav.readiness_report': string
  'nav.admin': string
  'nav.branding': string
  'nav.analytics': string
  'nav.media': string
  'nav.resources': string
  'nav.questions': string
  'nav.sign_out': string
  'nav.upgrade': string

  // ── Dashboard ──
  'dashboard.title': string
  'dashboard.welcome': string
  'dashboard.readiness': string
  'dashboard.accuracy': string
  'dashboard.study_streak': string
  'dashboard.questions_practiced': string

  // ── Practice ──
  'practice.title': string
  'practice.start': string
  'practice.next': string
  'practice.submit': string
  'practice.correct': string
  'practice.incorrect': string
  'practice.score': string
  'practice.explanation': string
  'practice.continue': string
  'practice.finish': string
  'practice.questions_remaining': string

  // ── Common ──
  'common.loading': string
  'common.error': string
  'common.save': string
  'common.cancel': string
  'common.back': string
  'common.next': string
  'common.close': string
  'common.search': string
  'common.all': string
  'common.print_pdf': string
  'common.deep_dive': string
  'common.exam_tip': string
  'common.back_dashboard': string

  // ── Companion ──
  'companion.title': string
  'companion.subtitle': string
  'companion.placeholder': string
  'companion.quick_actions': string
  'companion.clear': string
  'companion.footer': string

  // ── Formulas ──
  'formulas.title': string
  'formulas.subtitle': string
  'formulas.search_placeholder': string
  'formulas.variables': string
  'formulas.when_to_use': string
  'formulas.example': string
  'formulas.exam_scenario': string
  'formulas.confusion_alert': string
  'formulas.rita_tip': string

  // ── Artifacts ──
  'artifacts.title': string
  'artifacts.subtitle': string
  'artifacts.search_placeholder': string
  'artifacts.created_by': string
  'artifacts.when_used': string
  'artifacts.key_purpose': string
  'artifacts.related': string

  // ── Processes ──
  'processes.title': string
  'processes.subtitle': string
  'processes.flow_title': string
  'processes.ka_title': string
  'processes.matrix_title': string
  'processes.key_activities': string
  'processes.key_outputs': string

  // ── Plans / Pricing ──
  'pricing.title': string
  'pricing.subtitle': string
  'pricing.monthly': string
  'pricing.annual': string
  'pricing.get_plan': string
  'pricing.most_popular': string


  // ── Course Library ──
  'course.library_title': string
  'course.library_desc': string
  'course.perf_domains': string
  'course.total_lessons': string
  'course.avg_per_lesson': string
  'course.practice_ctas': string
  'course.every_lesson': string
  'course.domain': string
  'course.lessons': string
  'course.lessons_label': string
  'course.practice_label': string
  'course.mindmap_label': string
  'course.start': string
  'course.course_library': string
  'course.lessons_in_domain': string
  'course.min': string
  'course.key_concepts': string
  'course.exam_tips': string
  'course.quick_actions': string
  'course.practice_domain': string
  'course.view_mindmap': string
  'course.ask_tutor': string
  'course.what_learn': string
  'course.all_domains': string
  'course.min_total': string
  'course.deep_dive_topics': string
  'course.pitfalls': string
  'course.overview': string
  'course.click_deeper': string
  'course.deep_dive': string
  'course.exam_tips_section': string
  'course.rita_insight': string
  'course.common_pitfalls': string
  'course.lesson_of': string
  'course.go_deeper_cta': string
  'course.learning_outcomes': string

  // ── Practice Page ──
  'practice.locked_title': string
  'practice.locked_desc': string
  'practice.upgrade': string
  'practice.adaptive_engine': string
  'practice.choose_framework': string
  'practice.choose_difficulty': string
  'practice.filter_domain': string
  'practice.start_session': string
  'practice.entry': string
  'practice.entry_desc': string
  'practice.paced': string
  'practice.paced_desc': string
  'practice.difficult': string
  'practice.difficult_desc': string
  'practice.challenging': string
  'practice.challenging_desc': string
  'practice.all_domains': string
  'practice.people': string
  'practice.process': string
  'practice.business': string
  'practice.questions_per_block': string

  // ── Study Studio ──
  'studio.title': string
  'studio.subtitle': string
  'studio.notes': string
  'studio.audio': string
  'studio.flashcards': string
  'studio.quiz': string
  'studio.new_note': string
  'studio.topic_placeholder': string
  'studio.note_placeholder': string
  'studio.tags_placeholder': string
  'studio.save_note': string
  'studio.saved_notes': string

  // ── Go Deeper Panel ──
  'deeper.go_deeper': string
  'deeper.loading': string
  'deeper.followup_placeholder': string
  'deeper.ask': string
  'deeper.collapse': string

  // ── Receipt ──
  'receipt.title': string
  'receipt.billed_to': string
  'receipt.from': string
  'receipt.description': string
  'receipt.period': string
  'receipt.amount': string
  'receipt.total': string
  'receipt.payment_details': string
  'receipt.payment_method': string
  'receipt.date': string
  'receipt.included': string
}

const en: TranslationKeys = {
  // Auth
  'auth.welcome_back': 'Welcome back',
  'auth.sign_in_continue': 'Sign in to continue your PMP prep',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.sign_in': 'Sign In',
  'auth.signing_in': 'Signing in...',
  'auth.no_account': "Don't have an account?",
  'auth.sign_up_free': 'Sign up free',
  'auth.continue_google': 'Continue with Google',
  'auth.or': 'or',
  'auth.forgot_password': 'Forgot password?',
  'auth.select_language': 'Select Language',
  'auth.create_account': 'Create your account',
  'auth.start_journey': 'Start your PMP exam preparation journey',
  'auth.full_name': 'Full Name',
  'auth.sign_up': 'Create Account',
  'auth.signing_up': 'Creating account...',
  'auth.have_account': 'Already have an account?',
  'auth.sign_in_link': 'Sign in',

  // Nav
  'nav.learning': 'Learning',
  'nav.tools': 'PMP Toolkit',
  'nav.progress': 'Progress',
  'nav.account': 'Account',
  'nav.dashboard': 'Dashboard',
  'nav.today': 'Today',
  'nav.mindmap': 'Mind Maps',
  'nav.course': 'Course',
  'nav.pmp_path': 'My PMP Path',
  'nav.study_studio': 'Study Studio',
  'nav.practice': 'Practice',
  'nav.practice_lab': 'Practice Lab',
  'nav.mock_exam': 'Mock Exam',
  'nav.exam_simulator': 'Exam Simulator',
  'nav.tutor': 'Zane',
  'nav.ai_coach': 'Zane',
  'nav.formulas': 'Formulas',
  'nav.processes': 'Processes',
  'nav.artifacts': 'Artifacts',
  'nav.billing': 'Billing',
  'nav.readiness_report': 'Readiness Report',
  'nav.admin': 'Admin',
  'nav.branding': 'Branding',
  'nav.analytics': 'Analytics',
  'nav.media': 'Media Library',
  'nav.resources': 'Resource Library',
  'nav.questions': 'Question Bank',
  'nav.sign_out': 'Sign Out',
  'nav.upgrade': '⭐ Upgrade to Premium',

  // Dashboard
  'dashboard.title': 'Dashboard',
  'dashboard.welcome': 'Welcome back',
  'dashboard.readiness': 'Readiness Score',
  'dashboard.accuracy': 'Accuracy',
  'dashboard.study_streak': 'Study Streak',
  'dashboard.questions_practiced': 'Questions Practiced',

  // Practice
  'practice.title': 'Practice Engine',
  'practice.start': 'Start Practice',
  'practice.next': 'Next Question',
  'practice.submit': 'Submit Answer',
  'practice.correct': 'Correct!',
  'practice.incorrect': 'Incorrect',
  'practice.score': 'Score',
  'practice.explanation': 'Explanation',
  'practice.continue': 'Continue',
  'practice.finish': 'Finish',
  'practice.questions_remaining': 'questions remaining',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Something went wrong',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.close': 'Close',
  'common.search': 'Search',
  'common.all': 'All',
  'common.print_pdf': '🖨️ Print / PDF',
  'common.deep_dive': '🤖 Deep Dive with Zane',
  'common.exam_tip': '🎯 Exam Tip',
  'common.back_dashboard': '← Dashboard',

  // Companion
  'companion.title': 'PMP Companion',
  'companion.subtitle': 'Quick help · Formulas · Artifacts · Tips',
  'companion.placeholder': 'Ask me anything about PMP...',
  'companion.quick_actions': 'Quick Actions',
  'companion.clear': 'Clear',
  'companion.footer': 'Quick answers · For detailed help, use',

  // Formulas
  'formulas.title': '📐 PMP Formulas',
  'formulas.subtitle': 'essential formulas · Exam scenarios · Rita\'s techniques',
  'formulas.search_placeholder': 'Search formulas... (e.g., CPI, earned value, variance)',
  'formulas.variables': '📌 Variables',
  'formulas.when_to_use': '🎯 When to Use on the Exam',
  'formulas.example': '📝 Example Calculation',
  'formulas.exam_scenario': '📋 Exam Scenario',
  'formulas.confusion_alert': '⚠️ Don\'t Confuse With',
  'formulas.rita_tip': 'Rita\'s Tip',

  // Artifacts
  'artifacts.title': '📋 PMP Artifacts',
  'artifacts.subtitle': 'key artifacts · What they are · When to use · Exam tips',
  'artifacts.search_placeholder': 'Search artifacts... (e.g., charter, WBS, risk register)',
  'artifacts.created_by': '👤 Created By',
  'artifacts.when_used': '⏰ When Used',
  'artifacts.key_purpose': '🎯 Key Purpose',
  'artifacts.related': '🔗 Related Artifacts',

  // Processes
  'processes.title': '🔄 Process Relationships',
  'processes.subtitle': 'Interactive map of how PMP processes connect and flow',
  'processes.flow_title': 'Process Group Flow',
  'processes.ka_title': 'Knowledge Areas',
  'processes.matrix_title': 'Process Group × Knowledge Area Matrix',
  'processes.key_activities': '📌 Key Activities',
  'processes.key_outputs': '📤 Key Outputs',

  // Pricing
  'pricing.title': 'Invest in Your PMP Success',
  'pricing.subtitle': 'Join thousands of professionals who passed their PMP exam with our AI-powered preparation platform. Cancel anytime.',
  'pricing.monthly': 'Monthly',
  'pricing.annual': 'Annual',
  'pricing.get_plan': 'Get',
  'pricing.most_popular': 'Most Popular',


  // Course Library
  'course.library_title': 'PMP Course Library',
  'course.library_desc': 'Master all 8 PMBOK 7 Performance Domains through structured lessons, exam tips, and Rita Mulcahy insights.',
  'course.perf_domains': 'Performance Domains',
  'course.total_lessons': 'Total Lessons',
  'course.avg_per_lesson': 'Avg. per Lesson',
  'course.practice_ctas': 'Practice CTAs',
  'course.every_lesson': 'Every lesson',
  'course.domain': 'Domain',
  'course.lessons': 'lessons',
  'course.lessons_label': 'Lessons',
  'course.practice_label': 'Practice',
  'course.mindmap_label': 'Mind Map',
  'course.start': 'Start',
  'course.course_library': 'Course Library',
  'course.lessons_in_domain': 'Lessons in this Domain',
  'course.min': 'min',
  'course.key_concepts': 'key concepts',
  'course.exam_tips': 'exam tips',
  'course.quick_actions': 'Quick Actions',
  'course.practice_domain': 'Practice This Domain',
  'course.view_mindmap': 'View Mind Map',
  'course.ask_tutor': 'Ask Zane',
  'course.what_learn': "What You'll Learn",
  'course.all_domains': 'All Domains',
  'course.min_total': 'min total',
  'course.deep_dive_topics': 'deep dive topics',
  'course.pitfalls': 'pitfalls to avoid',
  'course.overview': 'Overview',
  'course.click_deeper': 'Click any card to go deeper',
  'course.deep_dive': 'Deep Dive',
  'course.exam_tips_section': 'Exam Tips',
  'course.rita_insight': "Rita Mulcahy's Insight",
  'course.common_pitfalls': 'Common Pitfalls',
  'course.lesson_of': 'Lesson',
  'course.go_deeper_cta': 'Click Go Deeper on any section for AI-powered analysis, case studies & more',
  'course.learning_outcomes': 'Learning Outcomes',

  // Practice Page
  'practice.locked_title': 'Practice Question Bank',
  'practice.locked_desc': 'Unlock domain-filtered practice questions with detailed explanations.',
  'practice.upgrade': 'Upgrade to Premium',
  'practice.adaptive_engine': 'Adaptive Learning Engine',
  'practice.choose_framework': 'Choose your framework',
  'practice.choose_difficulty': 'Choose your difficulty level',
  'practice.filter_domain': 'Filter by domain',
  'practice.start_session': 'Start Practice Session',
  'practice.entry': 'Entry',
  'practice.entry_desc': 'Easy — Build your foundation',
  'practice.paced': 'Paced',
  'practice.paced_desc': 'Moderate — Apply your knowledge',
  'practice.difficult': 'Difficult',
  'practice.difficult_desc': 'Real exam-style questions',
  'practice.challenging': 'Challenging',
  'practice.challenging_desc': 'Professional level mastery',
  'practice.all_domains': 'All Domains',
  'practice.people': 'People',
  'practice.process': 'Process',
  'practice.business': 'Business Environment',
  'practice.questions_per_block': 'questions per block',

  // Study Studio
  'studio.title': 'Study Studio',
  'studio.subtitle': 'Your personal learning workspace — take notes, listen, review flashcards, and test yourself.',
  'studio.notes': 'Notes',
  'studio.audio': 'Audio',
  'studio.flashcards': 'Flashcards',
  'studio.quiz': 'Quick Quiz',
  'studio.new_note': 'New Study Note',
  'studio.topic_placeholder': 'Topic (e.g., Risk Management)',
  'studio.note_placeholder': 'Write your notes here... Markdown supported.',
  'studio.tags_placeholder': 'Tags (comma separated)',
  'studio.save_note': 'Save Note',
  'studio.saved_notes': 'Saved Notes',

  // Go Deeper Panel
  'deeper.go_deeper': 'Go Deeper',
  'deeper.loading': 'Generating deep analysis...',
  'deeper.followup_placeholder': 'Ask a follow-up question...',
  'deeper.ask': 'Ask',
  'deeper.collapse': 'Collapse',

  // Receipt
  'receipt.title': 'Payment Receipt',
  'receipt.billed_to': 'Billed To',
  'receipt.from': 'From',
  'receipt.description': 'Description',
  'receipt.period': 'Period',
  'receipt.amount': 'Amount',
  'receipt.total': 'Total Paid',
  'receipt.payment_details': 'Transaction Details',
  'receipt.payment_method': 'Payment Method',
  'receipt.date': 'Date & Time',
  'receipt.included': 'Your Plan Includes',
}

const ar: TranslationKeys = {
  // Auth
  'auth.welcome_back': 'مرحباً بعودتك',
  'auth.sign_in_continue': 'سجل الدخول لمتابعة تحضيرك لاختبار PMP',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.sign_in': 'تسجيل الدخول',
  'auth.signing_in': 'جارِ تسجيل الدخول...',
  'auth.no_account': 'ليس لديك حساب؟',
  'auth.sign_up_free': 'سجل مجاناً',
  'auth.continue_google': 'المتابعة مع Google',
  'auth.or': 'أو',
  'auth.forgot_password': 'نسيت كلمة المرور؟',
  'auth.select_language': 'اختر اللغة',
  'auth.create_account': 'أنشئ حسابك',
  'auth.start_journey': 'ابدأ رحلتك للتحضير لاختبار PMP',
  'auth.full_name': 'الاسم الكامل',
  'auth.sign_up': 'إنشاء الحساب',
  'auth.signing_up': 'جارِ إنشاء الحساب...',
  'auth.have_account': 'لديك حساب بالفعل؟',
  'auth.sign_in_link': 'تسجيل الدخول',

  // Nav
  'nav.learning': 'التعلم',
  'nav.tools': 'أدوات PMP',
  'nav.progress': 'التقدم',
  'nav.account': 'الحساب',
  'nav.dashboard': 'لوحة التحكم',
  'nav.today': 'اليوم',
  'nav.mindmap': 'الخرائط الذهنية',
  'nav.course': 'الدورة',
  'nav.pmp_path': 'مساري في PMP',
  'nav.study_studio': 'استوديو الدراسة',
  'nav.practice': 'التمرين',
  'nav.practice_lab': 'مختبر التمرين',
  'nav.mock_exam': 'اختبار تجريبي',
  'nav.exam_simulator': 'محاكي الاختبار',
  'nav.tutor': 'Zane',
  'nav.ai_coach': 'Zane',
  'nav.formulas': 'المعادلات',
  'nav.processes': 'العمليات',
  'nav.artifacts': 'المخرجات',
  'nav.billing': 'الفواتير',
  'nav.readiness_report': 'تقرير الجاهزية',
  'nav.admin': 'الإدارة',
  'nav.branding': 'العلامة التجارية',
  'nav.analytics': 'التحليلات',
  'nav.media': 'مكتبة الوسائط',
  'nav.resources': 'مكتبة المصادر',
  'nav.questions': 'بنك الأسئلة',
  'nav.sign_out': 'تسجيل الخروج',
  'nav.upgrade': '⭐ ترقية إلى بريميوم',

  // Dashboard
  'dashboard.title': 'لوحة التحكم',
  'dashboard.welcome': 'مرحباً بعودتك',
  'dashboard.readiness': 'مؤشر الجاهزية',
  'dashboard.accuracy': 'الدقة',
  'dashboard.study_streak': 'سلسلة الدراسة',
  'dashboard.questions_practiced': 'الأسئلة المحلولة',

  // Practice
  'practice.title': 'محرك التمرين',
  'practice.start': 'ابدأ التمرين',
  'practice.next': 'السؤال التالي',
  'practice.submit': 'إرسال الإجابة',
  'practice.correct': 'صحيح!',
  'practice.incorrect': 'خطأ',
  'practice.score': 'النتيجة',
  'practice.explanation': 'الشرح',
  'practice.continue': 'متابعة',
  'practice.finish': 'إنهاء',
  'practice.questions_remaining': 'أسئلة متبقية',

  // Common
  'common.loading': 'جارِ التحميل...',
  'common.error': 'حدث خطأ ما',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.back': 'رجوع',
  'common.next': 'التالي',
  'common.close': 'إغلاق',
  'common.search': 'بحث',
  'common.all': 'الكل',
  'common.print_pdf': '🖨️ طباعة / PDF',
  'common.deep_dive': '🤖 تعمق في Zane',
  'common.exam_tip': '🎯 نصيحة للاختبار',
  'common.back_dashboard': '← لوحة التحكم',

  // Companion
  'companion.title': 'مرافق PMP',
  'companion.subtitle': 'مساعدة سريعة · المعادلات · المخرجات · نصائح',
  'companion.placeholder': 'اسألني أي شيء عن PMP...',
  'companion.quick_actions': 'إجراءات سريعة',
  'companion.clear': 'مسح',
  'companion.footer': 'إجابات سريعة · للمساعدة التفصيلية، استخدم',

  // Formulas
  'formulas.title': '📐 معادلات PMP',
  'formulas.subtitle': 'معادلات أساسية · سيناريوهات الاختبار · تقنيات ريتا',
  'formulas.search_placeholder': 'ابحث عن معادلة... (مثال: CPI، القيمة المكتسبة، التباين)',
  'formulas.variables': '📌 المتغيرات',
  'formulas.when_to_use': '🎯 متى تُستخدم في الاختبار',
  'formulas.example': '📝 مثال حسابي',
  'formulas.exam_scenario': '📋 سيناريو الاختبار',
  'formulas.confusion_alert': '⚠️ لا تخلط مع',
  'formulas.rita_tip': 'نصيحة ريتا',

  // Artifacts
  'artifacts.title': '📋 مخرجات PMP',
  'artifacts.subtitle': 'مخرجات رئيسية · ماهيتها · متى تُستخدم · نصائح الاختبار',
  'artifacts.search_placeholder': 'ابحث عن مخرج... (مثال: الميثاق، WBS، سجل المخاطر)',
  'artifacts.created_by': '👤 أنشئ بواسطة',
  'artifacts.when_used': '⏰ متى يُستخدم',
  'artifacts.key_purpose': '🎯 الغرض الرئيسي',
  'artifacts.related': '🔗 مخرجات ذات صلة',

  // Processes
  'processes.title': '🔄 علاقات العمليات',
  'processes.subtitle': 'خريطة تفاعلية لكيفية ارتباط عمليات PMP وتدفقها',
  'processes.flow_title': 'تدفق مجموعات العمليات',
  'processes.ka_title': 'مجالات المعرفة',
  'processes.matrix_title': 'مصفوفة مجموعات العمليات × مجالات المعرفة',
  'processes.key_activities': '📌 الأنشطة الرئيسية',
  'processes.key_outputs': '📤 المخرجات الرئيسية',

  // Pricing
  'pricing.title': 'استثمر في نجاحك في PMP',
  'pricing.subtitle': 'انضم إلى آلاف المحترفين الذين اجتازوا اختبار PMP مع منصتنا المدعومة بالذكاء الاصطناعي. إلغاء في أي وقت.',
  'pricing.monthly': 'شهري',
  'pricing.annual': 'سنوي',
  'pricing.get_plan': 'اشترك في',
  'pricing.most_popular': 'الأكثر شعبية',


  // Course Library
  'course.library_title': 'مكتبة دورات PMP',
  'course.library_desc': 'أتقن جميع مجالات الأداء الثمانية في PMBOK 7 من خلال دروس منظمة ونصائح للاختبار ورؤى ريتا مولكاهي.',
  'course.perf_domains': 'مجالات الأداء',
  'course.total_lessons': 'إجمالي الدروس',
  'course.avg_per_lesson': 'المعدل لكل درس',
  'course.practice_ctas': 'تمارين عملية',
  'course.every_lesson': 'كل درس',
  'course.domain': 'المجال',
  'course.lessons': 'دروس',
  'course.lessons_label': 'الدروس',
  'course.practice_label': 'التمرين',
  'course.mindmap_label': 'الخريطة الذهنية',
  'course.start': 'ابدأ',
  'course.course_library': 'مكتبة الدورات',
  'course.lessons_in_domain': 'الدروس في هذا المجال',
  'course.min': 'دقيقة',
  'course.key_concepts': 'مفاهيم رئيسية',
  'course.exam_tips': 'نصائح للاختبار',
  'course.quick_actions': 'إجراءات سريعة',
  'course.practice_domain': 'تمرين هذا المجال',
  'course.view_mindmap': 'عرض الخريطة الذهنية',
  'course.ask_tutor': 'اسأل Zane',
  'course.what_learn': 'ماذا ستتعلم',
  'course.all_domains': 'جميع المجالات',
  'course.min_total': 'دقيقة إجمالي',
  'course.deep_dive_topics': 'موضوعات معمقة',
  'course.pitfalls': 'أخطاء يجب تجنبها',
  'course.overview': 'نظرة عامة',
  'course.click_deeper': 'انقر على أي بطاقة للتعمق أكثر',
  'course.deep_dive': 'تعمق',
  'course.exam_tips_section': 'نصائح الاختبار',
  'course.rita_insight': 'رؤية ريتا مولكاهي',
  'course.common_pitfalls': 'الأخطاء الشائعة',
  'course.lesson_of': 'الدرس',
  'course.go_deeper_cta': 'انقر على تعمق أكثر في أي قسم للحصول على تحليل بالذكاء الاصطناعي ودراسات حالة والمزيد',
  'course.learning_outcomes': 'مخرجات التعلم',

  // Practice Page
  'practice.locked_title': 'بنك أسئلة التمرين',
  'practice.locked_desc': 'افتح أسئلة التمرين المصنفة حسب المجال مع شروحات مفصلة.',
  'practice.upgrade': 'ترقية إلى بريميوم',
  'practice.adaptive_engine': 'محرك التعلم التكيفي',
  'practice.choose_framework': 'اختر إطار العمل',
  'practice.choose_difficulty': 'اختر مستوى الصعوبة',
  'practice.filter_domain': 'تصفية حسب المجال',
  'practice.start_session': 'ابدأ جلسة التمرين',
  'practice.entry': 'مبتدئ',
  'practice.entry_desc': 'سهل — ابنِ أساسك',
  'practice.paced': 'متدرج',
  'practice.paced_desc': 'متوسط — طبّق معرفتك',
  'practice.difficult': 'صعب',
  'practice.difficult_desc': 'أسئلة بأسلوب الاختبار الحقيقي',
  'practice.challenging': 'تحدي',
  'practice.challenging_desc': 'إتقان المستوى المهني',
  'practice.all_domains': 'جميع المجالات',
  'practice.people': 'الأشخاص',
  'practice.process': 'العمليات',
  'practice.business': 'بيئة الأعمال',
  'practice.questions_per_block': 'أسئلة لكل مجموعة',

  // Study Studio
  'studio.title': 'استوديو الدراسة',
  'studio.subtitle': 'مساحة التعلم الشخصية — دوّن ملاحظاتك، استمع، راجع البطاقات التعليمية، واختبر نفسك.',
  'studio.notes': 'الملاحظات',
  'studio.audio': 'الصوت',
  'studio.flashcards': 'البطاقات التعليمية',
  'studio.quiz': 'اختبار سريع',
  'studio.new_note': 'ملاحظة دراسية جديدة',
  'studio.topic_placeholder': 'الموضوع (مثال: إدارة المخاطر)',
  'studio.note_placeholder': 'اكتب ملاحظاتك هنا... يدعم Markdown.',
  'studio.tags_placeholder': 'الوسوم (مفصولة بفاصلة)',
  'studio.save_note': 'حفظ الملاحظة',
  'studio.saved_notes': 'الملاحظات المحفوظة',

  // Go Deeper Panel
  'deeper.go_deeper': 'تعمق أكثر',
  'deeper.loading': 'جارِ إنشاء التحليل المعمق...',
  'deeper.followup_placeholder': 'اطرح سؤال متابعة...',
  'deeper.ask': 'اسأل',
  'deeper.collapse': 'طي',

  // Receipt
  'receipt.title': 'إيصال الدفع',
  'receipt.billed_to': 'مُفوتر إلى',
  'receipt.from': 'من',
  'receipt.description': 'الوصف',
  'receipt.period': 'الفترة',
  'receipt.amount': 'المبلغ',
  'receipt.total': 'المجموع المدفوع',
  'receipt.payment_details': 'تفاصيل المعاملة',
  'receipt.payment_method': 'طريقة الدفع',
  'receipt.date': 'التاريخ والوقت',
  'receipt.included': 'خطتك تشمل',
}

export const translations: Record<Locale, TranslationKeys> = { en, ar }

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale]?.[key] || translations['en'][key] || key
}
