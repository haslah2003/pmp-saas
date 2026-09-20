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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-900 break-all">{value || '—'}</div>
    </div>
  )
}

export default async function AdminBillingUserPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: requester } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (requester?.role !== 'admin') redirect('/dashboard')

  const admin = createAdminClient()
  const { data: learner } = await admin
    .from('profiles')
    .select('id, full_name, email, role, plan, plan_period, plan_expires_at, paypal_order_id, paypal_capture_id, created_at, updated_at')
    .eq('id', id)
    .single()
  if (!learner) notFound()

  const { data: receipts } = await admin
    .from('payment_receipts')
    .select('id, receipt_number, plan, plan_period, amount, currency, status, payer_email, payer_name, paypal_order_id, paypal_capture_id, created_at')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  const history = receipts || []
  const paid = history.filter((item) => item.status === 'paid')
  const refunded = history.filter((item) => item.status === 'refunded')
  const collected = paid.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const refundedTotal = refunded.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const expiry = learner.plan_expires_at ? new Date(learner.plan_expires_at) : null
  const active = learner.plan !== 'free' && expiry && expiry > new Date()
  const accountType = learner.role === 'admin' ? 'Administrator' : 'Learner'

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/billing#all-users" className="text-sm font-medium text-violet-600 hover:underline">← All users</Link>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{learner.full_name || 'Unnamed learner'}</h1>
            <p className="text-sm text-gray-500 mt-1">{learner.email}</p>
          </div>
          <span className={`self-start rounded-full px-3 py-1.5 text-xs font-bold uppercase ${active ? 'bg-emerald-100 text-emerald-700' : learner.plan === 'free' ? 'bg-gray-100 text-gray-600' : 'bg-rose-100 text-rose-700'}`}>
            {active ? 'Active' : learner.plan === 'free' ? 'Free' : 'Expired'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-xs text-gray-400">Transactions</p><p className="mt-1 text-2xl font-bold text-gray-900">{history.length}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-xs text-gray-400">Paid transactions</p><p className="mt-1 text-2xl font-bold text-emerald-700">{paid.length}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-xs text-gray-400">Net collected</p><p className="mt-1 text-2xl font-bold text-gray-900">${collected.toFixed(2)}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-xs text-gray-400">Refunded</p><p className="mt-1 text-2xl font-bold text-rose-700">${refundedTotal.toFixed(2)}</p></div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-900">Account &amp; access details</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="User ID" value={<span className="font-mono text-xs">{learner.id}</span>} />
          <Field label="Account type" value={accountType} />
          <Field label="Current plan" value={learner.plan || 'free'} />
          <Field label="Plan period" value={learner.plan_period} />
          <Field label="Access expires" value={formatDate(learner.plan_expires_at)} />
          <Field label="Account created" value={formatDate(learner.created_at)} />
          <Field label="Latest PayPal order" value={<span className="font-mono text-xs">{learner.paypal_order_id || '—'}</span>} />
          <Field label="Latest PayPal capture" value={<span className="font-mono text-xs">{learner.paypal_capture_id || '—'}</span>} />
          <Field label="Last account update" value={formatDate(learner.updated_at)} />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Payment and refund history</h2>
          <p className="mt-1 text-xs text-gray-500">Select any transaction to inspect its PayPal identifiers and generated documents.</p>
        </div>
        {history.length ? (
          <div className="divide-y divide-gray-100">
            {history.map((receipt) => {
              const isRefunded = receipt.status === 'refunded'
              return (
                <Link key={receipt.id} href={`/admin/billing/${receipt.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/60 transition-colors group">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isRefunded ? 'bg-rose-100' : 'bg-emerald-100'}`}>{isRefunded ? '↩️' : '✅'}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 capitalize">{receipt.plan} · {receipt.plan_period}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${isRefunded ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{receipt.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{receipt.receipt_number || receipt.paypal_order_id || '—'} · {formatDate(receipt.created_at)}</p>
                  </div>
                  <p className={`text-sm font-bold ${isRefunded ? 'text-rose-700' : 'text-gray-900'}`}>${Number(receipt.amount || 0).toFixed(2)} <span className="text-xs font-normal text-gray-400">{receipt.currency}</span></p>
                  <span className="text-sm text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-3xl">💳</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">No payment history for this learner</p>
          </div>
        )}
      </section>
    </div>
  )
}
