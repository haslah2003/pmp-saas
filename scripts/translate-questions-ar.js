// Translate active pmbok8 questions missing Arabic into MSA.
// Writes ONLY empty *_ar columns on the questions table. Usage:
//   node translate-pmbok8-ar.js [--limit N] [--dry-run]
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const DRY = args.includes('--dry-run');

const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const MODEL = env.ANTHROPIC_MODEL || 'claude-opus-4-8';

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

const SYSTEM = `You are a professional Arabic translator specializing in PMP (Project Management Professional) exam content. Translate English PMP exam questions into formal, clear Modern Standard Arabic.

Rules:
- Use the established Arabic PMP terminology of this platform: stakeholder = "معني", project manager = "مدير المشروع".
- Keep acronyms and framework names in English where precision requires it: PMP, PMBOK, ECO, PMI, Agile, Scrum, Sprint, WBS, CPI, SPI, EVM.
- Translate faithfully — do not add, remove, or reinterpret content. Keep the same tone (exam register).
- Numbers, formulas, and calculations stay identical.
- Return ONLY valid JSON, no markdown fences, no commentary.`;

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
        await new Promise((r) => setTimeout(r, 15000 * attempt));
        continue;
      }
      throw new Error(`Anthropic ${res.status}: ${txt.slice(0, 300)}`);
    }
    const data = await res.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    const cleaned = text.trim().replace(/^```(json)?/g, '').replace(/```$/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      if (attempt === 3) throw new Error(`JSON parse failed: ${cleaned.slice(0, 200)}`);
    }
  }
  throw new Error('exhausted retries');
}

function buildBatchPrompt(questions) {
  const items = questions.map((q) => {
    const item = {
      id: q.id,
      question_type: q.question_type || 'single_response',
      question_text: q.question_text,
      explanation: q.explanation,
    };
    if ((q.question_type || 'single_response') === 'single_response') {
      item.option_a = q.option_a;
      item.option_b = q.option_b;
      item.option_c = q.option_c;
      item.option_d = q.option_d;
    }
    if (nonEmpty(q.rita_tip)) item.rita_tip = q.rita_tip;
    if (q.answer_data && (q.question_type === 'multiple_response' || q.question_type === 'pull_down')) {
      item.answer_data = q.answer_data;
    }
    return item;
  });
  return `Translate the following PMP exam questions to Arabic. For each input object return an object with the SAME "id" and these fields:
- "question_text_ar", "explanation_ar" (always)
- "option_a_ar".."option_d_ar" (when option_a..option_d present)
- "rita_tip_ar" (when rita_tip present)
- "answer_data_ar" (when answer_data present): same JSON structure with ONLY human-readable text values translated (option texts, prompt_before/prompt_after). Keep all keys, ids, letter keys (A/B/C...), "correct" values, and "select_count" EXACTLY unchanged. For pull_down blanks, translate every entry in "options" and set "correct" to the translated form of the same entry so it still matches one option exactly.

Return a JSON array of these objects, same order.

INPUT:
${JSON.stringify(items, null, 1)}`;
}

(async () => {
  const cols = 'id,framework,question_type,is_active,question_text,option_a,option_b,option_c,option_d,explanation,rita_tip,answer_data,question_text_ar,option_a_ar,option_b_ar,option_c_ar,option_d_ar,explanation_ar,rita_tip_ar,answer_data_ar';
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('questions').select(cols)
      .eq('framework', 'pmbok8').eq('is_active', true).order('id').range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) break;
  }

  const isReady = (q) => {
    const t = q.question_type || 'single_response';
    const base = nonEmpty(q.question_text_ar) && nonEmpty(q.explanation_ar);
    if (!base) return false;
    if (t === 'single_response')
      return nonEmpty(q.option_a_ar) && nonEmpty(q.option_b_ar) && nonEmpty(q.option_c_ar) && nonEmpty(q.option_d_ar);
    return q.answer_data_ar != null;
  };

  let todo = rows.filter((q) => !isReady(q));
  console.log(`pmbok8 active: ${rows.length}, missing Arabic: ${todo.length}, processing: ${Math.min(LIMIT, todo.length)}${DRY ? ' (dry-run)' : ''}`);
  todo = todo.slice(0, LIMIT);

  const BATCH = 4;
  const batches = [];
  for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));

  let done = 0, failed = 0;
  const CONCURRENCY = 3;
  let cursor = 0;

  async function worker(wid) {
    while (cursor < batches.length) {
      const myIdx = cursor++;
      const batch = batches[myIdx];
      try {
        const out = await anthropicJSON(buildBatchPrompt(batch), 8000);
        if (!Array.isArray(out)) throw new Error('response is not an array');
        for (const q of batch) {
          const tr = out.find((o) => o && o.id === q.id);
          if (!tr) { failed++; console.log(`MISS ${q.id}`); continue; }
          const upd = {};
          const setIfEmpty = (col, val) => { if (nonEmpty(val) && !nonEmpty(q[col])) upd[col] = val.trim(); };
          setIfEmpty('question_text_ar', tr.question_text_ar);
          setIfEmpty('explanation_ar', tr.explanation_ar);
          if ((q.question_type || 'single_response') === 'single_response') {
            setIfEmpty('option_a_ar', tr.option_a_ar);
            setIfEmpty('option_b_ar', tr.option_b_ar);
            setIfEmpty('option_c_ar', tr.option_c_ar);
            setIfEmpty('option_d_ar', tr.option_d_ar);
            const need = ['question_text_ar','explanation_ar','option_a_ar','option_b_ar','option_c_ar','option_d_ar'];
            if (need.some((c) => !nonEmpty(q[c]) && !nonEmpty(upd[c]))) { failed++; console.log(`INCOMPLETE ${q.id}`); continue; }
          } else {
            if (q.answer_data && q.answer_data_ar == null) {
              if (tr.answer_data_ar && typeof tr.answer_data_ar === 'object') upd.answer_data_ar = tr.answer_data_ar;
              else { failed++; console.log(`NO answer_data_ar ${q.id}`); continue; }
            }
          }
          if (nonEmpty(q.rita_tip)) setIfEmpty('rita_tip_ar', tr.rita_tip_ar);
          if (Object.keys(upd).length === 0) { done++; continue; }
          if (DRY) {
            console.log(`DRY ${q.id}: would set ${Object.keys(upd).join(',')}`);
            console.log('  sample:', (upd.question_text_ar || '').slice(0, 100));
            done++;
            continue;
          }
          const { error } = await supabase.from('questions').update(upd).eq('id', q.id);
          if (error) { failed++; console.log(`DB FAIL ${q.id}: ${error.message}`); continue; }
          done++;
        }
        console.log(`[w${wid}] batch ${myIdx + 1}/${batches.length} ok — done=${done} failed=${failed}`);
      } catch (e) {
        failed += batch.length;
        console.log(`[w${wid}] batch ${myIdx + 1} FAILED: ${e.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));
  console.log(`\nFINISHED: translated=${done} failed=${failed} of ${todo.length}`);
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
