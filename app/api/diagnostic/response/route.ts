import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { clampItemSeconds } from '@/lib/diagnostic/runtime';
import { diagnosticIdentity } from '@/lib/diagnostic/server-session';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { itemId?: string; selectedOption?: string | null; selectedOptions?: string[]; secondsOnItem?: number; currentPosition?: number; flaggedItemIds?: string[]; submit?: boolean };
    const { candidateId, sessionId } = await diagnosticIdentity();
    if (!sessionId) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    const admin = createAdminClient();
    const { data: session } = await admin.from('diagnostic_sessions').select('*').eq('id', sessionId).eq('candidate_id', candidateId).eq('status', 'in_progress').maybeSingle();
    if (!session) return NextResponse.json({ error: 'Active session not found' }, { status: 404 });

    if (body.itemId) {
      const { data: formItem } = await admin.from('diagnostic_form_items').select('item_id,option_order').eq('form_id', session.form_id).eq('item_id', body.itemId).maybeSingle();
      if (!formItem) return NextResponse.json({ error: 'Item is not part of this form' }, { status: 400 });
      const selectedOptions = [...new Set(body.selectedOptions || (body.selectedOption ? [body.selectedOption] : []))];
      if (selectedOptions.some((option) => !formItem.option_order.includes(option))) return NextResponse.json({ error: 'Invalid option' }, { status: 400 });
      const { data: canonicalItem } = await admin.from('diagnostic_items').select('key,answer_keys,item_type,option_traps').eq('id', body.itemId).single();
      if (!canonicalItem) throw new Error('Diagnostic item not found');
      if (canonicalItem.item_type !== 'multiple_response' && selectedOptions.length > 1) return NextResponse.json({ error: 'Select one option for this item.' }, { status: 400 });
      const answerKeys = [...(canonicalItem.answer_keys?.length ? canonicalItem.answer_keys : [canonicalItem.key])].sort();
      const submittedKeys = [...selectedOptions].sort();
      const correct = submittedKeys.length === answerKeys.length && submittedKeys.every((value, index) => value === answerKeys[index]);
      const selectedTraps = selectedOptions.filter((option) => !answerKeys.includes(option)).flatMap((option) => canonicalItem.option_traps?.[option] || []);
      const response = {
        session_id: session.id, form_id: session.form_id, item_id: body.itemId,
        selected_option: selectedOptions.length === 1 ? selectedOptions[0] : null,
        selected_options: selectedOptions, selected_traps: selectedTraps,
        presented_order: formItem.option_order,
        seconds_on_item: clampItemSeconds(body.secondsOnItem),
        correct: selectedOptions.length ? correct : null,
        answered_at: selectedOptions.length ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
      };
      const { error } = await admin.from('diagnostic_responses').upsert(response, { onConflict: 'session_id,item_id' });
      if (error) throw error;
    }

    const update: Record<string, unknown> = { last_activity_at: new Date().toISOString() };
    if (Number.isInteger(body.currentPosition) && Number(body.currentPosition) > 0) update.current_position = body.currentPosition;
    if (Array.isArray(body.flaggedItemIds)) update.flagged_item_ids = body.flaggedItemIds;
    if (body.submit) {
      const { data: completedResponses } = await admin.from('diagnostic_responses').select('item_id,selected_option,selected_options').eq('session_id', session.id);
      const { data: form } = await admin.from('diagnostic_forms').select('form_length').eq('id', session.form_id).single();
      if (!form) throw new Error('Diagnostic form not found');
      const count = (completedResponses || []).filter((response) => response.selected_options?.length || response.selected_option).length;
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
