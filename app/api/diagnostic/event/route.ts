import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { diagnosticIdentity } from '@/lib/diagnostic/server-session';

const allowed = new Set(['invitation_view','invitation_dismiss','cta_click','diagnostic_view','diagnostic_start','diagnostic_submit','report_view']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!allowed.has(body?.eventName)) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    const { candidateId, sessionId } = await diagnosticIdentity();
    await createAdminClient().from('diagnostic_conversion_events').insert({
      candidate_id: candidateId,
      session_id: sessionId || null,
      event_name: body.eventName,
      source: String(body.source || '').slice(0, 80) || null,
      path: String(body.path || '').slice(0, 240) || null,
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
