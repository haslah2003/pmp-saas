'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

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

function SuccessContent() {
  const params = useSearchParams()
  const plan = params.get('plan') ?? 'standard'
  const period = params.get('period') ?? 'monthly'
  const amount = params.get('amount') ?? '0'

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  const planName = plan.charAt(0).toUpperCase() + plan.slice(1)
  const icon = PLAN_ICONS[plan] ?? '⭐'
  const gradient = PLAN_GRADIENTS[plan] ?? 'from-violet-500 to-violet-700'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
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
            <h1 className="text-2xl font-bold mb-1">Payment Successful!</h1>
            <p className="text-white/80 text-sm">
              Welcome to PMP Expert Tutor {planName}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Plan summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Plan</span>
                <span className="font-semibold text-gray-900">{icon} {planName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Billing</span>
                <span className="font-semibold text-gray-900 capitalize">{period}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Amount paid</span>
                <span className="font-bold text-gray-900">${amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Active
                </span>
              </div>
            </div>

            {/* What's unlocked */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">🎉 Your access is now active</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '📖', label: 'Course Library' },
                  { icon: '🤖', label: 'AiTuTorZ' },
                  { icon: '🎯', label: 'Practice Engine' },
                  { icon: '📊', label: 'Progress Dashboard' },
                  { icon: '🧙', label: 'Guru Report' },
                  { icon: '✨', label: 'Go Deeper AI' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-gray-700">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-2 pt-2">
              <Link
                href="/dashboard/course"
                className={`block w-full bg-gradient-to-r ${gradient} text-white text-sm font-bold py-3 rounded-xl text-center hover:opacity-90 transition-opacity`}
              >
                🚀 Start Learning Now
              </Link>
              <Link
                href="/dashboard/practice"
                className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-3 rounded-xl text-center transition-colors"
              >
                🎯 Go to Practice Engine
              </Link>
              <Link
                href="/dashboard"
                className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
              >
                Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Receipt note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          A receipt has been sent to your PayPal email address.
          <br />
          Questions? Contact us at support@pmpexperttutor.com
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
