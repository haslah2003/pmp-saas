import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { assembleDiagnosticForm, blueprintFor, type AssemblyItem, type DiagnosticFormLength } from '@/lib/diagnostic/assembler';
import { candidateItemPayload, deterministicOptionOrder, type StoredDiagnosticItem } from '@/lib/diagnostic/runtime';
import { diagnosticCookieOptions, diagnosticIdentity, DIAGNOSTIC_CANDIDATE_COOKIE, DIAGNOSTIC_SESSION_COOKIE } from '@/lib/diagnostic/server-session';

async function snapshot(sessionId: string, candidateId: string) {
  const admin = createAdminClient();
  const { data: session } = await admin.from('diagnostic_sessions').select('*').eq('id', sessionId).eq('candidate_id', candidateId).maybeSingle();
  if (!session) return null;
  const { data: form } = await admin.from('diagnostic_forms').select('*').eq('id', session.form_id).single();
  const { data: formItems } = await admin.from('diagnostic_form_items').select('*').eq('form_id', session.form_id).order('position');
  const ids = (formItems || []).map((row) => row.item_id);
  const { data: items } = ids.length
    ? await admin.from('diagnostic_items').select('id,stem,options,domain,item_type,visual_spec').in('id', ids)
    : { data: [] };
  const { data: responses } = await admin.from('diagnostic_responses').select('item_id,selected_option,selected_options,seconds_on_item').eq('session_id', session.id);
  const itemMap = new Map((items || []).map((item) => [item.id, item]));
  return {
    session: { id: session.id, status: session.status, currentPosition: session.current_position, flaggedItemIds: session.flagged_item_ids, startedAt: session.started_at, locale: session.locale },
    form: { id: form.id, length: form.form_length, trackId: form.track_id },
    items: (formItems || []).map((entry) => {
      const item = itemMap.get(entry.item_id);
      return item ? { position: entry.position, ...candidateItemPayload({ ...item, itemType: item.item_type, visualSpec: item.visual_spec, trackId: form.track_id, approach: 'predictive', difficultyB: 0, cognitiveLevel: 'analysis', exposureCount: 0 } as StoredDiagnosticItem, entry.option_order) } : null;
    }).filter(Boolean),
    responses: responses || [],
  };
}

export async function GET() {
  const { candidateId, sessionId } = await diagnosticIdentity();
  if (!sessionId) return NextResponse.json({ session: null });
  const data = await snapshot(sessionId, candidateId);
  return data ? NextResponse.json(data) : NextResponse.json({ session: null });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      length?: number; locale?: string; trackId?: string; learnerName?: string;
      learnerEmail?: string; marketingConsent?: boolean; acquisitionSource?: string;
    };
    const length: DiagnosticFormLength = body.length === 60 ? 60 : 32;
    const locale = body.locale === 'ar' ? 'ar' : 'en';
    const trackId = body.trackId || 'pmbok8';
    if (!['pmbok8', 'bridge'].includes(trackId)) return NextResponse.json({ error: 'Invalid diagnostic pathway' }, { status: 400 });
    const learnerName = String(body.learnerName || '').trim().slice(0, 120);
    const learnerEmail = String(body.learnerEmail || '').trim().toLowerCase().slice(0, 254);
    if (!learnerName || !/^\S+@\S+\.\S+$/.test(learnerEmail)) return NextResponse.json({ error: 'Name and valid email are required' }, { status: 400 });
    const { store, candidateId, sessionId } = await diagnosticIdentity();
    if (sessionId) {
      const existing = await snapshot(sessionId, candidateId);
      if (existing?.session.status === 'in_progress') return NextResponse.json(existing);
    }

    const admin = createAdminClient();
    const { data: rows, error } = await admin.from('diagnostic_items')
      .select('id,track_id,domain,approach,eco_task_code,author_difficulty_band,cognitive_level,exposure_count,stem,options')
      .eq('track_id', trackId).eq('status', 'live');
    if (error) throw error;
    const { data: priorSessions } = await admin.from('diagnostic_sessions').select('id').eq('candidate_id', candidateId);
    const priorIds = (priorSessions || []).map((item) => item.id);
    const cutoff = new Date(Date.now() - 90 * 86400000).toISOString();
    const { data: exposures } = priorIds.length
      ? await admin.from('diagnostic_responses').select('item_id,answered_at').in('session_id', priorIds).gte('answered_at', cutoff)
      : { data: [] };
    const lastSeen = new Map((exposures || []).map((item) => [item.item_id, item.answered_at]));
    const items = (rows || []).map((item) => ({
      id: item.id, trackId: item.track_id, domain: item.domain, approach: item.approach,
      difficultyB: item.author_difficulty_band === 'foundational' ? -0.8 : item.author_difficulty_band === 'advanced' ? 0.8 : 0,
      cognitiveLevel: item.cognitive_level, ecoTaskCode: item.eco_task_code,
      exposureCount: Number(item.exposure_count || 0), lastSeenAt: lastSeen.get(item.id),
    })) as AssemblyItem[];
    const formSeed = randomUUID();
    const selected = assembleDiagnosticForm(items, { trackId, length, candidateId, formSeed });
    const { data: form, error: formError } = await admin.from('diagnostic_forms').insert({ track_id: trackId, form_length: length, form_seed: formSeed, blueprint: blueprintFor(length) }).select('id').single();
    if (formError) throw formError;
    const formItems = selected.map((item, index) => ({ form_id: form.id, item_id: item.id, position: index + 1, option_order: deterministicOptionOrder(item.id, formSeed) }));
    const { error: itemError } = await admin.from('diagnostic_form_items').insert(formItems);
    if (itemError) throw itemError;
    const { data: session, error: sessionError } = await admin.from('diagnostic_sessions').insert({
      candidate_id: candidateId, form_id: form.id, locale,
      learner_name: learnerName, learner_email: learnerEmail,
      marketing_consent: Boolean(body.marketingConsent),
      marketing_consent_at: body.marketingConsent ? new Date().toISOString() : null,
      acquisition_source: String(body.acquisitionSource || 'direct').slice(0, 80),
    }).select('id').single();
    if (sessionError) throw sessionError;
    store.set(DIAGNOSTIC_CANDIDATE_COOKIE, candidateId, diagnosticCookieOptions());
    store.set(DIAGNOSTIC_SESSION_COOKIE, session.id, diagnosticCookieOptions());
    return NextResponse.json(await snapshot(session.id, candidateId), { status: 201 });
  } catch (error) {
    console.error('Diagnostic session creation failed:', error);
    const message = error instanceof Error ? error.message : 'Unable to create diagnostic session';
    return NextResponse.json({ error: message }, { status: message.includes('unsatisfiable') ? 409 : 500 });
  }
}
