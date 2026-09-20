import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface Props {
  params: Promise<{ id: string }>
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function Detail({ label, value, mono = false }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-sm text-gray-900 break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value || '—'}</p>
    </div>
  )
}

export default async function AdminTransactionPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: requester } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (requester?.role !== 'admin') redirect('/dashboard')

  const admin = createAdminClient()
  const { data: receipt } = await admin.from('payment_receipts').select('*').eq('id', id).single()
  if (!receipt) notFound()

  const { data: learner } = await admin
    .from('profiles')
    .select('id, full_name, email, plan, plan_period, plan_expires_at, created_at')
    .eq('id', receipt.user_id)
    .single()

  const refunded = receipt.status === 'refunded'
  const statusStyle = refunded
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/admin/billing" className="text-sm font-medium text-violet-600 hover:underline">← Billing &amp; Sales</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Transaction details</h1>
          <p className="text-sm text-gray-500 mt-1">Complete payment, learner, and document audit trail.</p>
        </div>
        <span className={`self-start rounded-full border px-3 py-1.5 text-xs font-bold uppercase ${statusStyle}`}>
          {receipt.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Payment</h2>
            <p className={`text-xl font-black ${refunded ? 'text-rose-700' : 'text-gray-900'}`}>
              ${Number(receipt.amount || 0).toFixed(2)} <span className="text-xs font-medium text-gray-400">{receipt.currency}</span>
            </p>
          </div>
          <div className="px-6 grid sm:grid-cols-2 sm:gap-x-8">
            <div>
              <Detail label="Receipt number" value={receipt.receipt_number} mono />
              <Detail label="Plan" value={`${receipt.plan || '—'} · ${receipt.plan_period || '—'}`} />
              <Detail label="Payment status" value={receipt.status} />
              <Detail label="Transaction date" value={formatDate(receipt.created_at)} />
            </div>
            <div>
              <Detail label="PayPal order ID" value={receipt.paypal_order_id} mono />
              <Detail label="PayPal capture ID" value={receipt.paypal_capture_id} mono />
              <Detail label="PayPal payer" value={receipt.payer_name} />
              <Detail label="PayPal email" value={receipt.payer_email} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Learner account</h2></div>
          <div className="px-6">
            <Detail label="Name" value={learner?.full_name} />
            <Detail label="Email" value={learner?.email} />
            <Detail label="Current plan" value={learner?.plan || 'free'} />
            <Detail label="Current period" value={learner?.plan_period} />
            <Detail label="Access expires" value={formatDate(learner?.plan_expires_at)} />
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-bold text-gray-900">Documents &amp; actions</h2>
        <p className="text-sm text-gray-500 mt-1">Open the official PMPeco document to review, print, or save it as PDF.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href={`/dashboard/receipt/${receipt.id}?admin=1`} className="inline-flex items-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
            View payment receipt / invoice
          </Link>
          {receipt.paypal_capture_id && (
            <a href={`https://www.paypal.com/activity/payment/${encodeURIComponent(receipt.paypal_capture_id)}`} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Open in PayPal ↗
            </a>
          )}
        </div>
        {refunded && (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            This transaction was refunded. The learner account currently shows <strong>{learner?.plan || 'free'}</strong> access.
          </div>
        )}
      </section>
    </div>
  )
}
