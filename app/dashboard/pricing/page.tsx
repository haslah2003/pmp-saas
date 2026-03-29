'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLANS } from '@/lib/plans'
import type { Period } from '@/lib/plans'
import PayPalButton from '@/components/PayPalButton'

export default function PricingPage() {
  const [period, setPeriod] = useState<Period>('monthly')
  const [expandedPlan, setExpandedPlan] = useState<string | null>('standard')

  const annualDiscount = period === 'annual'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Invest in Your PMP Success
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Join thousands of professionals who passed their PMP exam with our
            AI-powered preparation platform. Cancel anytime.
          </p>

          {/* Period toggle */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <span className={`text-sm font-medium ${period === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setPeriod(period === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                period === 'annual' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                period === 'annual' ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${period === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
                Annual
              </span>
              {period === 'annual' && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Best Value
                </span>
              )}
              {period === 'monthly' && (
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Save up to 43% annually
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

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border shadow-sm transition-all ${
                  plan.highlighted
                    ? 'border-indigo-300 shadow-indigo-100 shadow-lg scale-[1.02]'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                {/* Most Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                {/* Card header */}
                <div className={`bg-gradient-to-br ${plan.gradient} rounded-t-2xl p-5 text-white`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{plan.icon}</span>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-white/70 text-sm mb-1">
                      {period === 'annual' ? '/year' : '/month'}
                    </span>
                  </div>

                  {/* Annual saving */}
                  {period === 'annual' && (
                    <div className="mt-1 bg-white/20 rounded-lg px-2 py-0.5 w-fit">
                      <span className="text-xs font-semibold text-white">
                        🎉 {plan.annualSaving} vs monthly
                      </span>
                    </div>
                  )}

                  {period === 'monthly' && (
                    <p className="text-white/60 text-xs mt-1">
                      or {plan.annual.label}/year — {plan.annualSaving}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((feature, i) => (
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
                        <span>Secure checkout</span>
                        <span className="text-gray-400 font-normal">— {plan.name} · {period === 'annual' ? 'Annual' : 'Monthly'} · ${price}</span>
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
                        ✕ Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedPlan(plan.id)}
                      className={`w-full bg-gradient-to-r ${plan.gradient} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm`}
                    >
                      Get {plan.name} {period === 'annual' ? '— ' + plan.annual.label : ''}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔒', label: 'Secure Payment', sub: 'PayPal protected' },
            { icon: '✅', label: 'Cancel Anytime', sub: 'No lock-in contracts' },
            { icon: '🏆', label: 'Exam Focused', sub: 'PMI-aligned content' },
            { icon: '⚡', label: 'Instant Access', sub: 'Start immediately' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs font-bold text-gray-900 mt-1">{item.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes — you can upgrade at any time. Your new plan activates immediately.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Our Basic plan gives you full access to the Course Library and AI Tutor to get started.',
              },
              {
                q: 'What happens when my plan expires?',
                a: 'You keep access to your progress data. Content access pauses until you renew.',
              },
              {
                q: 'Is my payment secure?',
                a: 'All payments are processed by PayPal. We never store your card details.',
              },
            ].map((faq) => (
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