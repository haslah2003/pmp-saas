// Bulk-generate bilingual pmbok8 questions for the ECO 2026 interactive formats.
// Types: matching, ordering, multiple_response, pull_down.
// Each row is validated against its answer_data schema before insert; malformed rows are skipped.
// answer_data_ar mirrors answer_data with the SAME ids/keys, translated text.
//
// Usage:
//   node scripts/generate-interactive-bulk.js --sample            # 1 batch, print+validate, NO insert
//   node scripts/generate-interactive-bulk.js [--per N] [--only matching]   # full run, insert
const fs = require('fs');

const args = process.argv.slice(2);
const SAMPLE = args.includes('--sample');
const perIdx = args.indexOf('--per');
const PER = perIdx >= 0 ? parseInt(args[perIdx + 1], 10) : 4;
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const ROOT = require('path').resolve(__dirname, '..');
const env = {};
for (const line of fs.readFileSync(require('path').join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const MODEL = env.ANTHROPIC_MODEL || 'claude-opus-4-8';

// Supabase via raw PostgREST (avoids the @supabase/supabase-js node_modules dependency,
// which macOS TCC blocks from readdir under ~/Downloads).
const SB_HEADERS = {
  'Content-Type': 'application/json',
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
};
async function sbInsert(row) {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/questions`, {
    method: 'POST', headers: { ...SB_HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(row),
  });
  if (!res.ok) return { error: { message: `${res.status} ${(await res.text()).slice(0, 200)}` } };
  return {};
}

const DOMAINS = ['people', 'process', 'business-environment'];
const DIFFICULTIES = ['paced', 'difficult', 'challenging'];
const TYPES = ['matching', 'ordering', 'multiple_response', 'pull_down'];

const SYSTEM = `You are a senior PMP (PMBOK 8 / ECO 2026) exam item writer. You write original, exam-quality, situational questions in BOTH English and Modern Standard Arabic.

Global rules:
- Content must reflect PMBOK 8 and the PMP ECO 2026 (People / Process / Business Environment domains). Situational, not rote-definition.
- Keep acronyms/framework names in English inside Arabic: PMP, PMBOK, ECO, PMI, WBS, EVM, CPI, SPI, CCB.
- Arabic uses the platform glossary: stakeholder = "المعني", issue = "الإشكال", control = "التحكم", project manager = "مدير المشروع", exam = "اختبار".
- answer_data_ar MUST mirror answer_data EXACTLY: same ids and same option keys, only the human-readable text translated.
- Every question must be self-contained and unambiguous, with exactly one correct arrangement/selection.
- Return ONLY valid JSON (an array), no markdown fences, no commentary.`;

const SCHEMA = {
  matching: `Each item:
{
 "question_text": "...", "question_text_ar": "...",
 "explanation": "...", "explanation_ar": "...",
 "rita_tip": "short strategy tip", "rita_tip_ar": "...",
 "answer_data": {
   "items": [{"id":"i1","text":"..."}, ... 4-5 items],
   "categories": [{"id":"c1","label":"..."}, ... 2-4 categories],
   "correct": {"i1":"c1", ...}   // every item id -> a category id
 },
 "answer_data_ar": { "items":[{"id":"i1","text":"<AR>"},...], "categories":[{"id":"c1","label":"<AR>"},...], "correct": {same as above} }
}
Prompt: ask the candidate to drag each item into its correct category.`,
  ordering: `Each item:
{
 "question_text":"...","question_text_ar":"...",
 "explanation":"...","explanation_ar":"...",
 "rita_tip":"...","rita_tip_ar":"...",
 "answer_data": { "items":[{"id":"s1","text":"..."}, ... 4-5 steps], "correct_order":["s?","s?",...] },  // correct_order is a permutation of ALL item ids
 "answer_data_ar": { "items":[{"id":"s1","text":"<AR>"},...], "correct_order":[same ids in same correct order] }
}
Prompt: ask the candidate to arrange the steps in the correct sequence.`,
  multiple_response: `Each item:
{
 "question_text":"...","question_text_ar":"...",
 "explanation":"...","explanation_ar":"...",
 "rita_tip":"...","rita_tip_ar":"...",
 "answer_data": { "select_count":3, "options":{"a":"...","b":"...","c":"...","d":"...","e":"...","f":"..."}, "correct":["a","c","e"] },  // select_count === correct.length, 2 or 3
 "answer_data_ar": { "select_count":3, "options":{"a":"<AR>",...,"f":"<AR>"}, "correct":[same keys] }
}
Prompt: "Select N" — all correct options must be chosen.`,
  pull_down: `Each item:
{
 "question_text":"brief scenario/context",
 "question_text_ar":"...",
 "explanation":"...","explanation_ar":"...",
 "rita_tip":"...","rita_tip_ar":"...",
 "answer_data": { "blanks":[ {"id":"b1","prompt_before":"...","prompt_after":"...","options":["opt1","opt2","opt3"],"correct":"opt1"}, ... 1-3 blanks ] },
 "answer_data_ar": { "blanks":[ {"id":"b1","prompt_before":"<AR>","prompt_after":"<AR>","options":["<AR>",...],"correct":"<AR matching one option>"} ] }
}
Prompt: fill each blank from its dropdown.`,
};

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
    let text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    text = text.replace(/^```(json)?/g, '').replace(/```$/g, '').trim();
    try { return { json: JSON.parse(text), usage }; }
    catch (e) { if (attempt === 3) throw new Error(`JSON parse failed: ${text.slice(0, 160)}`); }
  }
}

const str = (x) => typeof x === 'string' && x.trim().length > 0;
function validate(type, q) {
  if (!['question_text', 'question_text_ar', 'explanation', 'explanation_ar'].every((f) => str(q[f]))) return false;
  const ad = q.answer_data, ar = q.answer_data_ar;
  if (!ad || !ar) return false;
  if (type === 'matching') {
    if (!Array.isArray(ad.items) || ad.items.length < 3) return false;
    if (!Array.isArray(ad.categories) || ad.categories.length < 2) return false;
    const cats = new Set(ad.categories.map((c) => c.id));
    if (!ad.items.every((i) => str(i.id) && str(i.text) && ad.correct && cats.has(ad.correct[i.id]))) return false;
    const arItemIds = new Set((ar.items || []).map((i) => i.id));
    return ad.items.every((i) => arItemIds.has(i.id)) && (ar.categories || []).length === ad.categories.length;
  }
  if (type === 'ordering') {
    if (!Array.isArray(ad.items) || ad.items.length < 3) return false;
    const ids = ad.items.map((i) => i.id);
    if (!ids.every(str) || !ad.items.every((i) => str(i.text))) return false;
    if (!Array.isArray(ad.correct_order) || ad.correct_order.length !== ids.length) return false;
    if ([...ad.correct_order].sort().join() !== [...ids].sort().join()) return false;
    return Array.isArray(ar.items) && ar.items.length === ids.length && Array.isArray(ar.correct_order);
  }
  if (type === 'multiple_response') {
    const opts = ad.options || {}; const keys = Object.keys(opts);
    if (keys.length < 4 || !keys.every((k) => str(opts[k]))) return false;
    if (!Array.isArray(ad.correct) || ad.correct.length < 2 || ad.correct.length > 3) return false;
    if (!ad.correct.every((k) => k in opts)) return false;
    if ((ar.options ? Object.keys(ar.options).length : 0) !== keys.length) return false;
    return true;
  }
  if (type === 'pull_down') {
    if (!Array.isArray(ad.blanks) || ad.blanks.length < 1 || ad.blanks.length > 3) return false;
    if (!ad.blanks.every((b) => str(b.id) && Array.isArray(b.options) && b.options.length >= 2 && b.options.includes(b.correct))) return false;
    return Array.isArray(ar.blanks) && ar.blanks.length === ad.blanks.length;
  }
  return false;
}

function toRow(type, domain, difficulty, q) {
  return {
    framework: 'pmbok8', domain, difficulty, subdomain: 'ECO 2026 · generated', question_type: type,
    question_text: q.question_text, question_text_ar: q.question_text_ar,
    option_a: '—', option_b: '—', option_c: '—', option_d: '—', correct_answer: 'a',
    explanation: q.explanation, explanation_ar: q.explanation_ar,
    rita_tip: q.rita_tip || null, rita_tip_ar: q.rita_tip_ar || null,
    pmbok_reference: 'PMBOK 8', eco_reference: 'ECO 2026',
    answer_data: q.answer_data, answer_data_ar: q.answer_data_ar, is_active: true,
  };
}

function buildPrompt(type, domain, difficulty, n) {
  return `Write ${n} DISTINCT ${type} PMP questions.
Domain: ${domain}.  Difficulty: ${difficulty} (write genuinely at this level).
Return a JSON array of ${n} objects, each with EXACTLY this shape:
${SCHEMA[type]}

Make the ${n} questions cover different topics within the domain. Return ONLY the JSON array.`;
}

(async () => {
  const types = ONLY ? [ONLY] : TYPES;
  let inserted = 0, invalid = 0, inTok = 0, outTok = 0;
  const jobs = [];
  for (const type of types) for (const domain of DOMAINS) for (const difficulty of DIFFICULTIES) jobs.push({ type, domain, difficulty });
  const run = SAMPLE ? jobs.slice(0, 1) : jobs;
  console.log(`${SAMPLE ? 'SAMPLE: ' : ''}${run.length} generation calls (${PER} questions each) across ${types.join(', ')}`);

  for (const job of run) {
    let out;
    try { out = await anthropicJSON(buildPrompt(job.type, job.domain, job.difficulty, PER), 8000); }
    catch (e) { console.log('  FAIL', job.type, job.domain, job.difficulty, '-', e.message); continue; }
    inTok += out.usage.input_tokens || 0; outTok += out.usage.output_tokens || 0;
    const items = Array.isArray(out.json) ? out.json : (Array.isArray(out.json.questions) ? out.json.questions : []);
    for (const q of items) {
      if (!validate(job.type, q)) { invalid++; if (SAMPLE) console.log('  INVALID item skipped'); continue; }
      if (SAMPLE) { console.log(`\n[OK ${job.type}] ${q.question_text.slice(0, 70)}`); console.log('   AR:', (q.question_text_ar || '').slice(0, 60)); console.log('   answer_data:', JSON.stringify(q.answer_data).slice(0, 200)); continue; }
      const { error } = await sbInsert(toRow(job.type, job.domain, job.difficulty, q));
      if (error) { console.log('  WRITE FAIL', error.message); invalid++; } else inserted++;
    }
    if (!SAMPLE) console.log(`  ${job.type}/${job.domain}/${job.difficulty}: running total inserted=${inserted}, invalid=${invalid}`);
  }
  const cost = (inTok / 1e6) * 5 + (outTok / 1e6) * 25;
  console.log(`\n${SAMPLE ? '[SAMPLE] ' : ''}Inserted ${inserted}, invalid/skipped ${invalid}. Tokens in=${inTok} out=${outTok} ~$${cost.toFixed(2)} (Opus 4.8)`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
