'use client'

import Link from 'next/link'

interface ReceiptData {
  id: string
  receipt_number: string
  plan: string
  plan_period: string
  amount: number
  currency: string
  paypal_order_id: string
  paypal_capture_id: string
  payer_email: string
  payer_name: string
  status: string
  created_at: string
}

interface Props {
  receipt: ReceiptData
  learnerName: string
  learnerEmail: string
}

const PLAN_NAMES: Record<string, string> = {
  basic: 'Basic Plan',
  standard: 'Standard Plan',
  professional: 'Professional Plan',
}

const PLAN_ICONS: Record<string, string> = {
  basic: '🌱',
  standard: '⚡',
  professional: '💎',
}

export default function ReceiptClient({ receipt, learnerName, learnerEmail }: Props) {
  const date = new Date(receipt.created_at)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })

  const planName = PLAN_NAMES[receipt.plan] || receipt.plan
  const planIcon = PLAN_ICONS[receipt.plan] || '⭐'
  const periodLabel = receipt.plan_period === 'yearly' ? 'Annual' : 'Monthly'

  const handlePrint = () => window.print()

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt, #receipt * { visibility: visible; }
          #receipt { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div id="receipt" className="min-h-screen bg-gray-50">
        {/* Nav */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20 no-print">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <span>/</span>
              <Link href="/dashboard/billing" className="hover:text-gray-700">Billing</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">Receipt</span>
            </div>
            <button onClick={handlePrint}
              className="text-sm bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2">
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 px-8 py-8 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-black tracking-tight">Payment Receipt</h1>
                  <p className="text-violet-200 text-sm mt-1">PMP Expert Tutor — AiTuTorZ Platform</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">Receipt No.</p>
                  <p className="text-white font-bold text-sm">{receipt.receipt_number}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-6">

              {/* Status banner */}
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-semibold text-emerald-700">Payment Successful</span>
                </div>
                <span className="text-sm text-emerald-600">{formattedDate}</span>
              </div>

              {/* Bill To / From */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
                  <p className="text-sm font-semibold text-gray-900">{learnerName}</p>
                  <p className="text-xs text-gray-500">{learnerEmail}</p>
                  {receipt.payer_email && receipt.payer_email !== learnerEmail && (
                    <p className="text-xs text-gray-400 mt-0.5">PayPal: {receipt.payer_email}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">From</p>
                  <p className="text-sm font-semibold text-gray-900">PMP Expert Tutor</p>
                  <p className="text-xs text-gray-500">AiTuTorZ Learning Platform</p>
                  <p className="text-xs text-gray-500">pmp-saas.vercel.app</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Line items */}
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Description</th>
                      <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Period</th>
                      <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{planIcon}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{planName}</p>
                            <p className="text-xs text-gray-500">Full access to PMP Expert Tutor platform</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                          {periodLabel}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <p className="text-lg font-bold text-gray-900">${Number(receipt.amount).toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{receipt.currency}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Total */}
                <div className="border-t border-gray-200 mt-2 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">Total Paid</span>
                  <span className="text-xl font-black text-gray-900">${Number(receipt.amount).toFixed(2)} {receipt.currency}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Payment details */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Details</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="text-gray-900 font-medium text-right">PayPal</span>

                  <span className="text-gray-500">Transaction Date</span>
                  <span className="text-gray-900 font-medium text-right">{formattedDate} at {formattedTime}</span>

                  {receipt.paypal_order_id && (
                    <>
                      <span className="text-gray-500">Order ID</span>
                      <span className="text-gray-700 text-right text-xs font-mono">{receipt.paypal_order_id}</span>
                    </>
                  )}

                  {receipt.paypal_capture_id && (
                    <>
                      <span className="text-gray-500">Capture ID</span>
                      <span className="text-gray-700 text-right text-xs font-mono">{receipt.paypal_capture_id}</span>
                    </>
                  )}

                  <span className="text-gray-500">Receipt Number</span>
                  <span className="text-gray-900 font-medium text-right">{receipt.receipt_number}</span>
                </div>
              </div>

              {/* What's included */}
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">What&apos;s Included</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    '📚 Full Course Library',
                    '🤖 AiTuTorZ AI Tutor',
                    '🎯 Practice Engine',
                    '📊 Progress Dashboard',
                    '🧙‍♂️ Guru Progress Reports',
                    '✨ Go Deeper AI',
                    '📐 PMP Formulas',
                    '💬 PMP Companion',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-violet-700">{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center">
                This receipt was generated by PMP Expert Tutor (AiTuTorZ Platform) · pmp-saas.vercel.app
                <br />
                For questions about your subscription, contact support@pmpexperttutor.com
              </p>
            </div>
          </div>

          {/* Actions (no-print) */}
          <div className="mt-4 flex justify-center gap-3 no-print">
            <Link href="/dashboard/billing" className="text-sm text-violet-500 hover:underline font-medium">
              ← Back to Billing
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
