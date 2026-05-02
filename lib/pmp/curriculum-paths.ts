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
    numberLabel: 'P1',
    title: {
      en: 'Adopt a Holistic View',
      ar: 'تبنّي نظرة شمولية',
      fr: 'Adopter une vision holistique',
    },
    description: {
      en: 'Understand the project as an interconnected system across strategy, stakeholders, value, risks, and outcomes.',
      ar: 'فهم المشروع كنظام مترابط يجمع الاستراتيجية والمعنيين والقيمة والمخاطر والنتائج.',
      fr: 'Comprendre le projet comme un système interconnecté entre stratégie, parties prenantes, valeur, risques et résultats.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#7c3aed',
    progress: 0,
    emoji: '🧭',
  },
  {
    id: 102,
    numberLabel: 'P2',
    title: {
      en: 'Focus on Value',
      ar: 'التركيز على القيمة',
      fr: 'Se concentrer sur la valeur',
    },
    description: {
      en: 'Connect project work to intended outcomes, benefits, business objectives, and stakeholder value.',
      ar: 'ربط عمل المشروع بالنتائج والمنافع وأهداف الأعمال والقيمة المتوقعة للمعنيين.',
      fr: 'Relier le travail du projet aux résultats, bénéfices, objectifs métier et valeur pour les parties prenantes.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#14b8a6',
    progress: 0,
    emoji: '💎',
  },
  {
    id: 103,
    numberLabel: 'P3',
    title: {
      en: 'Embed Quality Into Processes and Deliverables',
      ar: 'دمج الجودة في العمليات والمخرجات',
      fr: 'Intégrer la qualité dans les processus et livrables',
    },
    description: {
      en: 'Build quality into how work is performed and how deliverables satisfy stakeholder needs.',
      ar: 'بناء الجودة داخل طريقة تنفيذ العمل وكيفية تلبية المخرجات لاحتياجات المعنيين.',
      fr: 'Intégrer la qualité dans l’exécution du travail et dans la satisfaction des besoins.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#2563eb',
    progress: 0,
    emoji: '✅',
  },
  {
    id: 104,
    numberLabel: 'P4',
    title: {
      en: 'Be an Accountable Leader',
      ar: 'كن قائدًا مسؤولًا',
      fr: 'Être un leader responsable',
    },
    description: {
      en: 'Lead with accountability, judgment, ethics, communication, and ownership of project outcomes.',
      ar: 'القيادة بالمسؤولية والحكم المهني والأخلاقيات والتواصل وتحمل نتائج المشروع.',
      fr: 'Diriger avec responsabilité, jugement, éthique, communication et appropriation des résultats.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#8b5cf6',
    progress: 0,
    emoji: '🧑‍💼',
  },
  {
    id: 105,
    numberLabel: 'P5',
    title: {
      en: 'Integrate Sustainability Within All Project Areas',
      ar: 'دمج الاستدامة في جميع مجالات المشروع',
      fr: 'Intégrer la durabilité dans tous les domaines du projet',
    },
    description: {
      en: 'Consider environmental, social, economic, and long-term impacts across project decisions.',
      ar: 'مراعاة الآثار البيئية والاجتماعية والاقتصادية وطويلة المدى في قرارات المشروع.',
      fr: 'Prendre en compte les impacts environnementaux, sociaux, économiques et à long terme.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#22c55e',
    progress: 0,
    emoji: '🌱',
  },
  {
    id: 106,
    numberLabel: 'P6',
    title: {
      en: 'Build an Empowered Culture',
      ar: 'بناء ثقافة تمكين',
      fr: 'Construire une culture d’autonomisation',
    },
    description: {
      en: 'Create a culture where teams collaborate, learn, self-improve, and take ownership of delivery.',
      ar: 'بناء ثقافة يتعاون فيها الفريق ويتعلم ويتحسن ذاتيًا ويتحمل مسؤولية التسليم.',
      fr: 'Créer une culture de collaboration, d’apprentissage, d’amélioration et de responsabilisation.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#f97316',
    progress: 0,
    emoji: '🤝',
  },
]

const pmbok8FocusAreaModules: DashboardCurriculumModule[] = [
  {
    id: 151,
    numberLabel: 'F1',
    title: { en: 'Initiating Focus Area', ar: 'مجال التركيز: البدء', fr: 'Domaine d’attention : lancement' },
    description: {
      en: 'Clarify the project purpose, authorization, early alignment, and strategic context.',
      ar: 'توضيح غرض المشروع واعتماده والمواءمة المبكرة والسياق الاستراتيجي.',
      fr: 'Clarifier l’objectif, l’autorisation, l’alignement initial et le contexte stratégique.',
    },
    lessons: 4,
    hours: 1.5,
    color: '#7c3aed',
    progress: 0,
    emoji: '🚦',
  },
  {
    id: 152,
    numberLabel: 'F2',
    title: { en: 'Planning Focus Area', ar: 'مجال التركيز: التخطيط', fr: 'Domaine d’attention : planification' },
    description: {
      en: 'Plan the work, delivery approach, baselines, resources, risks, quality, and governance needs.',
      ar: 'تخطيط العمل ومنهج التسليم وخطوط الأساس والموارد والمخاطر والجودة والحوكمة.',
      fr: 'Planifier le travail, l’approche de livraison, les références, ressources, risques, qualité et gouvernance.',
    },
    lessons: 5,
    hours: 2,
    color: '#f59e0b',
    progress: 0,
    emoji: '🗺️',
  },
  {
    id: 153,
    numberLabel: 'F3',
    title: { en: 'Executing Focus Area', ar: 'مجال التركيز: التنفيذ', fr: 'Domaine d’attention : exécution' },
    description: {
      en: 'Coordinate people, work, knowledge, quality, communication, and delivery execution.',
      ar: 'تنسيق الأفراد والعمل والمعرفة والجودة والتواصل وتنفيذ التسليم.',
      fr: 'Coordonner les personnes, le travail, la connaissance, la qualité, la communication et l’exécution.',
    },
    lessons: 5,
    hours: 2,
    color: '#10b981',
    progress: 0,
    emoji: '⚙️',
  },
  {
    id: 154,
    numberLabel: 'F4',
    title: { en: 'Monitoring and Controlling Focus Area', ar: 'مجال التركيز: المراقبة والتحكم', fr: 'Domaine d’attention : suivi et maîtrise' },
    description: {
      en: 'Track performance, analyze variation, manage changes, and support decision control.',
      ar: 'تتبع الأداء وتحليل الانحرافات وإدارة التغييرات ودعم التحكم في القرار.',
      fr: 'Suivre la performance, analyser les écarts, gérer les changements et soutenir les décisions.',
    },
    lessons: 5,
    hours: 2,
    color: '#6366f1',
    progress: 0,
    emoji: '📊',
  },
  {
    id: 155,
    numberLabel: 'F5',
    title: { en: 'Closing Focus Area', ar: 'مجال التركيز: الإغلاق', fr: 'Domaine d’attention : clôture' },
    description: {
      en: 'Confirm completion, transition outcomes, capture lessons, and close the project or phase.',
      ar: 'تأكيد الإنجاز ونقل النتائج وتوثيق الدروس المستفادة وإغلاق المشروع أو المرحلة.',
      fr: 'Confirmer l’achèvement, transférer les résultats, capitaliser les leçons et clôturer.',
    },
    lessons: 3,
    hours: 1,
    color: '#ec4899',
    progress: 0,
    emoji: '🏁',
  },
]

const pmbok8PerformanceDomainModules: DashboardCurriculumModule[] = [
  {
    id: 201,
    numberLabel: 'D1',
    title: { en: 'Governance Performance Domain', ar: 'مجال أداء الحوكمة', fr: 'Domaine de performance de la gouvernance' },
    description: {
      en: 'Project governance, value creation, alignment, decision rights, controls, and accountability.',
      ar: 'حوكمة المشروع، وخلق القيمة، والمواءمة، وصلاحيات القرار، والضوابط، والمساءلة.',
      fr: 'Gouvernance, création de valeur, alignement, droits de décision, contrôles et responsabilité.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#7c3aed',
    progress: 0,
    emoji: '🏛️',
  },
  {
    id: 202,
    numberLabel: 'D2',
    title: { en: 'Scope Performance Domain', ar: 'مجال أداء النطاق', fr: 'Domaine de performance du périmètre' },
    description: {
      en: 'Scope definition, requirements, quality alignment, validation, and value-focused control.',
      ar: 'تعريف النطاق، والمتطلبات، ومواءمة الجودة، والتحقق، والتحكم المرتبط بالقيمة.',
      fr: 'Définition du périmètre, exigences, qualité, validation et maîtrise orientée valeur.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#2563eb',
    progress: 0,
    emoji: '📐',
  },
  {
    id: 203,
    numberLabel: 'D3',
    title: { en: 'Schedule Performance Domain', ar: 'مجال أداء الجدول الزمني', fr: 'Domaine de performance de l’échéancier' },
    description: {
      en: 'Schedule planning, sequencing, estimation, baselines, progress analysis, and adaptation.',
      ar: 'تخطيط الجدول، وترتيب الأنشطة، والتقدير، وخطوط الأساس، وتحليل التقدم، والتكيف.',
      fr: 'Planification, séquencement, estimation, références, analyse d’avancement et adaptation.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#f59e0b',
    progress: 0,
    emoji: '📅',
  },
  {
    id: 204,
    numberLabel: 'D4',
    title: { en: 'Finance Performance Domain', ar: 'مجال أداء المالية', fr: 'Domaine de performance financière' },
    description: {
      en: 'Financial planning, cost estimating, budgeting, reserves, funding, and financial control.',
      ar: 'التخطيط المالي، وتقدير التكلفة، والميزانية، والاحتياطيات، والتمويل، والتحكم المالي.',
      fr: 'Planification financière, estimation des coûts, budget, réserves, financement et maîtrise.',
    },
    lessons: 5,
    hours: 2,
    color: '#f97316',
    progress: 0,
    emoji: '💰',
  },
  {
    id: 205,
    numberLabel: 'D5',
    title: { en: 'Stakeholders Performance Domain', ar: 'مجال أداء المعنيين', fr: 'Domaine de performance des parties prenantes' },
    description: {
      en: 'Stakeholder identification, engagement, communications, expectations, trust, and influence.',
      ar: 'تحديد المعنيين، وإشراكهم، والتواصل، وإدارة التوقعات، وبناء الثقة والتأثير.',
      fr: 'Identification, engagement, communication, attentes, confiance et influence.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#14b8a6',
    progress: 0,
    emoji: '👥',
  },
  {
    id: 206,
    numberLabel: 'D6',
    title: { en: 'Resources Performance Domain', ar: 'مجال أداء الموارد', fr: 'Domaine de performance des ressources' },
    description: {
      en: 'Resource planning, acquisition, optimization, team leadership, capability, and collaboration.',
      ar: 'تخطيط الموارد، والحصول عليها، وتحسين استخدامها، وقيادة الفريق، وبناء القدرات والتعاون.',
      fr: 'Planification, acquisition, optimisation, leadership d’équipe, compétences et collaboration.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#10b981',
    progress: 0,
    emoji: '🧩',
  },
  {
    id: 207,
    numberLabel: 'D7',
    title: { en: 'Risk Performance Domain', ar: 'مجال أداء المخاطر', fr: 'Domaine de performance des risques' },
    description: {
      en: 'Risk identification, analysis, responses, monitoring, uncertainty, and opportunity management.',
      ar: 'تحديد المخاطر، وتحليلها، والاستجابة لها، ومراقبتها، وإدارة عدم اليقين والفرص.',
      fr: 'Identification, analyse, réponses, suivi, incertitude et opportunités.',
    },
    lessons: 6,
    hours: 2.5,
    color: '#ec4899',
    progress: 0,
    emoji: '🎯',
  },
]

const eco2026ReadinessModules: DashboardCurriculumModule[] = [
  {
    id: 251,
    numberLabel: '33%',
    title: {
      en: 'People Domain',
      ar: 'مجال الأفراد',
      fr: 'Domaine People',
    },
    description: {
      en: 'ECO 2026 people responsibilities: vision, conflict, team leadership, stakeholders, expectations, knowledge transfer, and communication.',
      ar: 'مسؤوليات مجال الأفراد في ECO 2026: الرؤية، والنزاع، وقيادة الفريق، والمعنيون، والتوقعات، ونقل المعرفة، والتواصل.',
      fr: 'Responsabilités People ECO 2026 : vision, conflits, leadership, parties prenantes, attentes, transfert de connaissances et communication.',
    },
    lessons: 8,
    hours: 3,
    color: '#14b8a6',
    progress: 0,
    tasks: 8,
    domain: { en: 'People — 33%', ar: 'الأفراد — 33%', fr: 'People — 33%' },
    emoji: '👥',
  },
  {
    id: 252,
    numberLabel: '41%',
    title: {
      en: 'Process Domain',
      ar: 'مجال العمليات',
      fr: 'Domaine Process',
    },
    description: {
      en: 'ECO 2026 process responsibilities: integrated planning, scope, value delivery, resources, procurement, finance, quality, schedule, status, and closure.',
      ar: 'مسؤوليات مجال العمليات في ECO 2026: التخطيط المتكامل، والنطاق، وتسليم القيمة، والموارد، والمشتريات، والمالية، والجودة، والجدول، والحالة، والإغلاق.',
      fr: 'Responsabilités Process ECO 2026 : planification intégrée, périmètre, valeur, ressources, achats, finance, qualité, échéancier, statut et clôture.',
    },
    lessons: 10,
    hours: 4,
    color: '#f97316',
    progress: 0,
    tasks: 10,
    domain: { en: 'Process — 41%', ar: 'العمليات — 41%', fr: 'Process — 41%' },
    emoji: '⚙️',
  },
  {
    id: 253,
    numberLabel: '26%',
    title: {
      en: 'Business Environment Domain',
      ar: 'مجال بيئة الأعمال',
      fr: 'Domaine Business Environment',
    },
    description: {
      en: 'ECO 2026 business environment responsibilities: governance, compliance, change control, impediments, risk, improvement, organizational change, and external changes.',
      ar: 'مسؤوليات بيئة الأعمال في ECO 2026: الحوكمة، والامتثال، والتحكم في التغيير، والمعوقات، والمخاطر، والتحسين، والتغيير التنظيمي، والتغيرات الخارجية.',
      fr: 'Responsabilités Business Environment ECO 2026 : gouvernance, conformité, changements, obstacles, risques, amélioration, changement organisationnel et environnement externe.',
    },
    lessons: 8,
    hours: 3,
    color: '#a855f7',
    progress: 0,
    tasks: 8,
    domain: { en: 'Business Environment — 26%', ar: 'بيئة الأعمال — 26%', fr: 'Business Environment — 26%' },
    emoji: '🌐',
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
        id: 'pmbok8-principles',
        badge: '6',
        badgeColor: '#7c3aed',
        title: {
          en: 'PMBOK 8 — Project Management Principles',
          ar: 'PMBOK 8 — مبادئ إدارة المشاريع',
          fr: 'PMBOK 8 — Principes de gestion de projet',
        },
        description: {
          en: 'Six actionable principles that guide the PMBOK 8 project management mindset.',
          ar: 'ستة مبادئ عملية توجه عقلية إدارة المشاريع في PMBOK 8.',
          fr: 'Six principes actionnables qui guident l’état d’esprit PMBOK 8.',
        },
        modules: pmbok8ReadinessModules,
      },
      {
        id: 'pmbok8-focus-areas',
        badge: '5',
        badgeColor: '#2563eb',
        title: {
          en: 'PMBOK 8 — Project Management Focus Areas',
          ar: 'PMBOK 8 — مجالات التركيز في إدارة المشاريع',
          fr: 'PMBOK 8 — Domaines d’attention en gestion de projet',
        },
        description: {
          en: 'Five focus areas: initiating, planning, executing, monitoring and controlling, and closing.',
          ar: 'خمسة مجالات تركيز: البدء، التخطيط، التنفيذ، المراقبة والتحكم، والإغلاق.',
          fr: 'Cinq domaines : lancement, planification, exécution, suivi et maîtrise, clôture.',
        },
        modules: pmbok8FocusAreaModules,
      },
      {
        id: 'pmbok8-performance-domains',
        badge: '7',
        badgeColor: '#0f766e',
        title: {
          en: 'PMBOK 8 — Performance Domains',
          ar: 'PMBOK 8 — مجالات الأداء',
          fr: 'PMBOK 8 — Domaines de performance',
        },
        description: {
          en: 'Seven performance domains integrating PMBOK 8 concepts, processes, tailoring, and outcomes.',
          ar: 'سبعة مجالات أداء تدمج مفاهيم PMBOK 8 وعملياته والتكييف والنتائج.',
          fr: 'Sept domaines intégrant concepts, processus, adaptation et résultats PMBOK 8.',
        },
        modules: pmbok8PerformanceDomainModules,
      },
      {
        id: 'eco2026-readiness',
        badge: 'ECO',
        badgeColor: '#a855f7',
        title: {
          en: 'ECO 2026 — Exam Domains',
          ar: 'ECO 2026 — مجالات الاختبار',
          fr: 'ECO 2026 — Domaines d’examen',
        },
        description: {
          en: 'People 33% · Process 41% · Business Environment 26% · predictive, adaptive/agile, and hybrid across all domains.',
          ar: 'الأفراد 33% · العمليات 41% · بيئة الأعمال 26% · مناهج تنبؤية وتكيفية/رشيقة وهجينة عبر جميع المجالات.',
          fr: 'People 33% · Process 41% · Business Environment 26% · prédictif, adaptatif/agile et hybride dans tous les domaines.',
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
