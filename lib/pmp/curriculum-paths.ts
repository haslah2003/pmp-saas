import type { AppLocale, ExamPathId } from '@/lib/pmp/exam-paths'
import { normalizeExamPath } from '@/lib/pmp/exam-paths'

export type LocalizedText = Record<AppLocale, string>

export type DashboardCurriculumModule = {
  id: number
  numberLabel?: string
  title: LocalizedText
  description: LocalizedText
  lessons: number
  hours: number
  color: string
  progress: number
  slug?: string
  tasks?: number
  domain?: LocalizedText
  illustrationId?: number
  emoji?: string
}

export type DashboardCurriculumSection = {
  id: string
  badge: string
  badgeColor: string
  title: LocalizedText
  description: LocalizedText
  modules: DashboardCurriculumModule[]
}

export type DashboardCurriculum = {
  heroTitle: LocalizedText
  heroDescription: LocalizedText
  sections: DashboardCurriculumSection[]
}

const pmbok7Modules: DashboardCurriculumModule[] = [
  {
    id: 1,
    title: {
      en: 'Project Management Foundations',
      ar: 'أساسيات إدارة المشاريع',
      fr: 'Fondements de la gestion de projet',
    },
    description: {
      en: 'PMBOK 7 principles, value delivery systems, and project management concepts.',
      ar: 'مبادئ PMBOK 7، ونظام تسليم القيمة، والمفاهيم الأساسية لإدارة المشاريع.',
      fr: 'Principes du PMBOK 7, système de livraison de valeur et concepts fondamentaux.',
    },
    lessons: 8,
    hours: 3,
    color: '#22c55e',
    progress: 100,
    slug: 'stakeholders',
    illustrationId: 1,
  },
  {
    id: 2,
    title: {
      en: 'Stakeholder Performance Domain',
      ar: 'مجال أداء المعنيين',
      fr: 'Domaine de performance des parties prenantes',
    },
    description: {
      en: 'Stakeholder identification, engagement, and communication strategies.',
      ar: 'تحديد المعنيين، ومشاركتهم، واستراتيجيات التواصل معهم.',
      fr: 'Identification, engagement et communication avec les parties prenantes.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#3b82f6',
    progress: 50,
    slug: 'stakeholders',
    illustrationId: 2,
  },
  {
    id: 3,
    title: {
      en: 'Team Performance Domain',
      ar: 'مجال أداء الفريق',
      fr: 'Domaine de performance de l’équipe',
    },
    description: {
      en: 'Team building, leadership, servant leadership, and conflict management.',
      ar: 'بناء الفريق، والقيادة، والقيادة الخادمة، وإدارة النزاعات.',
      fr: 'Constitution d’équipe, leadership, leadership serviteur et gestion des conflits.',
    },
    lessons: 7,
    hours: 3,
    color: '#8b5cf6',
    progress: 15,
    slug: 'team',
    illustrationId: 3,
  },
  {
    id: 4,
    title: {
      en: 'Development Approach & Life Cycle',
      ar: 'منهج التطوير ودورة الحياة',
      fr: 'Approche de développement et cycle de vie',
    },
    description: {
      en: 'Predictive, adaptive, hybrid approaches and delivery cadence.',
      ar: 'المناهج التنبؤية والمتكيفة والهجينة وإيقاع التسليم.',
      fr: 'Approches prédictives, adaptatives, hybrides et cadence de livraison.',
    },
    lessons: 5,
    hours: 2,
    color: '#10b981',
    progress: 0,
    slug: 'development-approach',
    illustrationId: 4,
  },
  {
    id: 5,
    title: {
      en: 'Planning Performance Domain',
      ar: 'مجال أداء التخطيط',
      fr: 'Domaine de performance de la planification',
    },
    description: {
      en: 'Scope, schedule, cost, resource, and quality planning.',
      ar: 'تخطيط النطاق والجدول الزمني والتكلفة والموارد والجودة.',
      fr: 'Planification du périmètre, de l’échéancier, des coûts, des ressources et de la qualité.',
    },
    lessons: 8,
    hours: 3.5,
    color: '#f59e0b',
    progress: 0,
    slug: 'planning',
    illustrationId: 5,
  },
  {
    id: 6,
    title: {
      en: 'Project Work & Delivery',
      ar: 'عمل المشروع والتسليم',
      fr: 'Travail du projet et livraison',
    },
    description: {
      en: 'Executing project work, procurement, knowledge management, and quality delivery.',
      ar: 'تنفيذ عمل المشروع، والمشتريات، وإدارة المعرفة، وتسليم الجودة.',
      fr: 'Exécution du travail, approvisionnement, gestion des connaissances et livraison de qualité.',
    },
    lessons: 7,
    hours: 3,
    color: '#ef4444',
    progress: 0,
    slug: 'project-work',
    illustrationId: 6,
  },
  {
    id: 7,
    title: {
      en: 'Measurement Performance Domain',
      ar: 'مجال أداء القياس',
      fr: 'Domaine de performance de la mesure',
    },
    description: {
      en: 'KPIs, EVM, forecasting, dashboards, and reporting.',
      ar: 'مؤشرات الأداء، وإدارة القيمة المكتسبة، والتنبؤ، ولوحات المتابعة، والتقارير.',
      fr: 'Indicateurs, valeur acquise, prévisions, tableaux de bord et reporting.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#6366f1',
    progress: 0,
    slug: 'measurement',
    illustrationId: 7,
  },
  {
    id: 8,
    title: {
      en: 'Uncertainty Performance Domain',
      ar: 'مجال أداء عدم التيقن',
      fr: 'Domaine de performance de l’incertitude',
    },
    description: {
      en: 'Risk management, ambiguity, complexity, and resilience.',
      ar: 'إدارة المخاطر، والغموض، والتعقيد، والقدرة على الصمود.',
      fr: 'Gestion des risques, ambiguïté, complexité et résilience.',
    },
    lessons: 5,
    hours: 2,
    color: '#ec4899',
    progress: 0,
    slug: 'uncertainty',
    illustrationId: 8,
  },
]

const eco2021Modules: DashboardCurriculumModule[] = [
  {
    id: 9,
    title: {
      en: 'ECO People Domain',
      ar: 'مجال الأفراد في ECO',
      fr: 'Domaine People de l’ECO',
    },
    description: {
      en: 'All 14 ECO People tasks — conflict, leadership, collaboration, and team building.',
      ar: 'جميع مهام مجال الأفراد الـ 14 في ECO — النزاع، والقيادة، والتعاون، وبناء الفريق.',
      fr: 'Les 14 tâches People de l’ECO : conflit, leadership, collaboration et équipe.',
    },
    lessons: 10,
    hours: 4,
    color: '#14b8a6',
    progress: 0,
    tasks: 14,
    domain: {
      en: 'People — 42%',
      ar: 'الأفراد — 42%',
      fr: 'People — 42%',
    },
    emoji: '👥',
  },
  {
    id: 10,
    title: {
      en: 'ECO Process Domain',
      ar: 'مجال العمليات في ECO',
      fr: 'Domaine Process de l’ECO',
    },
    description: {
      en: 'All 17 ECO Process tasks — scope, schedule, risk, procurement, and stakeholders.',
      ar: 'جميع مهام مجال العمليات الـ 17 في ECO — النطاق، والجدول الزمني، والمخاطر، والمشتريات، والمعنيون.',
      fr: 'Les 17 tâches Process de l’ECO : périmètre, échéancier, risques, achats et parties prenantes.',
    },
    lessons: 12,
    hours: 5,
    color: '#f97316',
    progress: 0,
    tasks: 17,
    domain: {
      en: 'Process — 50%',
      ar: 'العمليات — 50%',
      fr: 'Process — 50%',
    },
    emoji: '⚙️',
  },
  {
    id: 11,
    title: {
      en: 'ECO Business Environment',
      ar: 'مجال بيئة الأعمال في ECO',
      fr: 'Domaine Business Environment de l’ECO',
    },
    description: {
      en: 'All 4 ECO Business tasks — compliance, benefits, external changes, and organizational change.',
      ar: 'جميع مهام بيئة الأعمال الأربع في ECO — الامتثال، والمنافع، والتغيرات الخارجية، والتغيير التنظيمي.',
      fr: 'Les 4 tâches Business Environment : conformité, bénéfices, changements externes et organisationnels.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#a855f7',
    progress: 0,
    tasks: 4,
    domain: {
      en: 'Business — 8%',
      ar: 'بيئة الأعمال — 8%',
      fr: 'Business — 8%',
    },
    emoji: '🌐',
  },
]

const pmbok8ReadinessModules: DashboardCurriculumModule[] = [
  {
    id: 101,
    numberLabel: '1',
    title: {
      en: 'PMP 2026 Exam Orientation',
      ar: 'التوجيه لاختبار PMP 2026',
      fr: 'Orientation examen PMP 2026',
    },
    description: {
      en: 'Understand the new PMP path, exam transition timing, and what your study plan must control.',
      ar: 'فهم مسار PMP الجديد، وتوقيت الانتقال، وما يجب أن تضبطه خطتك الدراسية.',
      fr: 'Comprendre le nouveau parcours PMP, la transition et les points à maîtriser.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#7c3aed',
    progress: 0,
    illustrationId: 1,
  },
  {
    id: 102,
    numberLabel: '2',
    title: {
      en: 'PMBOK 8 Readiness Foundations',
      ar: 'أساسيات الاستعداد لـ PMBOK 8',
      fr: 'Fondements de préparation PMBOK 8',
    },
    description: {
      en: 'Build a controlled bridge from stable PMP concepts into the PMBOK 8 learning route.',
      ar: 'بناء انتقال منظم من مفاهيم PMP المستقرة إلى مسار PMBOK 8.',
      fr: 'Construire une passerelle structurée vers le parcours PMBOK 8.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#2563eb',
    progress: 0,
    illustrationId: 4,
  },
  {
    id: 103,
    numberLabel: '3',
    title: {
      en: 'People, Leadership & Team Performance',
      ar: 'الأفراد والقيادة وأداء الفريق',
      fr: 'Personnes, leadership et performance d’équipe',
    },
    description: {
      en: 'Strengthen leadership judgment, collaboration, stakeholder thinking, and team performance.',
      ar: 'تعزيز الحكم القيادي، والتعاون، والتفكير في المعنيين، وأداء الفريق.',
      fr: 'Renforcer le jugement de leadership, la collaboration et la performance d’équipe.',
    },
    lessons: 8,
    hours: 3,
    color: '#8b5cf6',
    progress: 0,
    illustrationId: 3,
  },
  {
    id: 104,
    numberLabel: '4',
    title: {
      en: 'Delivery Approach & Project Work',
      ar: 'منهج التسليم وعمل المشروع',
      fr: 'Approche de livraison et travail du projet',
    },
    description: {
      en: 'Practice predictive, adaptive, and hybrid decision-making in project delivery scenarios.',
      ar: 'التدرب على اتخاذ القرار في السيناريوهات التنبؤية والمتكيفة والهجينة.',
      fr: 'S’exercer à la décision en contextes prédictifs, adaptatifs et hybrides.',
    },
    lessons: 7,
    hours: 3,
    color: '#10b981',
    progress: 0,
    illustrationId: 6,
  },
  {
    id: 105,
    numberLabel: '5',
    title: {
      en: 'Planning, Measurement & Control',
      ar: 'التخطيط والقياس والتحكم',
      fr: 'Planification, mesure et contrôle',
    },
    description: {
      en: 'Connect planning, baselines, metrics, forecasting, reporting, and decision control.',
      ar: 'ربط التخطيط وخطوط الأساس والمقاييس والتنبؤ والتقارير والتحكم في القرار.',
      fr: 'Relier planification, références, indicateurs, prévisions, reporting et contrôle.',
    },
    lessons: 8,
    hours: 3.5,
    color: '#f59e0b',
    progress: 0,
    illustrationId: 7,
  },
  {
    id: 106,
    numberLabel: '6',
    title: {
      en: 'Uncertainty, Risk & Complexity',
      ar: 'عدم التيقن والمخاطر والتعقيد',
      fr: 'Incertitude, risques et complexité',
    },
    description: {
      en: 'Develop exam judgment for uncertainty, ambiguity, complexity, risks, and responses.',
      ar: 'تطوير الحكم الاختباري في عدم التيقن والغموض والتعقيد والمخاطر والاستجابات.',
      fr: 'Développer le jugement face à l’incertitude, aux risques et à la complexité.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#ec4899',
    progress: 0,
    illustrationId: 8,
  },
  {
    id: 107,
    numberLabel: '7',
    title: {
      en: 'Business Value & Strategic Alignment',
      ar: 'قيمة الأعمال والمواءمة الاستراتيجية',
      fr: 'Valeur métier et alignement stratégique',
    },
    description: {
      en: 'Connect project decisions to value, compliance, benefits, and organizational outcomes.',
      ar: 'ربط قرارات المشروع بالقيمة والامتثال والمنافع والنتائج التنظيمية.',
      fr: 'Relier les décisions projet à la valeur, la conformité et les bénéfices.',
    },
    lessons: 5,
    hours: 2,
    color: '#14b8a6',
    progress: 0,
    illustrationId: 1,
  },
  {
    id: 108,
    numberLabel: '8',
    title: {
      en: 'New Exam Thinking Drills',
      ar: 'تدريبات التفكير للاختبار الجديد',
      fr: 'Entraînement au raisonnement du nouvel examen',
    },
    description: {
      en: 'Train scenario reading, distractor elimination, and adaptive exam reasoning.',
      ar: 'تدريب قراءة السيناريوهات، واستبعاد المشتتات، ومنطق الإجابة التكيفي.',
      fr: 'S’entraîner à lire les scénarios, éliminer les distracteurs et raisonner.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#6366f1',
    progress: 0,
    illustrationId: 5,
  },
]

const eco2026ReadinessModules: DashboardCurriculumModule[] = [
  {
    id: 201,
    numberLabel: 'E1',
    title: {
      en: 'ECO 2026 Readiness Map',
      ar: 'خريطة الاستعداد لـ ECO 2026',
      fr: 'Cartographie de préparation ECO 2026',
    },
    description: {
      en: 'Map your preparation to the new examination content outline without losing stable PMP fundamentals.',
      ar: 'مواءمة التحضير مع مخطط محتوى الاختبار الجديد دون فقدان أساسيات PMP المستقرة.',
      fr: 'Aligner la préparation sur le nouvel ECO sans perdre les fondamentaux PMP.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#7c3aed',
    progress: 0,
    emoji: '🧭',
  },
  {
    id: 202,
    numberLabel: 'E2',
    title: {
      en: 'Scenario-Based Decision Practice',
      ar: 'تدريب القرار المبني على السيناريوهات',
      fr: 'Pratique de décision basée sur scénarios',
    },
    description: {
      en: 'Practice exam decisions across leadership, delivery, uncertainty, and business value contexts.',
      ar: 'التدرب على قرارات الاختبار في القيادة، والتسليم، وعدم التيقن، وقيمة الأعمال.',
      fr: 'Pratiquer les décisions sur leadership, livraison, incertitude et valeur.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#0f766e',
    progress: 0,
    emoji: '🎯',
  },
  {
    id: 203,
    numberLabel: 'E3',
    title: {
      en: 'Readiness & Gap Repair',
      ar: 'الجاهزية ومعالجة الفجوات',
      fr: 'Préparation et correction des lacunes',
    },
    description: {
      en: 'Use diagnostic results to identify what to study next before entering full exam simulation.',
      ar: 'استخدام نتائج التشخيص لتحديد ما يجب دراسته قبل الدخول إلى المحاكاة الكاملة.',
      fr: 'Utiliser le diagnostic pour prioriser l’étude avant la simulation complète.',
    },
    lessons: 5,
    hours: 2,
    color: '#f97316',
    progress: 0,
    emoji: '🛠️',
  },
]

const bridgeModules: DashboardCurriculumModule[] = [
  {
    id: 301,
    numberLabel: 'B1',
    title: {
      en: 'PMBOK 7 Foundations to Keep',
      ar: 'أساسيات PMBOK 7 التي يجب الاحتفاظ بها',
      fr: 'Fondements PMBOK 7 à conserver',
    },
    description: {
      en: 'Protect the stable PMP concepts that remain useful while preparing for the transition.',
      ar: 'ترسيخ مفاهيم PMP المستقرة التي تبقى مفيدة أثناء التحضير للانتقال.',
      fr: 'Conserver les concepts PMP stables utiles pendant la transition.',
    },
    lessons: 5,
    hours: 2,
    color: '#2563eb',
    progress: 0,
    illustrationId: 1,
  },
  {
    id: 302,
    numberLabel: 'B2',
    title: {
      en: 'PMBOK 8 Transition Watchlist',
      ar: 'قائمة متابعة الانتقال إلى PMBOK 8',
      fr: 'Liste de transition vers PMBOK 8',
    },
    description: {
      en: 'Track new, expanded, or re-weighted areas that may affect your PMP preparation plan.',
      ar: 'متابعة المجالات الجديدة أو الموسعة أو المعاد وزنها التي قد تؤثر على خطة التحضير.',
      fr: 'Suivre les zones nouvelles, élargies ou rééquilibrées dans la préparation.',
    },
    lessons: 5,
    hours: 2,
    color: '#7c3aed',
    progress: 0,
    illustrationId: 4,
  },
  {
    id: 303,
    numberLabel: 'B3',
    title: {
      en: 'ECO 2021 → ECO 2026 Comparison',
      ar: 'مقارنة ECO 2021 مع ECO 2026',
      fr: 'Comparaison ECO 2021 → ECO 2026',
    },
    description: {
      en: 'Compare your current exam readiness against the new exam path requirements.',
      ar: 'مقارنة جاهزيتك الحالية مع متطلبات مسار الاختبار الجديد.',
      fr: 'Comparer la préparation actuelle avec les exigences du nouveau parcours.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#0f766e',
    progress: 0,
    emoji: '🔁',
  },
  {
    id: 304,
    numberLabel: 'B4',
    title: {
      en: 'Exam-Date Risk Decision',
      ar: 'قرار مخاطر تاريخ الاختبار',
      fr: 'Décision de risque liée à la date d’examen',
    },
    description: {
      en: 'Decide whether to accelerate for the current exam or shift fully to the new exam route.',
      ar: 'اتخاذ قرار التسريع للاختبار الحالي أو الانتقال الكامل إلى مسار الاختبار الجديد.',
      fr: 'Décider s’il faut accélérer l’examen actuel ou basculer vers le nouveau parcours.',
    },
    lessons: 3,
    hours: 1,
    color: '#f97316',
    progress: 0,
    emoji: '📅',
  },
  {
    id: 305,
    numberLabel: 'B5',
    title: {
      en: 'Targeted Gap Repair',
      ar: 'معالجة الفجوات المستهدفة',
      fr: 'Correction ciblée des lacunes',
    },
    description: {
      en: 'Repair weak areas through focused concept review, scenario drills, and AI coaching.',
      ar: 'معالجة نقاط الضعف عبر مراجعة المفاهيم، وتدريبات السيناريو، والتوجيه الذكي.',
      fr: 'Corriger les lacunes par révision ciblée, scénarios et coaching IA.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#ec4899',
    progress: 0,
    illustrationId: 8,
  },
  {
    id: 306,
    numberLabel: 'B6',
    title: {
      en: 'Bridge Practice Drills',
      ar: 'تدريبات الوضع الانتقالي',
      fr: 'Exercices du mode passerelle',
    },
    description: {
      en: 'Practice mixed questions that test both retained knowledge and transition readiness.',
      ar: 'التدرب على أسئلة مختلطة تختبر المعرفة المستقرة وجاهزية الانتقال.',
      fr: 'S’exercer sur des questions mixtes couvrant acquis et transition.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#6366f1',
    progress: 0,
    emoji: '🧪',
  },
]

const bridgeReadinessModules: DashboardCurriculumModule[] = [
  {
    id: 401,
    numberLabel: 'G1',
    title: {
      en: 'Current Exam Readiness Gate',
      ar: 'بوابة الجاهزية للاختبار الحالي',
      fr: 'Point de contrôle examen actuel',
    },
    description: {
      en: 'Check whether your current PMP readiness is strong enough before the exam transition.',
      ar: 'التحقق مما إذا كانت جاهزيتك الحالية قوية بما يكفي قبل انتقال الاختبار.',
      fr: 'Vérifier la solidité de la préparation avant la transition.',
    },
    lessons: 3,
    hours: 1,
    color: '#2563eb',
    progress: 0,
    emoji: '✅',
  },
  {
    id: 402,
    numberLabel: 'G2',
    title: {
      en: 'New Exam Readiness Gate',
      ar: 'بوابة الجاهزية للاختبار الجديد',
      fr: 'Point de contrôle nouvel examen',
    },
    description: {
      en: 'Confirm whether your study plan is ready for the new PMP path.',
      ar: 'التأكد من أن خطتك الدراسية جاهزة لمسار PMP الجديد.',
      fr: 'Confirmer que le plan d’étude est prêt pour le nouveau parcours PMP.',
    },
    lessons: 3,
    hours: 1,
    color: '#7c3aed',
    progress: 0,
    emoji: '🚦',
  },
  {
    id: 403,
    numberLabel: 'G3',
    title: {
      en: 'AI Coach Next Action',
      ar: 'الإجراء التالي من المدرب الذكي',
      fr: 'Prochaine action du coach IA',
    },
    description: {
      en: 'Prepare for the PMP Exam GPS logic: what is the best next action to pass?',
      ar: 'التمهيد لمنطق بوصلة اختبار PMP: ما أفضل إجراء تالٍ للنجاح؟',
      fr: 'Préparer la logique Exam GPS : quelle est la meilleure prochaine action ?',
    },
    lessons: 3,
    hours: 1,
    color: '#0f766e',
    progress: 0,
    emoji: '🤖',
  },
]

export const DASHBOARD_CURRICULA: Record<ExamPathId, DashboardCurriculum> = {
  pmbok7: {
    heroTitle: {
      en: 'Course',
      ar: 'الدورة',
      fr: 'Cours',
    },
    heroDescription: {
      en: 'PMBOK 7 Performance Domains + ECO 2021 — your complete PMP prep curriculum.',
      ar: 'مجالات أداء PMBOK 7 ومخطط محتوى الاختبار ECO 2021 — منهجك المتكامل للتحضير لاختبار PMP.',
      fr: 'Domaines de performance PMBOK 7 + ECO 2021 — votre parcours complet de préparation PMP.',
    },
    sections: [
      {
        id: 'pmbok7-domains',
        badge: '7',
        badgeColor: '#2563eb',
        title: {
          en: 'PMBOK 7 — Performance Domains',
          ar: 'PMBOK 7 — مجالات أداء المشروع',
          fr: 'PMBOK 7 — Domaines de performance',
        },
        description: {
          en: '8 domains covering the full project management framework',
          ar: 'ثمانية مجالات تغطي الإطار الكامل لإدارة المشاريع',
          fr: '8 domaines couvrant le cadre complet de gestion de projet',
        },
        modules: pmbok7Modules,
      },
      {
        id: 'eco2021',
        badge: 'ECO',
        badgeColor: '#0f766e',
        title: {
          en: 'ECO 2021 — Examination Content Outline',
          ar: 'ECO 2021 — مخطط محتوى الاختبار',
          fr: 'ECO 2021 — Plan du contenu de l’examen',
        },
        description: {
          en: '3 domains · 35 tasks · People 42% · Process 50% · Business 8%',
          ar: '3 مجالات · 35 مهمة · الأفراد 42% · العمليات 50% · بيئة الأعمال 8%',
          fr: '3 domaines · 35 tâches · People 42% · Process 50% · Business 8%',
        },
        modules: eco2021Modules,
      },
    ],
  },
  pmbok8: {
    heroTitle: {
      en: 'New PMP Path',
      ar: 'المسار الجديد لاختبار PMP',
      fr: 'Nouveau parcours PMP',
    },
    heroDescription: {
      en: 'PMBOK 8 + ECO 2026 readiness route for candidates taking the PMP exam on or after 9 July 2026.',
      ar: 'مسار الاستعداد وفق PMBOK 8 وECO 2026 للمرشحين الذين سيجتازون اختبار PMP في 9 يوليو 2026 أو بعده.',
      fr: 'Parcours de préparation PMBOK 8 + ECO 2026 pour les candidats à partir du 9 juillet 2026.',
    },
    sections: [
      {
        id: 'pmbok8-readiness',
        badge: '8',
        badgeColor: '#7c3aed',
        title: {
          en: 'PMBOK 8 — New PMP Path Readiness',
          ar: 'PMBOK 8 — الاستعداد لمسار PMP الجديد',
          fr: 'PMBOK 8 — Préparation au nouveau parcours PMP',
        },
        description: {
          en: 'A controlled learning route for the new PMP exam path.',
          ar: 'مسار تعلم منظم لمسار اختبار PMP الجديد.',
          fr: 'Un parcours structuré pour le nouveau chemin d’examen PMP.',
        },
        modules: pmbok8ReadinessModules,
      },
      {
        id: 'eco2026-readiness',
        badge: '2026',
        badgeColor: '#0f766e',
        title: {
          en: 'ECO 2026 — Readiness Map',
          ar: 'ECO 2026 — خريطة الجاهزية',
          fr: 'ECO 2026 — Cartographie de préparation',
        },
        description: {
          en: 'Prepare for new exam alignment through diagnosis, scenario practice, and gap repair.',
          ar: 'الاستعداد لمواءمة الاختبار الجديد عبر التشخيص، وتدريب السيناريوهات، ومعالجة الفجوات.',
          fr: 'Préparation par diagnostic, scénarios et correction des lacunes.',
        },
        modules: eco2026ReadinessModules,
      },
    ],
  },
  bridge: {
    heroTitle: {
      en: 'Bridge Mode',
      ar: 'الوضع الانتقالي',
      fr: 'Mode passerelle',
    },
    heroDescription: {
      en: 'A transition route for learners managing the shift from PMBOK 7 + ECO 2021 to PMBOK 8 + ECO 2026.',
      ar: 'مسار انتقالي للمتعلمين الذين يديرون الانتقال من PMBOK 7 وECO 2021 إلى PMBOK 8 وECO 2026.',
      fr: 'Parcours de transition de PMBOK 7 + ECO 2021 vers PMBOK 8 + ECO 2026.',
    },
    sections: [
      {
        id: 'bridge-roadmap',
        badge: 'BR',
        badgeColor: '#0f766e',
        title: {
          en: 'Bridge Roadmap — PMBOK 7 → PMBOK 8',
          ar: 'خريطة الانتقال — من PMBOK 7 إلى PMBOK 8',
          fr: 'Feuille de route passerelle — PMBOK 7 → PMBOK 8',
        },
        description: {
          en: 'Protect what remains stable, identify what changes, and control exam-date risk.',
          ar: 'ترسيخ ما يبقى ثابتًا، وتحديد ما يتغير، والتحكم في مخاطر تاريخ الاختبار.',
          fr: 'Préserver les acquis, identifier les changements et contrôler le risque de date.',
        },
        modules: bridgeModules,
      },
      {
        id: 'bridge-readiness-gates',
        badge: 'GPS',
        badgeColor: '#6366f1',
        title: {
          en: 'Readiness Gates — Toward PMP Exam GPS',
          ar: 'بوابات الجاهزية — نحو بوصلة اختبار PMP',
          fr: 'Points de contrôle — vers PMP Exam GPS',
        },
        description: {
          en: 'Start converting the selected path into daily next-action guidance.',
          ar: 'البدء في تحويل المسار المختار إلى توجيه يومي للإجراء التالي.',
          fr: 'Transformer le parcours choisi en prochaines actions quotidiennes.',
        },
        modules: bridgeReadinessModules,
      },
    ],
  },
}

export function getDashboardCurriculum(path: unknown): DashboardCurriculum {
  return DASHBOARD_CURRICULA[normalizeExamPath(path)]
}
