import fs from 'node:fs';

const sql = fs.readFileSync('supabase/migrations/20260922_diagnostic_arabic_content.sql', 'utf8');
const statements = [...sql.matchAll(/update public\.diagnostic_items set([\s\S]*?)where eco_task ?= ?'([^']+)';/g)];
if (statements.length !== 48) throw new Error(`Expected 48 Arabic item updates; found ${statements.length}`);
const keys = new Set();
for (const [, body, ecoTask] of statements) {
  if (keys.has(ecoTask)) throw new Error(`Duplicate Arabic translation for ${ecoTask}`);
  keys.add(ecoTask);
  if (!/stem_ar\s*=\s*'[^']*[\u0600-\u06ff]/.test(body)) throw new Error(`Missing Arabic stem for ${ecoTask}`);
  const optionsMatch = body.match(/options_ar\s*=\s*'(\[[\s\S]*?\])'::jsonb/);
  const rationaleMatch = body.match(/rationale_distractors_ar\s*=\s*'(\{[\s\S]*?\})'::jsonb/);
  if (!optionsMatch || !rationaleMatch) throw new Error(`Missing localized response content for ${ecoTask}`);
  const options = JSON.parse(optionsMatch[1]);
  const rationales = JSON.parse(rationaleMatch[1]);
  if (options.length !== 4 || options.map((option) => option.id).join('') !== 'ABCD') throw new Error(`Invalid Arabic option IDs for ${ecoTask}`);
  if (options.some((option) => !/[\u0600-\u06ff]/.test(option.text))) throw new Error(`Non-Arabic option for ${ecoTask}`);
  if (Object.keys(rationales).length < 2 || Object.values(rationales).some((value) => !/[\u0600-\u06ff]/.test(value))) throw new Error(`Invalid Arabic distractor feedback for ${ecoTask}`);
}
if (!sql.includes("where eco_task='Reserve-08'") || !sql.includes('visual_spec_ar')) throw new Error('Arabic visual localization is missing');
console.log('Arabic diagnostic verification passed: 48 unique items, aligned A-D options, localized feedback, and localized visual metadata.');
