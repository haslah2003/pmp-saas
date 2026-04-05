import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch guru reports (most recent first)
    const { data: guruReports } = await supabase
      .from('guru_reports')
      .select('id, overall_score, overall_correct, overall_total, framework, blocks_completed, created_at, badge_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    // Fetch all badges
    const { data: badges } = await supabase
      .from('badges')
      .select('id, badge_type, badge_name, badge_description, badge_icon, domain, score, questions_count, earned_at')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })

    // Stats
    const totalReports = guruReports?.length || 0
    const totalBadges = badges?.length || 0
    const bestScore = guruReports && guruReports.length > 0
      ? Math.max(...guruReports.map(r => r.overall_score))
      : 0
    const avgScore = guruReports && guruReports.length > 0
      ? Math.round(guruReports.reduce((s, r) => s + r.overall_score, 0) / guruReports.length)
      : 0

    return NextResponse.json({
      guruReports: guruReports || [],
      badges: badges || [],
      stats: {
        totalReports,
        totalBadges,
        bestScore,
        avgScore,
      },
    })
  } catch (err) {
    console.error('Portfolio API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
