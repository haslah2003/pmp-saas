import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isExamPathId, normalizeExamPath, type ExamPathId } from '@/lib/pmp/exam-paths'
import type { TrackId } from '@/lib/pmp-path/types'

function examPathToTrackId(path: ExamPathId): TrackId {
  if (path === 'pmbok8') return 'pmbok8-eco2026'
  if (path === 'bridge') return 'bridge-7-to-8'
  return 'pmbok7-eco2021'
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('active_framework')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      active_framework: normalizeExamPath(profile?.active_framework),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const requestedPath = body?.active_framework ?? body?.examPath ?? body?.framework

    if (!isExamPathId(requestedPath)) {
      return NextResponse.json(
        { error: 'Invalid PMP exam path.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('profiles')
      .update({ active_framework: requestedPath })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const activeTrack = examPathToTrackId(requestedPath)

    const { error: prefError } = await supabase
      .from('user_path_pref')
      .upsert(
        {
          user_id: user.id,
          active_track: activeTrack,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (prefError) {
      return NextResponse.json({ error: prefError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      active_framework: requestedPath,
      active_track: activeTrack,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
