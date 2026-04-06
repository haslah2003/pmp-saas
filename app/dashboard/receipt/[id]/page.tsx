import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReceiptClient from './ReceiptClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReceiptPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: receipt } = await supabase
    .from('payment_receipts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!receipt) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  return (
    <ReceiptClient
      receipt={receipt}
      learnerName={profile?.full_name || profile?.email || 'Learner'}
      learnerEmail={profile?.email || ''}
    />
  )
}
