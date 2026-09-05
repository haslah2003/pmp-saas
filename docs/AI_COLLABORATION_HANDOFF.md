# PMPeco AI Collaboration Handoff

Last reconciled: 2026-08-16 (Asia/Muscat)

## Repository Baseline

- Local repository: `/Users/hussein/pmp-saas`
- Branch: `main`
- HEAD: `5b1e136` — `chore(study-studio): rename Audio tab to Media (now hosts video + audio) (#4)`
- At reconciliation, local `main` matched `origin/main`; the pending presentation work had not been applied, committed locally, or pushed.
- Existing unrelated local items must be preserved: tracked `.DS_Store` modification and untracked `.claude/`, `My dev Dowloads26/`, and `pmpeco Promo videoAr.mp4`.

## Pending Claude Handoff

The attached Claude transcript ended while transferring this patch:

- Path: `/Users/hussein/Downloads/pmpecopresentationpipeline.patch`
- Size observed: 44,419 bytes
- Patch author: Claude
- Subject: `feat(study-studio): multi-agent presentation pipeline (Agents 1 & 2)`
- Base compatibility: `git apply --check` passed against commit `5b1e136` on 2026-08-16.
- Status: unapplied. Do not apply, commit, push, or deploy it until Codex reviews it and the user authorizes the implementation step.

The patch proposes 785 insertions and 2 deletions across eight files:

- `lib/study-studio/presentation/types.ts`: DeckSpec contract between agents.
- `lib/study-studio/presentation/branding.ts`: resolves `branding_config` into deck branding.
- `lib/study-studio/presentation/deck-architect.ts`: pathway- and resource-grounded deck specification.
- `lib/study-studio/presentation/deck-builder.ts`: editable PPTX buffer generation with `pptxgenjs`.
- `app/api/ai/presentation/route.ts`: admin-only `spec` / `pptx` endpoint.
- `lib/constants.ts`: deck architect system prompt.
- `package.json` and `package-lock.json`: add `pptxgenjs`.

The proposed pathway contract reuses the existing `ExamPathId` values: `pmbok7`, `pmbok8`, and `bridge`. It intends to reuse `retrieveResourceEvidence` for grounding and the existing `branding_config` as the visual source of truth. Study Studio media now uses admin-uploaded video/audio stored in Supabase.

## Agreed Roles

- Codex: primary developer and environment owner. It investigates, implements, tests, documents, and prepares reviewable changes.
- Claude Code: independent auditor. It reviews Codex diffs/commits and test evidence, looking for defects and risks without editing concurrently.
- User: product owner and release authority. The user decides whether changes may be pushed, merged, deployed, or allowed to mutate production.

## Safe Resume Point

1. Create an isolated `codex/` branch from the verified baseline; do not discard unrelated local work.
2. Review the patch line-by-line before applying it, especially admin authorization, AI input/output validation, citation grounding, PPTX generation limits, serverless memory/runtime behavior, dependency risk, and bilingual/pathway behavior.
3. Apply or reimplement only after explicit user approval.
4. Run type-check and production build, plus focused tests for the API and deck output.
5. Hand the resulting diff and evidence to Claude for a read-only audit.
6. Fix accepted findings and obtain user approval before any push or deployment.

## Environment Snapshot

- Node.js: `v22.2.0`
- npm: `10.7.0`
- `node_modules` and `.env.local` are present locally.
- Primary scripts: `npm run dev`, `npm run build`, and `npm run lint`.
- The application currently depends on Supabase, Anthropic, PayPal, Vercel Analytics, and Sentry. Never expose or copy local secret values into documentation or logs.

## Known Documentation Drift

The root `README.md` still describes an early PMBOK 7 / ECO 2021 project phase and is not a reliable statement of the current product. Confirm current behavior from code and recent commits before making architecture decisions.
