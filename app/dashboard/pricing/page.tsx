'use client'

import { useEffect, useState } from 'react'
import { PLANS } from '@/lib/plans'
import type { Period, PlanId } from '@/lib/plans'
import PayPalButton from '@/components/PayPalButton'
import { useLanguage } from '@/lib/i18n/language-context'

const PLAN_IDS: PlanId[] = ['basic', 'standard', 'professional']
const PERIODS: Period[] = ['monthly', 'annual']


export default function PricingPage() {
  const { isArabic, dir } = useLanguage()
  const [period, setPeriod] = useState<Period>('monthly')
  const [expandedPlan, setExpandedPlan] = useState<string | null>('standard')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedPlan = params.get('plan') as PlanId | null
    const requestedPeriodParam = params.get('period')
    const requestedPeriod = requestedPeriodParam === 'sprint90'
      ? 'annual'
      : requestedPeriodParam as Period | null

    if (requestedPlan && PLAN_IDS.includes(requestedPlan)) {
      setExpandedPlan(requestedPlan)
    }

    if (requestedPeriod && PERIODS.includes(requestedPeriod)) {
      setPeriod(requestedPeriod)
    }
  }, [])

  const TRUST_ITEMS = isArabic
    ? [
        { icon: '🔒', label: 'دفع آمن', sub: 'محمي عبر PayPal' },
        { icon: '/icons/upgrade-anytime.svg', label: 'ترقية في أي وقت', sub: 'انتقل للأعلى عندما تكون جاهزًا' },
        { icon: '🏆', label: 'مركّز على الامتحان', sub: 'محتوى متوافق مع PMI' },
        { icon: '⚡', label: 'وصول فوري', sub: 'ابدأ على الفور' },
      ]
    : [
        { icon: '🔒', label: 'Secure Payment', sub: 'PayPal protected' },
        { icon: '/icons/upgrade-anytime.svg', label: 'Upgrade Anytime', sub: 'Move up when ready' },
        { icon: '🏆', label: 'Exam Focused', sub: 'PMI-aligned content' },
        { icon: '⚡', label: 'Instant Access', sub: 'Start immediately' },
      ]

  const FAQ_ITEMS = isArabic
    ? [
        {
          q: 'هل يمكنني تغيير خطتي لاحقًا؟',
          a: 'نعم — يمكنك الترقية في أي وقت، وتُفعَّل خطتك الجديدة فورًا.',
        },
        {
          q: 'هل توجد تجربة مجانية؟',
          a: 'تمنحك الخطة الأساسية مسار استعداد مركّزًا للامتحان الحالي مع مدرّس ذكاء اصطناعي ودروس وخرائط ذهنية ومجموعات تدريب مركّزة.',
        },
        {
          q: 'ماذا يحدث عند انتهاء خطتي؟',
          a: 'تحتفظ ببيانات تقدمك، ويتوقف الوصول إلى المحتوى مؤقتًا حتى تجدد الاشتراك.',
        },
        {
          q: 'هل دفعتي آمنة؟',
          a: 'تُعالَج جميع المدفوعات عبر PayPal، ولا نخزّن بيانات بطاقتك أبدًا.',
        },
      ]
    : [
        {
          q: 'Can I switch plans later?',
          a: 'Yes — you can upgrade at any time. Your new plan activates immediately.',
        },
        {
          q: 'Is there a free trial?',
          a: 'The Basic plan gives you a focused PMP (ECO 2026) preparation route with AI tutor access, lessons, mind maps, and focused practice sets.',
        },
        {
          q: 'What happens when my plan expires?',
          a: 'You keep access to your progress data. Content access pauses until you renew.',
        },
        {
          q: 'Is my payment secure?',
          a: 'All payments are processed by PayPal. We never store your card details.',
        },
      ]

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {isArabic ? 'اختر خطتك للتحضير لامتحان PMP (ECO 2026)' : 'Choose Your PMP (ECO 2026) Plan'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            {isArabic
              ? 'استعداد مركّز على PMBOK 8 + ECO 2026 لامتحان PMP الحالي.'
              : 'Focused PMBOK 8 + ECO 2026 preparation for the current PMP exam.'}
          </p>

          {/* Period toggle */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <span className={`text-sm font-medium ${period === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
              {isArabic ? 'شهري' : 'Monthly'}
            </span>
            <button
              onClick={() => setPeriod(period === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                period === 'annual' ? 'bg-violet-600' : 'bg-gray-200'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                period === 'annual' ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${period === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
                {isArabic ? 'سباق 90 يومًا' : '90-Day Sprint'}
              </span>
              {period === 'annual' && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {isArabic ? 'أفضل قيمة للسباق' : 'Best Sprint Value'}
                </span>
              )}
              {period === 'monthly' && (
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {isArabic ? 'وفّر حتى 16% مع وصول 90 يومًا' : 'Save up to 16% with 90-day access'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Plan Cards ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const price = period === 'annual' ? plan.annual.price : plan.monthly.price
            const isExpanded = expandedPlan === plan.id
            const planName = isArabic ? plan.nameAr : plan.name
            const features = isArabic ? plan.featuresAr : plan.features

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border shadow-sm transition-all ${
                  plan.highlighted
                    ? 'border-violet-300 shadow-violet-100 shadow-lg scale-[1.02]'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                {/* Most Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                      {isArabic ? '⭐ الأكثر شيوعًا' : '⭐ Most Popular'}
                    </span>
                  </div>
                )}

                {/* Card header */}
                <div className={`bg-gradient-to-br ${plan.gradient} rounded-t-2xl p-5 text-white`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{plan.icon}</span>
                    <h3 className="text-lg font-bold">{planName}</h3>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">{isArabic ? plan.taglineAr : plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-white/70 text-sm mb-1">
                      {period === 'annual' ? (isArabic ? '/90 يومًا' : '/90 days') : (isArabic ? '/شهر' : '/month')}
                    </span>
                  </div>

                  {/* Sprint saving */}
                  {period === 'annual' && (
                    <div className="mt-1 bg-white/20 rounded-lg px-2 py-0.5 w-fit">
                      <span className="text-xs font-semibold text-white">
                        🎉 {isArabic
                          ? `${plan.annualSavingAr} مع وصول سباق 90 يومًا`
                          : `${plan.annualSaving} with 90-day sprint access`}
                      </span>
                    </div>
                  )}

                  {period === 'monthly' && (
                    <p className="text-white/60 text-xs mt-1">
                      {isArabic
                        ? `أو ${plan.annual.label}/90 يومًا — ${plan.annualSavingAr}`
                        : `or ${plan.annual.label}/90 days — ${plan.annualSaving}`}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 mt-0.5 text-xs">{feature.slice(0, 2)}</span>
                        <span>{feature.slice(2).trim()}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Checkout section */}
                  {isExpanded ? (
                    <div>
                      <div className={`text-xs font-semibold ${plan.textColor} mb-3 flex items-center gap-1`}>
                        <span>{isArabic ? 'دفع آمن' : 'Secure checkout'}</span>
                        <span className="text-gray-400 font-normal">
                          — {planName} · {period === 'annual' ? (isArabic ? 'سباق 90 يومًا' : '90-Day Sprint') : (isArabic ? 'شهري' : 'Monthly')} · ${price}
                        </span>
                      </div>
                      <PayPalButton
                        planId={plan.id}
                        period={period}
                        amount={price}
                        planName={plan.name}
                      />
                      <button
                        onClick={() => setExpandedPlan(null)}
                        className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-2 transition-colors"
                      >
                        {isArabic ? '✕ إلغاء' : '✕ Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedPlan(plan.id)}
                      className={`w-full bg-gradient-to-r ${plan.gradient} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm`}
                    >
                      {isArabic
                        ? `احصل على ${planName} ${period === 'annual' ? '— ' + plan.annual.label : ''}`
                        : `Get ${planName} ${period === 'annual' ? '— ' + plan.annual.label : ''}`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              {item.icon.endsWith('.svg') ? (
                <img src={item.icon} alt="" aria-hidden="true" className="mx-auto h-7 w-7 opacity-90" />
              ) : (
                <span className="text-2xl">{item.icon}</span>
              )}
              <p className="text-xs font-bold text-gray-900 mt-1">{item.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQ_ITEMS.map((faq) => (
              <div key={faq.q}>
                <p className="text-sm font-semibold text-gray-900 mb-1">{faq.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
