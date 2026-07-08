'use client'

import Link from 'next/link'
import { PLANS } from '@/lib/plans'
import { useLanguage } from '@/lib/i18n/language-context'

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
  logoUrl: string | null
  siteName: string
}

const PLAN_NAMES: Record<string, string> = {
  basic: 'Basic Plan',
  standard: 'Standard Plan',
  professional: 'Professional Plan',
}

const PLAN_NAMES_AR: Record<string, string> = {
  basic: 'الخطة الأساسية',
  standard: 'الخطة القياسية',
  professional: 'الخطة الاحترافية',
}

const PLAN_ICONS: Record<string, string> = {
  basic: '🌱',
  standard: '⚡',
  professional: '💎',
}

const RECEIPT_STRINGS = {
  en: {
    dashboard: 'Dashboard', billing: 'Billing', receipt: 'Receipt', print: '🖨️ Print / Save PDF',
    platform: 'AiTuTorZ Learning Platform', paymentReceipt: 'Payment Receipt', paid: 'PAID',
    billedTo: 'Billed To', from: 'From', description: 'Description', period: 'Period', amount: 'Amount',
    totalPaid: 'Total Paid', transactionDetails: 'Transaction Details', paymentMethod: 'Payment Method',
    dateTime: 'Date & Time', orderId: 'Order ID', transactionId: 'Transaction ID',
    planIncludes: 'Your Plan Includes', sprint: '90-Day Sprint', monthly: 'Monthly',
    defaultTagline: 'PMP (ECO 2026) preparation access',
    footer1: (siteName: string) => `This is an official receipt from ${siteName} (AiTuTorZ Platform) · pmp.aitutorsz.com`,
    footer2: 'For billing inquiries, contact support@pmpexperttutor.com',
    backBilling: '← Billing', toDashboard: 'Dashboard →',
  },
  ar: {
    dashboard: 'لوحة التحكم', billing: 'الفوترة', receipt: 'الإيصال', print: '🖨️ طباعة / حفظ PDF',
    platform: 'منصة AiTuTorZ التعليمية', paymentReceipt: 'إيصال الدفع', paid: 'مدفوع',
    billedTo: 'فاتورة إلى', from: 'من', description: 'الوصف', period: 'الفترة', amount: 'المبلغ',
    totalPaid: 'إجمالي المدفوع', transactionDetails: 'تفاصيل المعاملة', paymentMethod: 'طريقة الدفع',
    dateTime: 'التاريخ والوقت', orderId: 'رقم الطلب', transactionId: 'رقم المعاملة',
    planIncludes: 'خطتك تشمل', sprint: 'سباق 90 يومًا', monthly: 'شهري',
    defaultTagline: 'وصول الاستعداد للسباق الأخير لامتحان PMP',
    footer1: (siteName: string) => `هذا إيصال رسمي من ${siteName} (منصة AiTuTorZ) · pmp.aitutorsz.com`,
    footer2: 'لاستفسارات الفوترة راسلنا على support@pmpexperttutor.com',
    backBilling: '→ الفوترة', toDashboard: '← لوحة التحكم',
  },
}

export default function ReceiptClient({ receipt, learnerName, learnerEmail, logoUrl, siteName }: Props) {
  const { isArabic, dir } = useLanguage()
  const L = RECEIPT_STRINGS[isArabic ? 'ar' : 'en']
  const dateLocale = isArabic ? 'ar' : 'en-US'
  const date = new Date(receipt.created_at)
  const formattedDate = date.toLocaleDateString(dateLocale, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString(dateLocale, {
    hour: '2-digit', minute: '2-digit',
  })

  const planName = (isArabic ? PLAN_NAMES_AR[receipt.plan] : PLAN_NAMES[receipt.plan]) || receipt.plan
  const planIcon = PLAN_ICONS[receipt.plan] || '⭐'
  const selectedPlan = PLANS.find((p) => p.id === receipt.plan)
  const planTagline = (isArabic ? selectedPlan?.taglineAr : selectedPlan?.tagline) || L.defaultTagline
  const includedFeatures = (isArabic ? selectedPlan?.featuresAr : selectedPlan?.features) || (isArabic
    ? ['📖 مكتبة الدروس', '🤖 مدرّس AiTuTorZ الذكي', '🎯 محرّك التدريب', '📊 لوحة متابعة التقدم']
    : ['📖 Course Library', '🤖 AiTuTorZ AI Tutor', '🎯 Practice Engine', '📊 Progress Dashboard'])
  const periodLabel = receipt.plan_period === 'annual' || receipt.plan_period === 'sprint90' ? L.sprint : L.monthly

  const handlePrint = () => window.print()

  return (
    <>
      <style jsx global>{`
        @media print {
          @page { margin: 0.4in; size: A4; }
          html, body { margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { visibility: visible; }
          #receipt-print-area { position: fixed; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-shadow { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* Top Nav — no print */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20 no-print">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400" dir={dir}>
            <Link href="/dashboard" className="hover:text-gray-700">{L.dashboard}</Link>
            <span>/</span>
            <Link href="/dashboard/billing" className="hover:text-gray-700">{L.billing}</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{L.receipt}</span>
          </div>
          <button onClick={handlePrint}
            className="text-sm bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2">
            {L.print}
          </button>
        </div>
      </div>

      {/* Receipt */}
      <div className="min-h-screen bg-gray-100 flex items-start justify-center px-4 py-6">
        <div id="receipt-print-area" className="w-full max-w-[640px]" dir={dir}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg print-shadow overflow-hidden">

            {/* ═══ Header ═══ */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt={siteName} className="h-8 object-contain" style={{ filter: "brightness(0) invert(1) grayscale(1) contrast(1.4)", opacity: 0.98 }} />
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-sm">P</div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{siteName}</p>
                    <p className="text-violet-200 text-[10px]">{L.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[9px] uppercase tracking-widest">{L.paymentReceipt}</p>
                  <p className="text-white font-bold text-xs mt-0.5">{receipt.receipt_number}</p>
                </div>
              </div>
            </div>

            {/* ═══ Status + Date ═══ */}
            <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-emerald-700">{L.paid}</span>
              </div>
              <span className="text-xs text-emerald-600">{formattedDate} · {formattedTime}</span>
            </div>

            {/* ═══ Bill To / From ═══ */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-gray-100">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{L.billedTo}</p>
                <p className="text-sm font-bold text-gray-900">{learnerName}</p>
                <p className="text-xs text-gray-500">{learnerEmail}</p>
                {receipt.payer_email && receipt.payer_email !== learnerEmail && (
                  <p className="text-[10px] text-gray-400 mt-0.5">PayPal: {receipt.payer_email}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{L.from}</p>
                <p className="text-sm font-bold text-gray-900">{siteName}</p>
                <p className="text-xs text-gray-500">AiTuTorZ Platform</p>
                <p className="text-xs text-gray-500">pmp.aitutorsz.com</p>
              </div>
            </div>

            {/* ═══ Line Items ═══ */}
            <div className="px-6 py-4 border-b border-gray-100">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-100">
                <div className="col-span-7 text-[9px] font-bold text-gray-400 uppercase tracking-widest">{L.description}</div>
                <div className="col-span-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">{L.period}</div>
                <div className="col-span-3 text-right text-[9px] font-bold text-gray-400 uppercase tracking-widest">{L.amount}</div>
              </div>

              {/* Line Item */}
              <div className="grid grid-cols-12 gap-2 py-3 items-center">
                <div className="col-span-7 flex items-center gap-2.5">
                  <span className="text-xl">{planIcon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{planName}</p>
                    <p className="text-[10px] text-gray-400">{planTagline}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-semibold">{periodLabel}</span>
                </div>
                <div className="col-span-3 text-right">
                  <p className="text-sm font-bold text-gray-900">${Number(receipt.amount).toFixed(2)}</p>
                  <p className="text-[9px] text-gray-400 uppercase">{receipt.currency}</p>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-800 pt-3 mt-1 flex justify-between items-center">
                <span className="text-sm font-black text-gray-800 uppercase tracking-wide">{L.totalPaid}</span>
                <span className="text-lg font-black text-gray-900">${Number(receipt.amount).toFixed(2)} <span className="text-xs text-gray-400 font-normal">{receipt.currency}</span></span>
              </div>
            </div>

            {/* ═══ Payment Details ═══ */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{L.transactionDetails}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <span className="text-gray-500">{L.paymentMethod}</span>
                <span className="text-gray-800 font-medium text-right">PayPal</span>

                <span className="text-gray-500">{L.dateTime}</span>
                <span className="text-gray-800 font-medium text-right">{formattedDate}, {formattedTime}</span>

                {receipt.paypal_order_id && (
                  <>
                    <span className="text-gray-500">{L.orderId}</span>
                    <span className="text-gray-600 text-right font-mono text-[10px]" dir="ltr">{receipt.paypal_order_id}</span>
                  </>
                )}
                {receipt.paypal_capture_id && (
                  <>
                    <span className="text-gray-500">{L.transactionId}</span>
                    <span className="text-gray-600 text-right font-mono text-[10px]" dir="ltr">{receipt.paypal_capture_id}</span>
                  </>
                )}
              </div>
            </div>

            {/* ═══ What's Included ═══ */}
            <div className="px-6 py-3 border-b border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{L.planIncludes}</p>
              <div className="grid grid-cols-2 gap-1">
                {includedFeatures.map(item => (
                  <div key={item} className="flex items-center gap-1 text-[10px] text-gray-600 py-0.5">{item}</div>
                ))}
              </div>
            </div>

            {/* ═══ Footer ═══ */}
            <div className="px-6 py-3 bg-gray-50 text-center">
              <p className="text-[9px] text-gray-400 leading-relaxed">
                {L.footer1(siteName)}
                <br />
                {L.footer2}
              </p>
            </div>

          </div>

          {/* Actions — no print */}
          <div className="mt-4 flex justify-center gap-4 no-print">
            <Link href="/dashboard/billing" className="text-sm text-violet-500 hover:underline font-medium">{L.backBilling}</Link>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:underline font-medium">{L.toDashboard}</Link>
          </div>
        </div>
      </div>
    </>
  )
}
