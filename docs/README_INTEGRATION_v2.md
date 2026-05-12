# Sprint R-Path-1.5 — Integration Guide

**My PMP Path v2 · 3-track framework rebuild**

This bundle replaces the single-track Sprint R-Path-1 with a full multi-track
implementation aligned to the approved v4 design. Drop it into the existing
`pmp-saas` repository.

---

## 1 · What's inside

```
pmp-path-v2/
├── app/dashboard/path/page.tsx
├── components/path/
│   ├── TrackTabs.tsx           ← NEW · tab-bar track picker
│   ├── PathHeader.tsx          ← REWRITTEN · hero with segmented progress
│   ├── PhaseBlock.tsx          ← REWRITTEN · numbered phase header + modules
│   ├── ModuleCard.tsx          ← REWRITTEN · enforces single-CTA rule
│   ├── SevenStepStrip.tsx      ← REWRITTEN · slim dot strip
│   └── CrossSellPanel.tsx      ← NEW · bidirectional amber panel
├── lib/pmp-path/
│   ├── types.ts                ← UPDATED · TrackId enum + track-aware types
│   ├── colors.ts               ← UPDATED · BRAND + PHASE_THEME + TRACK_IDENTITY
│   ├── progress.ts             ← UPDATED · track-aware derivation
│   ├── data.server.ts          ← UPDATED · reads user_path_pref + track filter
│   └── tracks/
│       ├── index.ts            ← NEW · registry + cross-sell map
│       ├── pmbok7.ts           ← NEW · 14 modules · ~45h · ECO 2021
│       ├── pmbok8.ts           ← NEW · 14 modules · ~44h · ECO 2026
│       └── bridge.ts           ← NEW · 10 modules · ~21h · 7→8 deltas
└── supabase/migrations/
    ├── 20260512_lesson_progress.sql   ← UPDATED · adds track_id column + enum
    └── 20260513_user_path_pref.sql    ← NEW · active-track preference table
```

---

## 2 · Pre-flight check before merging

This bundle assumes three things about your existing repo:

| Assumption                              | If false, do this                                             |
| --------------------------------------- | ------------------------------------------------------------- |
| Supabase server helper is at `@/lib/supabase/server` and exports `createClient` | Edit the import on line 16 of `lib/pmp-path/data.server.ts`   |
| `pmp_locale` cookie is set elsewhere to `'en'` or `'ar'` | No change needed — code defaults to `'en'` when absent       |
| Next.js 15 App Router with Server Actions enabled | No change needed                                              |

If your Supabase helper does not return a Promise (e.g. it's synchronous in your codebase), drop the `await` on the `createClient()` call in `data.server.ts`.

---

## 3 · Install order

1. **Run the migrations** in order:
   ```bash
   supabase db reset --linked
   # or apply individually:
   supabase migration up 20260512
   supabase migration up 20260513
   ```

2. **Copy files** into the repo, preserving the directory structure:
   ```bash
   cp -r pmp-path-v2/app/        ./
   cp -r pmp-path-v2/components/ ./
   cp -r pmp-path-v2/lib/        ./
   cp -r pmp-path-v2/supabase/   ./
   ```

3. **Delete the old single-track files** from Sprint R-Path-1:
   - `lib/pmp-path/framework-data.ts` (replaced by `tracks/pmbok8.ts`)
   - any single-track variant of `data.server.ts`, `progress.ts`, `types.ts`

4. **Type-check**:
   ```bash
   npx tsc --noEmit
   ```

5. **Run dev**:
   ```bash
   npm run dev
   # → http://localhost:3000/dashboard/path
   ```

---

## 4 · Architecture summary

### Strict framework — enforced at the code level

| Rule                  | Enforcement                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| 4 phases              | `PhaseId` is a literal union; tracks must define all four                   |
| 7 learning steps      | `LearningStep` is a literal union; `nextStep()` walks them in order         |
| 1 CTA per module      | `ModuleCard.computeCta()` is a decision table — returns exactly one `Cta`   |
| Prereq gating         | Modules unlock only when `prerequisiteModuleId` is fully completed          |

### Color mapping — locked

| Phase       | Primary    | Pale      | Where it shows                  |
| ----------- | ---------- | --------- | ------------------------------- |
| Foundation  | `#1AB0A2`  | `#E6F8F6` | F-module markers, F segment bar |
| Mastery     | `#5B2D91`  | `#F0EAFA` | M-module markers, M segment bar |
| Integration | `#F5A623`  | `#FFF7E6` | I-module markers, cross-sell    |
| Simulation  | `#472272`  | `#ECE5F4` | S-module markers, S segment bar |

### Track identity — Coursera-style tab underline

| Track                  | Accent     | Active pill bg | Active pill text |
| ---------------------- | ---------- | -------------- | ---------------- |
| PMBOK 7 + ECO 2021     | `#5B2D91`  | `#F0EAFA`      | `#26215C`        |
| PMBOK 8 + ECO 2026     | `#1AB0A2`  | `#E6F8F6`      | `#0F6E56`        |
| Bridge 7 → 8           | `#F5A623`  | `#FFF7E6`      | `#854F0B`        |

---

## 5 · How track switching works

1. User clicks a tab in `TrackTabs.tsx`.
2. The hidden-input form submits `formData.trackId` to the **Server Action** `switchTrackAction`.
3. The action validates the TrackId, calls `setActiveTrackForUser()` (which upserts `user_path_pref`), then:
   - `revalidatePath('/dashboard/path')` invalidates the page cache
   - `redirect('/dashboard/path?track=<id>')` navigates with the explicit param
4. On the next render, `getPathDataForUser()` reads the `?track=` first, so the URL is the source of truth and the DB is the persistence layer.
5. Anonymous users still get the URL behaviour, but no DB write happens.

This means a user can deep-link a friend to `/dashboard/path?track=bridge-7-to-8` and the right track loads.

---

## 6 · Track content summary

### PMBOK 7 + ECO 2021 — classic (14 modules · ~45h · 73 lessons)

| Phase            | Modules                                                            |
| ---------------- | ------------------------------------------------------------------ |
| 1 · Foundation   | F1 Mindset · F2 12 Principles · F3 Value Delivery · F4 ECO 2021    |
| 2 · Mastery      | M1 People (42%) · M2 Process (50%) · M3 BE (8%)                    |
| 3 · Integration  | I1 8 Performance Domains · I2 Life Cycles · I3 Models & Methods    |
| 4 · Simulation   | S1 30Q · S2 60Q · S3 120Q · S4 180Q                                |

### PMBOK 8 + ECO 2026 — current (14 modules · ~44h · 72 lessons)

| Phase            | Modules                                                            |
| ---------------- | ------------------------------------------------------------------ |
| 1 · Foundation   | F1 Mindset · F2 6 Principles · F3 Value Delivery · F4 ECO 2026     |
| 2 · Mastery      | M1 People (33%) · M2 Process (41%) · M3 BE (26%)                   |
| 3 · Integration  | I1 7 Performance Domains · I2 5 Focus Areas · I3 Toolkit           |
| 4 · Simulation   | S1 30Q · S2 60Q · S3 120Q · S4 180Q                                |

### Bridge 7 → 8 — transition (10 modules · ~21h · 30 lessons)

| Phase                       | Modules                                                      |
| --------------------------- | ------------------------------------------------------------ |
| 1 · Orient (2)              | B1 What changed · B2 12→6 principle map                      |
| 2 · Master the deltas (4)   | B3 People delta · B4 Process delta · B5 BE delta · B6 6 principles deep dive |
| 3 · Integrate the shift (2) | B7 Domains 8→7 · B8 New focus areas                          |
| 4 · Bridge simulation (2)   | B9 60Q targeted · B10 120Q readiness                         |

---

## 7 · What ships in this sprint vs what comes next

### Sprint R-Path-1.5 (this delivery)

- ✅ The `/dashboard/path` page in v4 design
- ✅ All 3 tracks with full content data
- ✅ TrackTabs with persistent user preference
- ✅ Hero with segmented 4-phase progress bar
- ✅ Per-module 7-step strip
- ✅ Single-CTA enforcement at the code level
- ✅ Bidirectional cross-sell panel
- ✅ Supabase schema with RLS

### Sprint R-Path-2 (next sprint)

- ⏳ The 7-step lesson player at `/dashboard/path/[moduleId]/[lessonId]/[step]`
- ⏳ Lesson content authoring (Preview slides · Learn content · Visualize / MindMap link · Apply scenario · Practice quiz · Explain / Teach-back · Review consolidation)
- ⏳ Practice scoring + weak-point tag accumulation
- ⏳ "Resume lesson" deep links from the path page
- ⏳ Bilingual lesson body content

### Sprint R-Path-3 (later)

- ⏳ "Compare tracks" side-by-side modal
- ⏳ Personalized study calendar
- ⏳ Bridge readiness pre-check that auto-recommends a track

---

## 8 · Smoke tests

After deployment, verify in this order:

1. **Anonymous load**: navigate to `/dashboard/path` — should default to PMBOK 8, show F1 as "Up next" with 0% progress, render all 4 phases.
2. **Track switch (anon)**: click PMBOK 7 tab — URL becomes `?track=pmbok7-eco2021`, content swaps, no DB write (check Supabase logs).
3. **Track switch (authed)**: sign in, click Bridge tab — `user_path_pref.active_track` becomes `bridge-7-to-8`. Reload without `?track=` — Bridge still shows.
4. **Locale switch**: set `pmp_locale=ar` cookie, reload — all text in MSA Arabic, dir="rtl" everywhere, segmented bar flows correctly.
5. **Cross-sell**: on PMBOK 8, the amber panel says *"Already know PMBOK 7? ..."*. Click it — switches to Bridge. From Bridge, the panel reverses and offers PMBOK 8.
6. **Single-CTA rule**: every module card has exactly one button. Locked modules show `Complete previous module` with `cursor: not-allowed`. Up-next module shows `Start module` in the phase's primary color.

---

## 9 · Known caveats and rationale notes

- The lesson factory in each track file uses a compact `L()` helper. If you want richer lesson metadata later (videos, downloads, etc.), extend the `Lesson` interface in `types.ts` and add optional fields to `L()`.
- The progress bar uses 4 segments proportional to lesson count per phase, not to module count. This better reflects how much *time* each phase represents.
- The bridge track uses `phaseId: 'foundation'` for its Orient phase to keep the 4-phase contract intact — but the phase **title** and **promise** in `bridge.ts` are "Orient" and "See what changed". This lets the framework remain strict while the UX language fits a transition learner.
- All Arabic text uses **MSA** (Modern Standard Arabic) consistent with PMI's Arabic glossary conventions.
- No external icon library is imported — all icons are inline SVG. This keeps the bundle small and avoids icon-font CSP issues on Vercel.
