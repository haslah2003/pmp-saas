// Driver: generate Learn deep-dive content for every pmbok8 lesson that lacks approved content,
// in BOTH languages, by invoking generate-rpath-deep-dive.ts per (lesson × language).
// The per-lesson generator skips existing content, but we pre-filter here to avoid wasted spawns.
//
// Usage:
//   npx tsx scripts/generate-missing-deep-dives.ts --dry        # list missing, no generation
//   npx tsx scripts/generate-missing-deep-dives.ts              # generate all missing (Opus 4.8)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { ALL_TRACKS } from '../lib/pmp-path/tracks';
import { createAdminClient } from '../lib/supabase/admin';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2] ?? '';
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const DRY = process.argv.includes('--dry');
const GEN_MODEL = process.env.RPATH_DEEP_DIVE_MODEL || 'claude-opus-4-8';

async function main() {
  loadEnvLocal();

  const lessons: { moduleId: string; lessonId: string }[] = [];
  for (const track of ALL_TRACKS) {
    for (const phase of track.phases) {
      for (const mod of phase.modules) {
        if (!mod.id.startsWith('pmbok8')) continue;
        for (const lesson of mod.lessons) lessons.push({ moduleId: mod.id, lessonId: lesson.id });
      }
    }
  }

  const admin = createAdminClient();
  // Treat ANY existing row as "have" (approved OR needs_human_review) so we only generate
  // lessons that have no row at all — avoids duplicating the needs_human_review lessons.
  const { data, error } = await admin
    .from('lesson_deep_dives')
    .select('module_id,lesson_id,language')
    .eq('track_id', 'pmbok8-eco2026');
  if (error) throw new Error(`DB read failed: ${error.message}`);
  const have = new Set((data || []).map((r: any) => `${r.module_id}|${r.lesson_id}|${r.language}`));

  const jobs: { moduleId: string; lessonId: string; lang: string }[] = [];
  for (const { moduleId, lessonId } of lessons) {
    for (const lang of ['en', 'ar']) {
      if (!have.has(`${moduleId}|${lessonId}|${lang}`)) jobs.push({ moduleId, lessonId, lang });
    }
  }

  console.log(`pmbok8 lessons in registry: ${lessons.length} (×2 langs = ${lessons.length * 2})`);
  console.log(`already approved: ${have.size}. Missing to generate: ${jobs.length}`);
  const byLang = jobs.reduce((a: any, j) => ((a[j.lang] = (a[j.lang] || 0) + 1), a), {});
  console.log('missing by language:', JSON.stringify(byLang));

  if (DRY) {
    for (const j of jobs.slice(0, 20)) console.log(`  - ${j.moduleId} / ${j.lessonId} [${j.lang}]`);
    if (jobs.length > 20) console.log(`  ...and ${jobs.length - 20} more`);
    console.log('\n[DRY] no generation performed.');
    return;
  }

  let ok = 0, fail = 0;
  for (const j of jobs) {
    try {
      execFileSync('npx', ['tsx', 'scripts/generate-rpath-deep-dive.ts', '--moduleId', j.moduleId, '--lessonId', j.lessonId, '--language', j.lang], {
        stdio: 'inherit',
        env: { ...process.env, RPATH_DEEP_DIVE_MODEL: GEN_MODEL },
      });
      ok++;
    } catch (e: any) {
      fail++;
      console.log(`  FAIL ${j.moduleId}/${j.lessonId}/${j.lang}: ${e.message?.slice(0, 120)}`);
    }
    console.log(`  progress: ${ok + fail}/${jobs.length} (ok ${ok}, fail ${fail})`);
  }
  console.log(`\nDone. Generated ${ok}, failed ${fail}, of ${jobs.length}. (model ${GEN_MODEL})`);
}

main().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
