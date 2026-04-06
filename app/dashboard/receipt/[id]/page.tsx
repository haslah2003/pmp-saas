import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ReceiptClient from './ReceiptClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReceiptPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const adminSupabase = createAdminClient()

  const { data: receipt } = await adminSupabase
    .from('payment_receipts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!receipt) notFound()

  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // Get branding logo
  const { data: branding } = await adminSupabase
    .from('branding_config')
    .select('logo_url, site_name')
    .eq('id', 1)
    .single()

  return (
    <ReceiptClient
      receipt={receipt}
      learnerName={profile?.full_name || profile?.email || 'Learner'}
      learnerEmail={profile?.email || ''}
      logoUrl={branding?.logo_url || null}
      siteName={branding?.site_name || 'PMP Expert Tutor'}
    />
  )
}
