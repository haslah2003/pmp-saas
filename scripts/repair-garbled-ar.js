// Repair questions whose Arabic fields are code-mixed / garbled (English words left untranslated).
// Re-translates the ENGLISH source fields into clean Modern Standard Arabic (glossary-aware),
// overwriting the garbled *_ar fields. Standard text fields only (single/multiple/pull_down source text);
// structured answer_data is untouched. No @supabase dependency (raw PostgREST) so it runs outside ~/Downloads.
//
// Usage:
//   node scripts/repair-garbled-ar.js --sample 3    # print before/after, NO writes
//   node scripts/repair-garbled-ar.js [--limit N]   # apply + write back
const fs = require('fs');
const ROOT = require('path').resolve(__dirname, '..');
const env = {};
for (const line of fs.readFileSync(require('path').join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const MODEL = env.ANTHROPIC_MODEL || 'claude-opus-4-8';
const args = process.argv.slice(2);
const sIdx = args.indexOf('--sample');
const SAMPLE = sIdx >= 0 ? parseInt(args[sIdx + 1], 10) : 0;
const lIdx = args.indexOf('--limit');
const LIMIT = lIdx >= 0 ? parseInt(args[lIdx + 1], 10) : Infinity;

const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const SB_HEADERS = { 'Content-Type': 'application/json', apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };
async function sbGet(qs) {
  const res = await fetch(`${SB}/rest/v1/questions?${qs}`, { headers: SB_HEADERS });
  if (!res.ok) throw new Error(`SB GET ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}
async function sbPatch(id, patch) {
  const res = await fetch(`${SB}/rest/v1/questions?id=eq.${id}`, { method: 'PATCH', headers: { ...SB_HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(patch) });
  if (!res.ok) return { error: `${res.status} ${(await res.text()).slice(0, 160)}` };
  return {};
}

// Garbled heuristic: >=4 latin words (len>1) that aren't allowed acronyms/framework terms.
const allow = /^(PMP|PMBOK|PMI|ECO|CCB|WBS|EVM|CPI|SPI|EAC|BAC|ETC|PV|EV|AC|SV|CV|ROI|ESG|AI|B2B|RACI|DoD|MVP|SOW|KPI|Scrum|Agile|Sprint|Kanban|Hybrid|of|the|to)$/i;
const garbled = (t) => ((t || '').match(/[A-Za-z']+/g) || []).filter((w) => w.length > 1 && !allow.test(w)).length >= 4;
const FIELDS = [['question_text', 'question_text_ar'], ['option_a', 'option_a_ar'], ['option_b', 'option_b_ar'], ['option_c', 'option_c_ar'], ['option_d', 'option_d_ar'], ['explanation', 'explanation_ar'], ['rita_tip', 'rita_tip_ar']];

const SYSTEM = `You are a professional Arabic translator for PMP (PMBOK / ECO) exam content. Translate the given English fields into clear, formal Modern Standard Arabic.
Rules:
- Platform glossary: stakeholder = "المعني", issue = "الإشكال", control = "التحكم", project manager = "مدير المشروع", exam = "اختبار".
- Keep acronyms/framework names in English: PMP, PMBOK, ECO, PMI, WBS, EVM, CPI, SPI, CCB, Agile, Scrum, Sprint.
- Translate faithfully — do not add, remove, or reinterpret. Numbers/formulas stay identical. Exam register.
- Return ONLY valid JSON with the same keys you were given, each holding the Arabic translation. No markdown, no commentary.`;

async function translate(fieldsObj) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: SYSTEM, messages: [{ role: 'user', content: `Translate these English fields to Arabic. Return JSON with the same keys:\n${JSON.stringify(fieldsObj, null, 2)}` }] }),
    });
    if (!res.ok) { const t = await res.text(); if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 15000 * attempt)); continue; } throw new Error(`Anthropic ${res.status}: ${t.slice(0, 200)}`); }
    const data = await res.json();
    const usage = data.usage || {};
    let text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim().replace(/^```(json)?/g, '').replace(/```$/g, '').trim();
    try { return { json: JSON.parse(text), usage }; } catch (e) { if (attempt === 3) throw new Error('JSON parse failed'); }
  }
}

const str = (v) => typeof v === 'string' && v.trim().length > 0;

(async () => {
  const cols = 'id,framework,' + FIELDS.flat().join(',');
  const rows = [];
  for (let off = 0; ; off += 1000) {
    const page = await sbGet(`select=${cols}&is_active=eq.true&limit=1000&offset=${off}`);
    rows.push(...page); if (page.length < 1000) break;
  }
  let affected = rows.filter((q) => FIELDS.some(([, ar]) => garbled(q[ar])));
  console.log(`Garbled questions: ${affected.length}`);
  if (SAMPLE > 0) affected = affected.slice(0, SAMPLE);
  else if (LIMIT !== Infinity) affected = affected.slice(0, LIMIT);

  let done = 0, wrote = 0, inTok = 0, outTok = 0;
  for (const q of affected) {
    // Translate every English field that has a garbled Arabic counterpart (and an English source).
    const src = {};
    for (const [en, ar] of FIELDS) if (str(q[en]) && garbled(q[ar])) src[en] = q[en];
    if (Object.keys(src).length === 0) continue;
    let out;
    try { out = await translate(src); } catch (e) { console.log('  FAIL', q.id, '-', e.message); continue; }
    inTok += out.usage.input_tokens || 0; outTok += out.usage.output_tokens || 0;
    const patch = {};
    for (const [en, ar] of FIELDS) if (en in src && str(out.json[en])) patch[ar] = out.json[en];
    done++;
    if (Object.keys(patch).length === 0) continue;
    if (SAMPLE) {
      console.log(`\n=== ${q.id} (${q.framework}) ===`);
      for (const [en, ar] of FIELDS) if (patch[ar]) console.log(`  ${ar}:\n   OLD: ${(q[ar] || '').slice(0, 90)}\n   NEW: ${patch[ar].slice(0, 90)}`);
    } else {
      const { error } = await sbPatch(q.id, patch); if (error) console.log('  WRITE FAIL', q.id, error); else wrote++;
      if (done % 20 === 0) console.log(`  ...${done}/${affected.length}, wrote ${wrote}`);
    }
  }
  const cost = (inTok / 1e6) * 5 + (outTok / 1e6) * 25;
  console.log(`\n${SAMPLE ? '[SAMPLE] ' : ''}Processed ${done}, wrote ${wrote}. Tokens in=${inTok} out=${outTok} ~$${cost.toFixed(2)} (Opus 4.8)`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
