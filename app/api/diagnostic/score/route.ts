import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { diagnosticIdentity } from '@/lib/diagnostic/server-session';
import { ColdStartScoringStrategy, type ScoringItem } from '@/lib/diagnostic/scoring';

export async function POST() {
  try {
    const { candidateId, sessionId } = await diagnosticIdentity();
    if (!sessionId) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    const admin = createAdminClient();
    const { data: session } = await admin.from('diagnostic_sessions').select('id,form_id,status').eq('id', sessionId).eq('candidate_id', candidateId).maybeSingle();
    if (!session || session.status !== 'submitted') return NextResponse.json({ error: 'Submit the diagnostic before scoring.' }, { status: 400 });

    const { data: formItems, error: formError } = await admin.from('diagnostic_form_items').select('item_id').eq('form_id', session.form_id);
    if (formError) throw formError;
    const itemIds = (formItems || []).map((entry) => entry.item_id);
    const { data: items, error: itemError } = await admin.from('diagnostic_items').select('id,domain,eco_task,key,answer_keys').in('id', itemIds);
    if (itemError) throw itemError;
    const { data: responses, error: responseError } = await admin.from('diagnostic_responses').select('item_id,selected_option,selected_options').eq('session_id', session.id);
    if (responseError) throw responseError;
    if ((responses || []).filter((response) => response.selected_options?.length || response.selected_option).length !== itemIds.length) return NextResponse.json({ error: 'The response set is incomplete.' }, { status: 409 });

    const scoringItems = (items || []).map((item) => ({ id: item.id, domain: item.domain, ecoTask: item.eco_task, key: item.key, keys: item.answer_keys || [item.key], difficultyB: 0, discriminationA: null })) as ScoringItem[];
    const result = new ColdStartScoringStrategy().score((responses || []).map((response) => ({ itemId: response.item_id, selectedOption: response.selected_option || '', selectedOptions: response.selected_options || (response.selected_option ? [response.selected_option] : []) })), scoringItems);
    const resultRow = {
      session_id: session.id, strategy: result.strategy, strategy_version: result.strategyVersion,
      weighted_score: result.weightedScore, theta: result.theta, standard_error: result.standardError,
      readiness_band: result.readinessBand, pass_probability_internal: result.passProbability,
      domain_scores: result.domainScores, eco_task_gaps: result.ecoTaskGaps, scored_at: new Date().toISOString(),
    };
    const { error: persistError } = await admin.from('diagnostic_results').upsert(resultRow, { onConflict: 'session_id' });
    if (persistError) throw persistError;
    return NextResponse.json({
      readinessBand: result.readinessBand, weightedScore: result.weightedScore,
      standardError: result.standardError, domainScores: result.domainScores, ecoTaskGaps: result.ecoTaskGaps,
      basis: 'Provisional cold-start domain-weighted model; calibration will be revised using observed response data.',
      disclaimer: 'Independent preparation instrument. Not affiliated with or endorsed by PMI, and not a prediction of official examination results.',
    });
  } catch (error) {
    console.error('Diagnostic scoring failed:', error);
    return NextResponse.json({ error: 'Unable to score diagnostic' }, { status: 500 });
  }
}
