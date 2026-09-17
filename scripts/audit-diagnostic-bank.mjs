import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) throw new Error('Supabase URL/service key is missing.');

const supabase = createClient(url, key, { auth: { persistSession: false } });
const PAGE = 250;
const AUDIT_FIELDS = 'id,framework,domain,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation';

function words(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean);
}

function diagnosticIssues(row) {
  const stem = String(row.question_text || '');
  const options = ['option_a', 'option_b', 'option_c', 'option_d'].map((key) => String(row[key] || ''));
  const stemWords = words(stem).length;
  const lengths = options.map((option) => words(option).length);
  const nonzero = lengths.filter(Boolean);
  const issues = [];
  if (stemWords < 40 || stemWords > 120) issues.push(`stem_words:${stemWords}`);
  if (!/\b(next|first|best)\b/i.test(stem)) issues.push('not_situational_prompt');
  if (/\b(which|what).{0,30}\bnot\b|\bexcept\b/i.test(stem)) issues.push('negative_stem');
  if (options.some((option) => /\b(all|none) of the above\b/i.test(option))) issues.push('all_or_none');
  if (options.some((option) => !option.trim())) issues.push('missing_option');
  if (nonzero.length && Math.max(...nonzero) / Math.max(1, Math.min(...nonzero)) > 1.75) issues.push('unequal_option_length');
  const correctIndex = { A: 0, B: 1, C: 2, D: 3 }[String(row.correct_answer || '').toUpperCase()];
  if (correctIndex == null) issues.push('invalid_key');
  else if (/\b(always|never|must)\b/i.test(options[correctIndex])) issues.push('absolute_in_key');
  if (!String(row.explanation || '').trim()) issues.push('missing_correct_rationale');
  if (!row.rationale_distractors) issues.push('missing_distractor_rationales');
  return issues;
}

function missingTags(row) {
  const issues = [];
  if (!['pmbok7', 'pmbok8', 'bridge'].includes(row.framework)) issues.push('framework');
  if (!['people', 'process', 'business-environment'].includes(row.domain)) issues.push('domain');
  if (!['predictive', 'agile', 'hybrid'].includes(row.approach)) issues.push('approach');
  if (!String(row.eco_task || '').trim()) issues.push('eco_task');
  if (!['recall', 'application', 'analysis'].includes(row.cognitive_level)) issues.push('cognitive_level');
  return issues;
}

const rows = [];
for (let from = 0; ; from += PAGE) {
  const { data, error } = await supabase.from('questions').select(AUDIT_FIELDS).range(from, from + PAGE - 1);
  if (error) throw error;
  rows.push(...(data || []));
  console.error(`Audited source rows: ${rows.length}`);
  if (!data || data.length < PAGE) break;
}

const audited = rows.map((row) => {
  const content = diagnosticIssues(row);
  const tags = missingTags(row);
  const bucket = content.length ? 'rewrite' : tags.length ? 'retag' : 'pass';
  return { id: row.id, framework: row.framework || 'missing', domain: row.domain || 'missing', bucket, content, tags };
});

const dimensions = {};
for (const item of audited) {
  const keyName = `${item.framework}/${item.domain}`;
  dimensions[keyName] ||= { pass: 0, retag: 0, rewrite: 0 };
  dimensions[keyName][item.bucket] += 1;
}
const totals = audited.reduce((acc, item) => ({ ...acc, [item.bucket]: acc[item.bucket] + 1 }), { pass: 0, retag: 0, rewrite: 0 });
const issueCounts = audited.flatMap((item) => [...item.content, ...item.tags.map((tag) => `tag:${tag}`)])
  .reduce((acc, issue) => ({ ...acc, [issue]: (acc[issue] || 0) + 1 }), {});
const report = { generatedAt: new Date().toISOString(), source: 'production questions (read-only)', total: rows.length, totals, byTrackAndDomain: dimensions, issueCounts, items: audited };

const output = path.resolve(process.argv[2] || 'artifacts/diagnostic-bank-audit.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output, total: report.total, totals, byTrackAndDomain: dimensions, issueCounts }, null, 2));
