// Seed bilingual (EN+AR) single_response questions into the questions table.
// Cells to fill are defined in CELL_PLAN below. Skips exact-duplicate question_text.
// Usage: node seed-questions.js [--dry-run] [--plan pmbok8|bridge|all]
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const planIdx = args.indexOf('--plan');
const PLAN_FILTER = planIdx >= 0 ? args[planIdx + 1] : 'all';
const maxIdx = args.indexOf('--max-batches');
const MAX_BATCHES = maxIdx >= 0 ? parseInt(args[maxIdx + 1], 10) : Infinity;

const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const MODEL = env.ANTHROPIC_MODEL || 'claude-opus-4-8';

// domain, difficulty, total count
const PMBOK8_CELLS = [
  ['process', 'challenging', 40],
  ['business-environment', 'difficult', 40],
  ['business-environment', 'challenging', 40],
];
// bridge: 12 per cell across the full 3x4 grid
const BRIDGE_CELLS = [];
for (const d of ['people', 'process', 'business-environment'])
  for (const f of ['entry', 'paced', 'difficult', 'challenging'])
    BRIDGE_CELLS.push([d, f, 12]);

const DOMAIN_LABEL = {
  people: 'People',
  process: 'Process',
  'business-environment': 'Business Environment',
};

const DIFFICULTY_GUIDE = {
  entry: 'Entry level: single clear concept, direct application, one obviously best answer for a prepared candidate.',
  paced: 'Paced level: realistic scenario requiring applying a concept correctly among plausible alternatives.',
  difficult: 'Difficult level: multi-factor scenario, competing priorities, distractors that are reasonable actions but not the BEST next action.',
  challenging: 'Challenging level: ambiguous situational judgment, senior-level trade-offs, strong distractors that experienced PMs would be tempted by.',
};

const FRAMEWORK_CONTEXT = {
  pmbok8: `Framework: PMBOK 8 + ECO 2026 (the new PMP exam effective July 2026).
Domain weights: People 33%, Process 41%, Business Environment 26%.
Emphasize: value delivery, tailoring across predictive/adaptive/hybrid, integrated governance, sustainability and organizational strategy alignment, stakeholder trust, servant leadership, finance-aware delivery decisions.
eco_reference wording example: "ECO 2026 - Business Environment domain: organizational strategy alignment and external change". Never invent fake task numbers.`,
  bridge: `Framework: BRIDGE questions for certified/prepared PMBOK 7 candidates transitioning to PMBOK 8 + ECO 2026.
Every question must hinge on something NEW, CHANGED, or RE-WEIGHTED between ECO 2021/PMBOK 7 and ECO 2026/PMBOK 8 — e.g., Business Environment weight rising 8%→26%, consolidated performance domains, new emphasis on sustainability/ESG, finance fluency, AI-augmented delivery, tailoring governance, updated terminology. The wrong answers should often be "what was correct/typical thinking under the old exam" while the correct answer reflects the PMBOK 8 / ECO 2026 way.
eco_reference wording example: "ECO 2026 shift - Business Environment: expanded external analysis (vs ECO 2021)". Never invent fake task numbers.`,
};

const SYSTEM = `You are a senior PMP exam item writer producing bilingual (English + Modern Standard Arabic) exam questions indistinguishable in quality from real PMI items.

Arabic rules: formal MSA, platform terminology stakeholder = "معني", project manager = "مدير المشروع"; keep PMP, PMBOK, ECO, PMI, Agile, Scrum, WBS, EVM in English where precision requires.

Quality rules:
- Scenario-based stems (2-4 sentences), realistic organizations and roles, no "all of the above", no negatives like "NOT".
- Exactly four options a-d, one unambiguously BEST answer, distractors plausible and diagnostic.
- The explanation must state why the correct option is best AND why each distractor is inferior.
- rita_tip: one short exam-technique tip in the style of Rita Mulcahy.
- No two questions in a batch may share the same scenario setting or test the same micro-concept.
Return ONLY valid JSON, no markdown fences.`;

async function anthropicJSON(prompt, maxTokens) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: SYSTEM,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 20000 * attempt));
        continue;
      }
      throw new Error(`Anthropic ${res.status}: ${txt.slice(0, 200)}`);
    }
    const data = await res.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    const cleaned = text.trim().replace(/^```(json)?/g, '').replace(/```$/g, '').trim();
    try { return JSON.parse(cleaned); } catch (e) { if (attempt === 3) throw new Error('JSON parse failed'); }
  }
  throw new Error('exhausted retries');
}

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

function buildPrompt(framework, domain, difficulty, count, answerKeys, existingSample) {
  return `${FRAMEWORK_CONTEXT[framework]}

Domain: ${DOMAIN_LABEL[domain]}
${DIFFICULTY_GUIDE[difficulty]}

Write ${count} bilingual PMP exam questions for this domain and difficulty.
Mandatory correct answers, in order: ${answerKeys.map((k, i) => `question ${i + 1} → "${k}"`).join(', ')}.

Avoid overlapping with these existing question openings:
${existingSample.map((t) => `- ${t.slice(0, 90)}`).join('\n') || '- (none)'}

Return a JSON array of ${count} objects, each with EXACTLY these fields:
{
  "subdomain": "short concept label in English",
  "question_text": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...",
  "correct_answer": "a|b|c|d (as mandated)",
  "explanation": "...", "rita_tip": "...",
  "eco_reference": "...", "pmbok_reference": "PMBOK area reference, no fake page numbers",
  "question_text_ar": "...", "option_a_ar": "...", "option_b_ar": "...", "option_c_ar": "...", "option_d_ar": "...",
  "explanation_ar": "...", "rita_tip_ar": "..."
}`;
}

(async () => {
  const plans = [];
  if (PLAN_FILTER === 'all' || PLAN_FILTER === 'pmbok8')
    for (const [d, f, n] of PMBOK8_CELLS) plans.push({ framework: 'pmbok8', domain: d, difficulty: f, count: n });
  if (PLAN_FILTER === 'all' || PLAN_FILTER === 'bridge')
    for (const [d, f, n] of BRIDGE_CELLS) plans.push({ framework: 'bridge', domain: d, difficulty: f, count: n });

  // existing texts for duplicate guard + prompt hints
  const existingTexts = new Set();
  const byCell = {};
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('questions')
      .select('framework,domain,difficulty,question_text').range(from, from + 999);
    if (error) throw error;
    for (const r of data) {
      existingTexts.add(r.question_text.trim().toLowerCase());
      const k = `${r.framework}|${r.domain}|${r.difficulty}`;
      (byCell[k] ||= []).push(r.question_text);
    }
    if (data.length < 1000) break;
  }

  const ANSWER_ROTATION = ['a', 'b', 'c', 'd'];
  let inserted = 0, skippedDup = 0, failed = 0;
  const BATCH = 3;

  // work queue of batches across all plans
  const jobs = [];
  for (const plan of plans) {
    let remaining = plan.count;
    let batchNo = 0;
    while (remaining > 0) {
      const n = Math.min(BATCH, remaining);
      const keys = Array.from({ length: n }, (_, i) => ANSWER_ROTATION[(batchNo * BATCH + i) % 4]);
      jobs.push({ ...plan, n, keys });
      remaining -= n;
      batchNo++;
    }
  }
  if (jobs.length > MAX_BATCHES) jobs.length = MAX_BATCHES;
  console.log(`Plans: ${plans.length} cells, ${jobs.length} generation batches${DRY ? ' (dry-run)' : ''}`);

  let cursor = 0;
  async function worker(wid) {
    while (cursor < jobs.length) {
      const idx = cursor++;
      const job = jobs[idx];
      const cellKey = `${job.framework}|${job.domain}|${job.difficulty}`;
      try {
        const sample = (byCell[cellKey] || []).slice(-8);
        const out = await anthropicJSON(buildPrompt(job.framework, job.domain, job.difficulty, job.n, job.keys, sample), 9000);
        if (!Array.isArray(out)) throw new Error('not an array');
        const rows = [];
        for (const q of out) {
          const required = ['question_text','option_a','option_b','option_c','option_d','explanation',
            'question_text_ar','option_a_ar','option_b_ar','option_c_ar','option_d_ar','explanation_ar'];
          if (!q || required.some((f) => !nonEmpty(q[f]))) { failed++; continue; }
          const key = q.question_text.trim().toLowerCase();
          if (existingTexts.has(key)) { skippedDup++; continue; }
          existingTexts.add(key);
          const correct = String(q.correct_answer || 'a').trim().toLowerCase().charAt(0);
          rows.push({
            framework: job.framework,
            domain: job.domain,
            subdomain: String(q.subdomain || '').trim(),
            difficulty: job.difficulty,
            question_type: 'single_response',
            question_text: q.question_text.trim(),
            option_a: q.option_a.trim(), option_b: q.option_b.trim(),
            option_c: q.option_c.trim(), option_d: q.option_d.trim(),
            correct_answer: ['a','b','c','d'].includes(correct) ? correct : 'a',
            explanation: q.explanation.trim(),
            rita_tip: String(q.rita_tip || '').trim(),
            pmbok_reference: String(q.pmbok_reference || '').trim(),
            eco_reference: String(q.eco_reference || '').trim(),
            question_text_ar: q.question_text_ar.trim(),
            option_a_ar: q.option_a_ar.trim(), option_b_ar: q.option_b_ar.trim(),
            option_c_ar: q.option_c_ar.trim(), option_d_ar: q.option_d_ar.trim(),
            explanation_ar: q.explanation_ar.trim(),
            rita_tip_ar: String(q.rita_tip_ar || '').trim(),
            is_active: true,
          });
          (byCell[cellKey] ||= []).push(q.question_text);
        }
        if (DRY) {
          console.log(`[w${wid}] DRY ${cellKey} batch ${idx + 1}/${jobs.length}: ${rows.length} valid`);
          if (rows[0]) console.log('  EN:', rows[0].question_text.slice(0, 90), '\n  AR:', rows[0].question_text_ar.slice(0, 90));
          inserted += rows.length;
          continue;
        }
        if (rows.length > 0) {
          const { error } = await supabase.from('questions').insert(rows);
          if (error) { failed += rows.length; console.log(`[w${wid}] INSERT FAIL ${cellKey}: ${error.message}`); continue; }
          inserted += rows.length;
        }
        console.log(`[w${wid}] ${cellKey} batch ${idx + 1}/${jobs.length}: +${rows.length} (total=${inserted} dup=${skippedDup} failed=${failed})`);
      } catch (e) {
        failed += job.n;
        console.log(`[w${wid}] batch ${idx + 1} FAILED (${cellKey}): ${e.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: 3 }, (_, i) => worker(i + 1)));
  console.log(`\nSEEDING FINISHED: inserted=${inserted} duplicates_skipped=${skippedDup} failed=${failed}`);
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
