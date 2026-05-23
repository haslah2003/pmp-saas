export type PlanId = 'basic' | 'standard' | 'professional'

// Internal note:
// The key "annual" is temporarily retained for launch compatibility with existing
// UI/database/payment fields. User-facing copy now treats it as a 90-Day Sprint Pass.
export type Period = 'monthly' | 'annual'

export interface PlanPricing {
  price: number
  label: string
}

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  icon: string
  gradient: string
  badgeColor: string
  textColor: string
  borderColor: string
  monthly: PlanPricing
  annual: PlanPricing
  annualSaving: string
  features: string[]
  highlighted?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Start your current-exam preparation',
    icon: '🌱',
    gradient: 'from-blue-500 to-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    monthly: { price: 29, label: '$29' },
    annual: { price: 79, label: '$79' },
    annualSaving: 'Save 9%',
    features: [
      '📖 Full Course Library (24 lessons)',
      '🤖 AI Tutor — unlimited sessions',
      '🎯 Practice Engine — focused question sets',
      '📊 Progress Dashboard',
      '🗺️ Interactive Mind Maps',
      'PMBOK 7 + ECO 2021 framework',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Complete current-exam preparation toolkit',
    icon: '⚡',
    gradient: 'from-indigo-500 to-indigo-700',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    monthly: { price: 49, label: '$49' },
    annual: { price: 129, label: '$129' },
    annualSaving: 'Save 12%',
    highlighted: true,
    features: [
      '✅ Everything in Basic',
      '🎯 679 bilingual practice questions',
      '📝 Mock Exam (180 questions)',
      '🧙 Guru Report & weak area analysis',
      '📖 Go Deeper AI expansions',
      'PMBOK 7 + ECO 2021 framework',
      '⚡ Priority content updates',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Maximum support for urgent PMP candidates',
    icon: '💎',
    gradient: 'from-violet-500 to-purple-700',
    badgeColor: 'bg-violet-100 text-violet-700',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    monthly: { price: 79, label: '$79' },
    annual: { price: 199, label: '$199' },
    annualSaving: 'Save 16%',
    features: [
      '✅ Everything in Standard',
      '🆕 PMBOK 8 + ECO 2026 early access',
      '🎯 679 bilingual practice questions',
      '🎓 Personalised study plan',
      '📞 Priority support',
      '🔄 Lifetime content updates',
      '🏆 Exam-readiness toolkit',
    ],
  },
]

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}

export function getPlanPrice(planId: PlanId, period: Period): number {
  const plan = getPlanById(planId)
  if (!plan) return 0
  return period === 'annual' ? plan.annual.price : plan.monthly.price
}

// How many days of access each plan/period grants.
// "annual" currently means the user-facing 90-Day Sprint Pass.
export function getPlanDays(period: Period): number {
  return period === 'annual' ? 90 : 31
}
