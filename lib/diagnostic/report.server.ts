import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildIndividualReport, type ReportItem, type ReportResponse, type StoredScore } from './report';

export async function loadIndividualReport(sessionId: string, candidateId: string) {
  const admin = createAdminClient();
  const { data: session } = await admin.from('diagnostic_sessions').select('id,form_id,status,started_at,submitted_at').eq('id', sessionId).eq('candidate_id', candidateId).maybeSingle();
  if (!session || session.status !== 'submitted') return null;
  const { data: result } = await admin.from('diagnostic_results').select('*').eq('session_id', session.id).maybeSingle();
  if (!result) return null;
  const { data: responses } = await admin.from('diagnostic_responses').select('item_id,selected_option,correct,seconds_on_item').eq('session_id', session.id);
  const ids = (responses || []).map((response) => response.item_id);
  const { data: items } = ids.length ? await admin.from('diagnostic_items').select('id,stem,domain,approach,eco_task,cognitive_level,rationale_distractors').in('id', ids) : { data: [] };
  const score: StoredScore = { readinessBand: result.readiness_band, weightedScore: Number(result.weighted_score), standardError: Number(result.standard_error), domainScores: result.domain_scores, ecoTaskGaps: result.eco_task_gaps };
  return {
    session: { id: session.id, startedAt: session.started_at, submittedAt: session.submitted_at },
    report: buildIndividualReport(score,
      (responses || []).map((response) => ({ itemId: response.item_id, selectedOption: response.selected_option, correct: Boolean(response.correct), seconds: Number(response.seconds_on_item) })) as ReportResponse[],
      (items || []).map((item) => ({ id: item.id, stem: item.stem, domain: item.domain, approach: item.approach, ecoTask: item.eco_task, cognitiveLevel: item.cognitive_level, rationaleDistractors: item.rationale_distractors })) as ReportItem[]),
  };
}
