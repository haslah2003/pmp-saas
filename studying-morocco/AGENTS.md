<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Studying in Morocco — project guidance

A standalone app for KNO Academy with its own repository, database, media storage and Vercel project.

## Brand rules (KNO Academy Web Branding & UI Governance Guidelines)

- Only the brand tokens in `src/app/(frontend)/globals.css` exist (`primary`, `cta`, `cta-hover`, `cta-active`, `ink`, `muted`, `line`, `surface`, `canvas`, `white`). Never add colours, gradients, blur blobs, patterns behind text or illustrations.
- Sizes come from `text-h1`…`text-h4`, `text-body`, `text-small`, `text-btn`; headings take their size from the element. Breakpoints are `md`/`lg`/`xl` only; never 3 columns below `lg`.
- Use `LinkButton`/`Button`/`buttonClass` for every button (`primary` amber or `secondary` outline; `light` on purple). Text is start-aligned; never centre reading text.
- Spacing: `py-section`, `p-card`, `gap-grid`. Mark purple bands with `on-dark` so headings and focus rings switch colour.

## Stack

- Next.js 16 (App Router, Turbopack, `src/proxy.ts` instead of middleware) + React 19
- Payload CMS 3 (admin at `/admin`, REST at `/api`) on PostgreSQL via `@payloadcms/db-postgres`
- Tailwind CSS 4 (CSS-first config in `src/app/(frontend)/globals.css`)
- Node `^22.23.4 || >=24.22.1` (Payload's engine requirement)

## Conventions

- **Bilingual everything.** Locales are `ar` (default, RTL) and `en`. CMS fields that hold text are `localized: true`; UI strings live in `src/i18n/en.ts` and `src/i18n/ar.ts` (same shape — TypeScript enforces it). Use logical CSS utilities (`ms-`, `pe-`, `start-`, `text-start`) and `rtl:` variants; never `ml-`/`left-` for layout.
- **Shared option lists** (levels, languages, statuses, countries…) live in `src/lib/options.ts` and feed both the Payload schema and the site.
- **Data access** goes through `src/lib/queries.ts`. Public queries use the local API, so always filter on `published: true` (catalogue collections) or `_status: 'published'` (pages, posts).
- **Public writes** (applications, enquiries, newsletter, analytics) only happen in `src/app/(frontend)/actions.ts` and `beacon/route.ts`, validated with zod, rate-limited and spam-checked. The REST API refuses public `create` on these collections.
- **Caching.** Pages are ISR (`revalidate = 600`). Every content change purges the site via `src/hooks/revalidate.ts`.
- **Schema changes** need a migration: `npm run migrate:create <name>` and commit `src/migrations/*`. Dev uses schema push; production runs `payload migrate` in `npm run ci`.
- After changing collections or admin components, run `npm run generate:types` and `npm run generate:importmap`.

## Checks before handing over

```bash
npm run typecheck
npm run build
```

Seed data (`src/seed/`) is bilingual and idempotent — re-running `npm run seed` updates documents in place.
