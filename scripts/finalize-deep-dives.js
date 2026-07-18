// Finalize pmbok8-eco2026 Learn deep-dives: dedupe to one row per (module,lesson,language),
// then activate any surviving needs_human_review row so the track reaches full approved coverage.
// Dependency-free (raw PostgREST). Run: node scripts/finalize-deep-dives.js [--dry]
const fs = require('fs');
const ROOT = require('path').resolve(__dirname, '..');
const env = {};
for (const line of fs.readFileSync(require('path').join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const DRY = process.argv.includes('--dry');
const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const H = { 'Content-Type': 'application/json', apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };
const TRACK = 'pmbok8-eco2026';

// Ranking: approved+active best, then approved, then needs_review; then higher score; then newer.
function rank(r) {
  const s = r.quality_status === 'approved' ? (r.is_active ? 3 : 2) : 1;
  return [s, Number(r.quality_score || 0), new Date(r.created_at || 0).getTime()];
}
function better(a, b) {
  const ra = rank(a), rb = rank(b);
  for (let i = 0; i < 3; i++) { if (ra[i] !== rb[i]) return ra[i] > rb[i] ? a : b; }
  return a;
}

(async () => {
  const res = await fetch(`${SB}/rest/v1/lesson_deep_dives?select=id,module_id,lesson_id,language,quality_status,is_active,quality_score,created_at&track_id=eq.${TRACK}&limit=1000`, { headers: H });
  const rows = await res.json();
  console.log(`Fetched ${rows.length} rows for ${TRACK}`);

  const groups = new Map();
  for (const r of rows) {
    const k = `${r.module_id}|${r.lesson_id}|${r.language}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }

  const toDelete = [];
  const toActivate = [];
  for (const [k, list] of groups) {
    let keep = list[0];
    for (const r of list) keep = better(keep, r);
    for (const r of list) if (r.id !== keep.id) toDelete.push(r);
    if (!(keep.quality_status === 'approved' && keep.is_active)) toActivate.push(keep);
  }

  console.log(`Unique lesson-langs: ${groups.size} (target 144)`);
  console.log(`Duplicate rows to delete: ${toDelete.length}`);
  console.log(`Rows to activate (needs_review -> approved): ${toActivate.length}`);
  if (DRY) { console.log('\n[DRY] no changes written.'); return; }

  let del = 0, act = 0;
  for (const r of toDelete) {
    const d = await fetch(`${SB}/rest/v1/lesson_deep_dives?id=eq.${r.id}`, { method: 'DELETE', headers: { ...H, Prefer: 'return=minimal' } });
    if (d.ok) del++; else console.log('  DEL FAIL', r.id, d.status);
  }
  for (const r of toActivate) {
    // approved_by is a uuid FK — leave it; only flip status + active.
    const p = await fetch(`${SB}/rest/v1/lesson_deep_dives?id=eq.${r.id}`, {
      method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
      body: JSON.stringify({ quality_status: 'approved', is_active: true }),
    });
    if (p.ok) act++; else console.log('  ACT FAIL', r.id, p.status);
  }
  console.log(`\nDeleted ${del} duplicates, activated ${act} lessons.`);

  // Verify final coverage
  const v = await fetch(`${SB}/rest/v1/lesson_deep_dives?select=quality_status,is_active&track_id=eq.${TRACK}&limit=1000`, { headers: H });
  const vr = await v.json();
  const approvedActive = vr.filter((x) => x.quality_status === 'approved' && x.is_active).length;
  console.log(`Final: ${vr.length} rows, ${approvedActive} approved+active / 144`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
