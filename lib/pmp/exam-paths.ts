export type ExamPathId = 'pmbok7' | 'pmbok8' | 'bridge'
export type AppLocale = 'en' | 'ar' | 'fr'

export type ExamPathCopy = {
  label: string
  shortLabel: string
  badge: string
  description: string
  seoHint: string
}

export type ExamPathConfig = {
  id: ExamPathId
  color: string
  copy: Record<AppLocale, ExamPathCopy>
}

export const EXAM_PATH_ORDER: ExamPathId[] = ['pmbok7', 'pmbok8', 'bridge']

export const EXAM_PATHS: Record<ExamPathId, ExamPathConfig> = {
  pmbok7: {
    id: 'pmbok7',
    color: '#2563eb',
    copy: {
      en: {
        label: 'Current PMP Path',
        shortLabel: 'PMBOK 7 + ECO 2021',
        badge: 'Current Path',
        description: 'For candidates taking the PMP exam before 9 July 2026.',
        seoHint: 'PMP exam preparation aligned with PMBOK 7 and ECO 2021.',
      },
      ar: {
        label: 'المسار الحالي لاختبار PMP',
        shortLabel: 'PMBOK 7 + ECO 2021',
        badge: 'المسار الحالي',
        description: 'مناسب للمرشحين الذين سيجتازون اختبار PMP قبل 9 يوليو 2026.',
        seoHint: 'تحضير لاختبار PMP وفق PMBOK 7 ومخطط ECO 2021.',
      },
      fr: {
        label: 'Parcours PMP actuel',
        shortLabel: 'PMBOK 7 + ECO 2021',
        badge: 'Parcours actuel',
        description: 'Pour les candidats qui passent l’examen PMP avant le 9 juillet 2026.',
        seoHint: 'Préparation PMP alignée sur PMBOK 7 et ECO 2021.',
      },
    },
  },
  pmbok8: {
    id: 'pmbok8',
    color: '#7c3aed',
    copy: {
      en: {
        label: 'New PMP Path',
        shortLabel: 'PMBOK 8 + ECO 2026',
        badge: 'New Exam Path',
        description: 'For candidates taking the PMP exam on or after 9 July 2026.',
        seoHint: 'PMP exam preparation aligned with PMBOK 8 and ECO 2026.',
      },
      ar: {
        label: 'المسار الجديد لاختبار PMP',
        shortLabel: 'PMBOK 8 + ECO 2026',
        badge: 'مسار الاختبار الجديد',
        description: 'مناسب للمرشحين الذين سيجتازون اختبار PMP في 9 يوليو 2026 أو بعده.',
        seoHint: 'تحضير لاختبار PMP وفق PMBOK 8 ومخطط ECO 2026.',
      },
      fr: {
        label: 'Nouveau parcours PMP',
        shortLabel: 'PMBOK 8 + ECO 2026',
        badge: 'Nouveau parcours',
        description: 'Pour les candidats qui passent l’examen PMP à partir du 9 juillet 2026.',
        seoHint: 'Préparation PMP alignée sur PMBOK 8 et ECO 2026.',
      },
    },
  },
  bridge: {
    id: 'bridge',
    color: '#0f766e',
    copy: {
      en: {
        label: 'Bridge Mode',
        shortLabel: 'PMBOK 7 → PMBOK 8 Transition',
        badge: 'Bridge Mode',
        description: 'For learners unsure of their exam date or preparing across the PMP transition window.',
        seoHint: 'PMP transition preparation bridging PMBOK 7, PMBOK 8, ECO 2021, and ECO 2026.',
      },
      ar: {
        label: 'الوضع الانتقالي',
        shortLabel: 'الانتقال من PMBOK 7 إلى PMBOK 8',
        badge: 'وضع انتقالي',
        description: 'مناسب للمتعلمين غير المتأكدين من تاريخ الاختبار أو الذين يستعدون خلال فترة الانتقال بين نسختي الاختبار.',
        seoHint: 'تحضير انتقالي لاختبار PMP يجمع بين PMBOK 7 وPMBOK 8 وECO 2021 وECO 2026.',
      },
      fr: {
        label: 'Mode passerelle',
        shortLabel: 'Transition PMBOK 7 → PMBOK 8',
        badge: 'Mode passerelle',
        description: 'Pour les apprenants incertains de leur date d’examen ou en période de transition PMP.',
        seoHint: 'Préparation PMP de transition entre PMBOK 7, PMBOK 8, ECO 2021 et ECO 2026.',
      },
    },
  },
}

export function isExamPathId(value: unknown): value is ExamPathId {
  return typeof value === 'string' && value in EXAM_PATHS
}

export function normalizeExamPath(value: unknown): ExamPathId {
  return isExamPathId(value) ? value : 'pmbok7'
}

export function normalizeAppLocale(value: unknown): AppLocale {
  if (value === 'ar' || value === 'fr') return value
  return 'en'
}

export function getExamPathCopy(path: unknown, locale: unknown = 'en'): ExamPathCopy {
  const safePath = normalizeExamPath(path)
  const safeLocale = normalizeAppLocale(locale)
  return EXAM_PATHS[safePath].copy[safeLocale]
}
