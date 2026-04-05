import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReportClient from './ReportClient'

interface Props {
  params: Promise<{ id: string }>
}

// Target Professional benchmarks (evidence-based PMP pass thresholds)
const TARGET_PROFESSIONAL: Record<string, number> = {
  overall: 80,
  People: 82,
  'people': 82,
  Process: 78,
  'process': 78,
  'Business Environment': 85,
  'business-environment': 85,
}

const ASPIRATIONAL: Record<string, number> = {
  overall: 95,
  People: 95,
  'people': 95,
  Process: 93,
  'process': 93,
  'Business Environment': 95,
  'business-environment': 95,
}

export default async function GuruReportPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: report } = await supabase
    .from('guru_reports')
    .select('*, badges(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!report) notFound()

  // Get user profile for name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // Get total reports count for this user
  const { count: totalReports } = await supabase
    .from('guru_reports')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get historical scores for trend
  const { data: pastReports } = await supabase
    .from('guru_reports')
    .select('overall_score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(10)

  const learnerName = profile?.full_name || profile?.email?.split('@')[0] || 'Learner'

  return (
    <ReportClient
      report={report}
      learnerName={learnerName}
      sessionNumber={totalReports || 1}
      targetBenchmarks={TARGET_PROFESSIONAL}
      aspirationalBenchmarks={ASPIRATIONAL}
      historicalScores={pastReports || []}
    />
  )
}
