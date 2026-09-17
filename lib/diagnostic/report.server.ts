import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { buildIndividualReport, type ReportItem, type ReportResponse, type StoredScore } from './report';

const trackLabels: Record<string, { en: string; ar: string }> = {
  pmbok7: { en: 'Retired PMP Path - PMBOK 7 + ECO 2021', ar: 'مسار PMP المتقاعد - PMBOK 7 + ECO 2021' },
  'pmbok7-eco2021': { en: 'Retired PMP Path - PMBOK 7 + ECO 2021', ar: 'مسار PMP المتقاعد - PMBOK 7 + ECO 2021' },
  pmbok8: { en: 'Current PMP Path - PMBOK 8 + ECO 2026', ar: 'مسار PMP الحالي - PMBOK 8 + ECO 2026' },
  'pmbok8-eco2026': { en: 'Current PMP Path - PMBOK 8 + ECO 2026', ar: 'مسار PMP الحالي - PMBOK 8 + ECO 2026' },
  bridge: { en: 'Bridge Mode - PMBOK 7 to PMBOK 8', ar: 'المسار الانتقالي - من PMBOK 7 إلى PMBOK 8' },
  'bridge-7-to-8': { en: 'Bridge Mode - PMBOK 7 to PMBOK 8', ar: 'المسار الانتقالي - من PMBOK 7 إلى PMBOK 8' },
};

export async function loadIndividualReport(sessionId: string, candidateId: string) {
  const admin = createAdminClient();
  const { data: session } = await admin.from('diagnostic_sessions').select('id,form_id,status,locale,learner_name,started_at,submitted_at').eq('id', sessionId).eq('candidate_id', candidateId).maybeSingle();
  if (!session || session.status !== 'submitted') return null;
  const { data: result } = await admin.from('diagnostic_results').select('*').eq('session_id', session.id).maybeSingle();
  if (!result) return null;
  const { data: responses } = await admin.from('diagnostic_responses').select('item_id,selected_option,selected_options,correct,seconds_on_item').eq('session_id', session.id);
  const ids = (responses || []).map((response) => response.item_id);
  const { data: items } = ids.length ? await admin.from('diagnostic_items').select('id,stem,stem_ar,domain,approach,eco_task,cognitive_level,rationale_distractors,rationale_distractors_ar').in('id', ids) : { data: [] };
  const { data: form } = await admin.from('diagnostic_forms').select('track_id').eq('id', session.form_id).maybeSingle();
  const { count: attemptCount } = await admin.from('diagnostic_sessions').select('id', { count: 'exact', head: true }).eq('candidate_id', candidateId).eq('status', 'submitted').lte('submitted_at', session.submitted_at || new Date().toISOString());
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  let fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  if (user) {
    const { data: profile } = await admin.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
    fullName = profile?.full_name || fullName;
  }
  const score: StoredScore = { readinessBand: result.readiness_band, weightedScore: Number(result.weighted_score), standardError: Number(result.standard_error), domainScores: result.domain_scores, ecoTaskGaps: result.eco_task_gaps };
  const locale = session.locale === 'ar' ? 'ar' : 'en';
  const report = buildIndividualReport(score,
    (responses || []).map((response) => ({ itemId: response.item_id, selectedOption: response.selected_option || '', selectedOptions: response.selected_options || (response.selected_option ? [response.selected_option] : []), correct: Boolean(response.correct), seconds: Number(response.seconds_on_item) })) as ReportResponse[],
    (items || []).map((item) => {
      if (locale === 'ar' && (!item.stem_ar || !item.rationale_distractors_ar)) throw new Error(`Arabic report content is incomplete for item ${item.id}`);
      return { id: item.id, stem: locale === 'ar' ? item.stem_ar : item.stem, domain: item.domain, approach: item.approach, ecoTask: item.eco_task, cognitiveLevel: item.cognitive_level, rationaleDistractors: locale === 'ar' ? item.rationale_distractors_ar : item.rationale_distractors };
    }) as ReportItem[], locale);
  return {
    session: { id: session.id, startedAt: session.started_at, submittedAt: session.submitted_at },
    report: {
      ...report,
      learner: {
        fullName: String(session.learner_name || fullName || 'Guest learner'),
        reportId: `PMP-${session.id.replace(/-/g, '').slice(0, 10).toUpperCase()}`,
        assessedAt: session.submitted_at || session.started_at,
        attempt: attemptCount || 1,
        language: locale === 'ar' ? 'العربية' : 'English',
        pathway: trackLabels[form?.track_id || '']?.[locale] || (locale === 'ar' ? 'تشخيص الجاهزية لاختبار PMP' : 'PMP Readiness Diagnostic'),
        validity: locale === 'ar' ? 'يعكس هذا التقرير مستوى الجاهزية في تاريخ التقييم، وينبغي تحديثه بعد إتمام دراسة مركزة.' : 'This report reflects readiness at the assessment date and should be refreshed after focused study.',
      },
    },
  };
}
