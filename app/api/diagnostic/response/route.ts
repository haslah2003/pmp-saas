import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { clampItemSeconds } from '@/lib/diagnostic/runtime';
import { diagnosticIdentity } from '@/lib/diagnostic/server-session';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { itemId?: string; selectedOption?: string | null; secondsOnItem?: number; currentPosition?: number; flaggedItemIds?: string[]; submit?: boolean };
    const { candidateId, sessionId } = await diagnosticIdentity();
    if (!sessionId) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    const admin = createAdminClient();
    const { data: session } = await admin.from('diagnostic_sessions').select('*').eq('id', sessionId).eq('candidate_id', candidateId).eq('status', 'in_progress').maybeSingle();
    if (!session) return NextResponse.json({ error: 'Active session not found' }, { status: 404 });

    if (body.itemId) {
      const { data: formItem } = await admin.from('diagnostic_form_items').select('item_id,option_order').eq('form_id', session.form_id).eq('item_id', body.itemId).maybeSingle();
      if (!formItem) return NextResponse.json({ error: 'Item is not part of this form' }, { status: 400 });
      if (body.selectedOption != null && !formItem.option_order.includes(body.selectedOption)) return NextResponse.json({ error: 'Invalid option' }, { status: 400 });
      const { data: canonicalItem } = await admin.from('diagnostic_items').select('key').eq('id', body.itemId).single();
      if (!canonicalItem) throw new Error('Diagnostic item not found');
      const response = {
        session_id: session.id, form_id: session.form_id, item_id: body.itemId,
        selected_option: body.selectedOption || null, presented_order: formItem.option_order,
        seconds_on_item: clampItemSeconds(body.secondsOnItem),
        correct: body.selectedOption ? body.selectedOption === canonicalItem.key : null,
        answered_at: body.selectedOption ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
      };
      const { error } = await admin.from('diagnostic_responses').upsert(response, { onConflict: 'session_id,item_id' });
      if (error) throw error;
    }

    const update: Record<string, unknown> = { last_activity_at: new Date().toISOString() };
    if (Number.isInteger(body.currentPosition) && Number(body.currentPosition) > 0) update.current_position = body.currentPosition;
    if (Array.isArray(body.flaggedItemIds)) update.flagged_item_ids = body.flaggedItemIds;
    if (body.submit) {
      const { count } = await admin.from('diagnostic_responses').select('id', { count: 'exact', head: true }).eq('session_id', session.id).not('selected_option', 'is', null);
      const { data: form } = await admin.from('diagnostic_forms').select('form_length').eq('id', session.form_id).single();
      if (!form) throw new Error('Diagnostic form not found');
      if (count !== form.form_length) return NextResponse.json({ error: `Answer all ${form.form_length} items before submitting.` }, { status: 400 });
      update.status = 'submitted';
      update.submitted_at = new Date().toISOString();
    }
    const { error: updateError } = await admin.from('diagnostic_sessions').update(update).eq('id', session.id);
    if (updateError) throw updateError;
    return NextResponse.json({ saved: true, submitted: Boolean(body.submit) });
  } catch (error) {
    console.error('Diagnostic autosave failed:', error);
    return NextResponse.json({ error: 'Unable to save diagnostic response' }, { status: 500 });
  }
}
