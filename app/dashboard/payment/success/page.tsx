'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { PLANS } from '@/lib/plans'
import { useLanguage } from '@/lib/i18n/language-context'

const PLAN_ICONS: Record<string, string> = {
  basic: '🌱',
  standard: '⚡',
  professional: '💎',
}

const PLAN_GRADIENTS: Record<string, string> = {
  basic: 'from-blue-500 to-blue-700',
  standard: 'from-violet-500 to-violet-700',
  professional: 'from-violet-500 to-purple-700',
}

function formatPeriodLabel(period: string, isArabic: boolean): string {
  return period === 'annual' || period === 'sprint90'
    ? (isArabic ? 'سباق 90 يومًا' : '90-Day Sprint')
    : (isArabic ? 'شهري' : 'Monthly')
}

function SuccessContent() {
  const { isArabic, dir } = useLanguage()
  const params = useSearchParams()
  const plan = params.get('plan') ?? 'standard'
  const period = params.get('period') ?? 'monthly'
  const amount = params.get('amount') ?? '0'
const receiptId = params.get('receiptId')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  const icon = PLAN_ICONS[plan] ?? '⭐'
  const gradient = PLAN_GRADIENTS[plan] ?? 'from-violet-500 to-violet-700'
  const selectedPlan = PLANS.find((p) => p.id === plan)
  const planName = selectedPlan
    ? (isArabic ? selectedPlan.nameAr : selectedPlan.name)
    : plan.charAt(0).toUpperCase() + plan.slice(1)
  const includedFeatures = (isArabic ? selectedPlan?.featuresAr : selectedPlan?.features) || (isArabic
    ? ['📖 مكتبة الدروس', '🤖 مدرّس Zane الذكي', '🎯 محرّك التدريب', '📊 لوحة متابعة التقدم']
    : ['📖 Course Library', '🤖 Zane AI Tutor', '🎯 Practice Engine', '📊 Progress Dashboard'])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6" dir={dir}>
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
                  Math.floor(Math.random() * 5)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg w-full">
        {/* Success card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${gradient} p-8 text-white text-center`}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">{icon}</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">{isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</h1>
            <p className="text-white/80 text-sm">
              {isArabic ? `مرحبًا بك في خطة ${planName} من PMPeco` : `Welcome to PMPeco ${planName}`}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Plan summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{isArabic ? 'الخطة' : 'Plan'}</span>
                <span className="font-semibold text-gray-900">{icon} {planName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{isArabic ? 'الفوترة' : 'Billing'}</span>
                <span className="font-semibold text-gray-900">{formatPeriodLabel(period, isArabic)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{isArabic ? 'المبلغ المدفوع' : 'Amount paid'}</span>
                <span className="font-bold text-gray-900">${amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{isArabic ? 'الحالة' : 'Status'}</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {isArabic ? 'نشط' : 'Active'}
                </span>
              </div>
            </div>

            {/* What's unlocked */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">{isArabic ? '🎉 وصولك نشط الآن' : '🎉 Your access is now active'}</p>
              <div className="grid grid-cols-2 gap-2">
                {includedFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-gray-700">
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-2 pt-2">
              {receiptId && (
                <Link
                  href={"/dashboard/receipt/" + receiptId}
                  className="block w-full bg-white border border-violet-200 text-violet-700 text-sm font-semibold py-3 rounded-xl text-center hover:bg-violet-50 transition-colors"
                >
                  {isArabic ? '🧾 تنزيل إيصال الدفع' : '🧾 Download Payment Receipt'}
                </Link>
              )}
              <Link
                href="/dashboard/path"
                className={`block w-full bg-gradient-to-r ${gradient} text-white text-sm font-bold py-3 rounded-xl text-center hover:opacity-90 transition-opacity`}
              >
                {isArabic ? '🚀 ابدأ التعلّم الآن' : '🚀 Start Learning Now'}
              </Link>
              <Link
                href="/dashboard/practice"
                className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-3 rounded-xl text-center transition-colors"
              >
                {isArabic ? '🎯 انتقل إلى محرّك التدريب' : '🎯 Go to Practice Engine'}
              </Link>
              <Link
                href="/dashboard"
                className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
              >
                {isArabic ? '← لوحة التحكم' : 'Dashboard →'}
              </Link>
            </div>
          </div>
        </div>

        {/* Receipt note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          {isArabic ? 'تم إرسال إيصال إلى بريدك الإلكتروني المسجّل في PayPal.' : 'A receipt has been sent to your PayPal email address.'}
          <br />
          {isArabic ? 'لديك أسئلة؟ راسلنا على support@pmpeco.com' : 'Questions? Contact us at support@pmpeco.com'}
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
