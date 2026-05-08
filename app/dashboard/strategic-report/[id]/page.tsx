import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StrategicReportClient from './ReportClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StrategicReportPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: report } = await supabase
    .from('strategic_reports')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!report) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const { data: reportHistory } = await supabase
    .from('strategic_reports')
    .select('id, readiness_score, overall_pct, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(20)

  const learnerName = profile?.full_name || profile?.email?.split('@')[0] || 'Learner'

  return (
    <StrategicReportClient
      reportRow={report}
      learnerName={learnerName}
      reportHistory={reportHistory || []}
    />
  )
}
