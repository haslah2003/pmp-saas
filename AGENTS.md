# PMPeco Codex Guidance

## Ownership

- Codex is the primary developer for this repository: investigate, design, implement, and verify changes.
- Claude Code is the independent auditor: review diffs, identify regressions, challenge assumptions, and report findings. Claude should not edit the same working tree while Codex is implementing.
- The user is the release authority. Do not push, deploy, merge, alter production data, or apply database migrations without the user's explicit instruction.

## Safety Rules

- Preserve all existing user work, including untracked files. Never run `git checkout -- .`, `git reset --hard`, `git clean`, or broad deletion commands.
- Before editing, inspect `git status --short --branch` and the relevant diff.
- Keep each change focused and reviewable. Do not stage or commit unrelated files.
- Do not commit secrets or `.env.local`.
- Treat `main` as production-sensitive. Prefer a `codex/` feature branch for implementation unless the user explicitly chooses another branch.
- Validate locally before asking Claude to audit. A successful audit is not authorization to push or deploy.

## Standard Handoff

1. Codex records the requested scope and baseline Git state.
2. Codex implements on an isolated feature branch and runs proportionate checks.
3. Codex provides Claude with the branch/commit or diff plus verification evidence.
4. Claude audits without editing and returns prioritized findings.
5. Codex fixes accepted findings and re-runs checks.
6. The user explicitly approves any push, PR, merge, deployment, or production mutation.

## Project Commands

- Install: `npm install`
- Develop: `npm run dev`
- Production build: `npm run build`
- Type-check: `npx tsc --noEmit`
- Lint: `npm run lint` (verify compatibility first; this repository currently uses Next.js 15 and the script may need modernization)

## Current Continuity

Read `docs/AI_COLLABORATION_HANDOFF.md` before resuming the pending presentation-pipeline work.
