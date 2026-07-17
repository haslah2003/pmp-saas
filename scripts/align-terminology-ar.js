// Align remaining Arabic terminology deviations to the official PMI PMBOK 8 glossary (Tier-1 authority).
// Targets two terms the earlier deterministic pass could not safely resolve:
//   issue   -> الإشكال   (NOT مشكلة / مسألة / قضية, when the English concept is "issue")
//   control -> التحكم    (NOT "ضبط ال...", when the English concept is control/controlling)
// Rewrites ONLY the *_ar fields, changing only these terms (morphology/agreement preserved),
// leaving everything else identical. Genuine "problem" (not "issue") is left untouched.
//
// Usage:
//   node scripts/align-terminology-ar.js --sample 3     # print before/after diffs, NO writes
//   node scripts/align-terminology-ar.js [--limit N]    # apply + write back
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
const sampleIdx = args.indexOf('--sample');
const SAMPLE = sampleIdx >= 0 ? parseInt(args[sampleIdx + 1], 10) : 0;
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const DRY = SAMPLE > 0; // sample mode never writes

const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const MODEL = env.ANTHROPIC_MODEL || 'claude-opus-4-8';

const norm = (x) => (x || '').replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');
const hasIssue = (t) => /مشكل|مسال|قضي|قضاي/.test(norm(t));
const hasCtl = (t) => /ضبط ال/.test(norm(t));
const AR_FIELDS = ['question_text_ar', 'option_a_ar', 'option_b_ar', 'option_c_ar', 'option_d_ar', 'explanation_ar', 'rita_tip_ar'];
const deviates = (q) => AR_FIELDS.some((f) => hasIssue(q[f]) || hasCtl(q[f]));

const SYSTEM = `You are a terminology editor for PMP (PMBOK 8 / ECO 2026) exam content in Modern Standard Arabic.

The official PMI PMBOK 8 Arabic glossary is the single Tier-1 authority. Align these two terms to the glossary form EXACTLY, wherever the English concept matches:
- "issue" (a current condition/matter to be resolved) => الإشكال  (do NOT keep مشكلة، مسألة، قضية for the concept "issue")
- "control" / "controlling" (the management activity) => التحكم  (do NOT keep "ضبط ال...")

Hard rules:
- Change ONLY these terms and only the words needed for correct Arabic grammar/agreement around them. Preserve every other word, number, option letter, and meaning verbatim.
- Preserve morphology: apply الإشكال / التحكم with correct case, definiteness, and plural (الإشكالات) as the sentence requires.
- If a مشكلة actually renders the English word "problem" (NOT "issue"), leave it unchanged. If ضبط renders a different concept (e.g. calibration), leave it unchanged. Use the provided English source to judge the concept.
- Keep acronyms/framework names in English: PMP, PMBOK, ECO, PMI, WBS, EVM, CPI, SPI.
- Return ONLY valid JSON, no markdown fences, no commentary.`;

async function anthropicJSON(prompt, maxTokens) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system: SYSTEM, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 15000 * attempt)); continue; }
      throw new Error(`Anthropic ${res.status}: ${txt.slice(0, 300)}`);
    }
    const data = await res.json();
    const usage = data.usage || {};
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    const cleaned = text.trim().replace(/^```(json)?/g, '').replace(/```$/g, '').trim();
    try { return { json: JSON.parse(cleaned), usage }; }
    catch (e) { if (attempt === 3) throw new Error(`JSON parse failed: ${cleaned.slice(0, 200)}`); }
  }
  throw new Error('exhausted retries');
}

function buildPrompt(q) {
  const arFields = {};
  for (const f of AR_FIELDS) if (typeof q[f] === 'string' && q[f].trim()) arFields[f] = q[f];
  return `English source (for concept reference only — do NOT translate it):
question_text: ${q.question_text || ''}
explanation: ${q.explanation || ''}

Arabic fields to align (return the SAME keys, aligned per the rules):
${JSON.stringify(arFields, null, 2)}

Return a JSON object with only the keys above, each holding the aligned Arabic string. If a field needs no change, return it unchanged.`;
}

(async () => {
  const rows = [];
  for (let f = 0; ; f += 1000) {
    const { data } = await supabase.from('questions').select('id,' + ['question_text', 'explanation'].concat(AR_FIELDS).join(','))
      .eq('is_active', true).range(f, f + 999);
    rows.push(...data); if (data.length < 1000) break;
  }
  let affected = rows.filter(deviates);
  console.log(`Affected questions (issue/control deviations): ${affected.length}`);
  if (SAMPLE > 0) affected = affected.slice(0, SAMPLE);
  else if (LIMIT !== Infinity) affected = affected.slice(0, LIMIT);

  let done = 0, changed = 0, inTok = 0, outTok = 0;
  for (const q of affected) {
    let out;
    try { out = await anthropicJSON(buildPrompt(q), 3000); }
    catch (e) { console.log('  FAIL', q.id, '-', e.message); continue; }
    inTok += out.usage.input_tokens || 0; outTok += out.usage.output_tokens || 0;
    const patch = {};
    for (const f of AR_FIELDS) {
      if (typeof out.json[f] === 'string' && out.json[f].trim() && out.json[f] !== q[f]) patch[f] = out.json[f];
    }
    done++;
    if (Object.keys(patch).length === 0) { if (SAMPLE) console.log(`\n[${q.id}] no change`); continue; }
    changed++;
    if (SAMPLE) {
      console.log(`\n=== ${q.id} ===`);
      for (const f of Object.keys(patch)) console.log(`  ${f}:\n   - ${q[f]}\n   + ${patch[f]}`);
    } else {
      const { error } = await supabase.from('questions').update(patch).eq('id', q.id);
      if (error) console.log('  WRITE FAIL', q.id, error.message);
      if (done % 20 === 0) console.log(`  ...${done}/${affected.length} processed, ${changed} changed`);
    }
  }
  const cost = (inTok / 1e6) * 5 + (outTok / 1e6) * 25;
  console.log(`\nProcessed ${done}, changed ${changed}. Tokens in=${inTok} out=${outTok} ~$${cost.toFixed(2)} (Opus 4.8)${DRY ? ' [SAMPLE — no writes]' : ''}`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
