import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { assembleDiagnosticForm, inspectAssembly, blueprintFor, type AssemblyItem } from '../lib/diagnostic/assembler';

const root = process.cwd();
const read = (name: string) => fs.readFileSync(path.join(root, 'supabase/migrations', name), 'utf8');
const bank: AssemblyItem[] = [];
const taskByCode: Record<string, string> = {
  'People-1':'PPL-2','People-2':'PPL-4','People-3':'PPL-3','People-4':'PPL-3','People-5':'PPL-2','People-6':'PPL-4','People-7':'PPL-3','People-8':'PPL-5',
  'Process-1':'PRC-1','Process-2':'PRC-3','Process-3':'PRC-8','Process-4':'PRC-9','Process-5':'PRC-7','Process-6':'PRC-3','Process-7':'PRC-2','Process-8':'PRC-1','Process-9':'PRC-9','Process-10':'PRC-1',
  'Business-1':'BEN-2','Business-2':'BEN-7','People-9':'PPL-3','People-10':'PPL-2','People-11':'PPL-6','Process-11':'PRC-2','Process-12':'PRC-5','Process-13':'PRC-8','Business-3':'BEN-2','Business-4':'BEN-1','Business-5':'BEN-2','Business-6':'BEN-7','Business-7':'BEN-8','Business-8':'BEN-8',
};

const original = read('20260906_diagnostic_exemplars.sql');
const below = new Set(['People-1','People-4','People-7','Process-2','Process-6','Business-1']);
const above = new Set(['People-6','Process-8','Process-9','Process-10']);
for (const match of original.matchAll(/\n  \('([^']+)', '(people|process|business_environment)', '(predictive|agile|hybrid)', '([^']+)', '(recall|application|analysis)'\)/g)) {
  const code = match[4];
  bank.push({ id: code, trackId: 'pmbok8', domain: match[2] as AssemblyItem['domain'],
    ecoTaskCode: taskByCode[code],
    approach: match[3] as AssemblyItem['approach'], cognitiveLevel: match[5] as AssemblyItem['cognitiveLevel'],
    difficultyB: below.has(code) ? -0.8 : above.has(code) ? 0.8 : 0, exposureCount: 0 });
}

const expansion = read('20260911_diagnostic_bank_32.sql');
for (const match of expansion.matchAll(/\n    '([^']+)',\n    '\[[^\n]+\]'::jsonb,\n    '[A-D]', '(people|process|business_environment)', '(predictive|agile|hybrid)', '([^']+)', '(recall|application|analysis)', (-?[0-9.]+),/g)) {
  const code = match[4];
  const corrected = code === 'People-9' ? 'application' : ['Process-11','Business-3'].includes(code) ? 'analysis' : match[5];
  bank.push({ id: code, trackId: 'pmbok8', domain: match[2] as AssemblyItem['domain'],
    ecoTaskCode: taskByCode[code],
    approach: match[3] as AssemblyItem['approach'], cognitiveLevel: corrected as AssemblyItem['cognitiveLevel'],
    difficultyB: Number(match[6]), exposureCount: 0 });
}

const reserve = read('20260914_diagnostic_reserve_48.sql');
for (const match of reserve.matchAll(/\('(Reserve-[0-9]+)','[^']+',\n'\[[^\n]+\]'::jsonb,'[A-D]','(people|process|business_environment)','(predictive|agile|hybrid)','([^']+)','(recall|application|analysis)',(-?[0-9.]+),/g)) {
  bank.push({ id: match[1], trackId: 'pmbok8', domain: match[2] as AssemblyItem['domain'],
    approach: match[3] as AssemblyItem['approach'], ecoTaskCode: match[4], cognitiveLevel: match[5] as AssemblyItem['cognitiveLevel'],
    difficultyB: Number(match[6]), exposureCount: 0 });
}

assert.equal(bank.length, 48);
for (let seed = 0; seed < 500; seed += 1) {
  const selected = assembleDiagnosticForm(bank, { trackId: 'pmbok8', length: 32, candidateId: `candidate-${seed}`, formSeed: `shape-${seed}` });
  const observed = inspectAssembly(selected);
  const expected = blueprintFor(32);
  assert.deepEqual(observed.domains, expected.domains);
  assert.deepEqual(observed.approaches, expected.approaches);
  assert.deepEqual(observed.difficulties, expected.difficulties);
  const taskCounts = new Map<string, number>();
  selected.forEach((item) => taskCounts.set(item.ecoTaskCode!, (taskCounts.get(item.ecoTaskCode!) || 0) + 1));
  assert.ok(Math.max(...taskCounts.values()) <= expected.maxPerEcoTask);
}

const first = assembleDiagnosticForm(bank, { trackId: 'pmbok8', length: 32, candidateId: 'retake', formSeed: 'first' });
const exposed = new Set(first.map((item) => item.id));
const retake = assembleDiagnosticForm(bank.map((item) => ({ ...item,
  lastSeenAt: exposed.has(item.id) ? new Date().toISOString() : null,
})), { trackId: 'pmbok8', length: 32, candidateId: 'retake', formSeed: 'second' });
assert.equal(retake.length, 32);
assert.ok(retake.filter((item) => !exposed.has(item.id)).length > 0);

console.log('The 48-item production-shaped pool assembled 500 valid forms and a non-blocking retake.');
