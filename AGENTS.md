<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

Package manager is **npm** (`package-lock.json` — don't switch to pnpm/bun).

- `npm run dev` — dev server (Turbopack). Note: `next dev` rewrites the managed block above; commit it with your work.
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`), whole repo.
- `npx tsc --noEmit` — typecheck only (no `typecheck` script exists).
- `npm run build` — production build; includes its own TypeScript check.

Verify in that order. There is **no test runner and no CI** — these three commands are the whole gate.

Known current failure: `npm run lint` exits non-zero on pre-existing `react-hooks/set-state-in-effect` errors in shadcn-generated `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`. Confirm the errors aren't from your change before editing generated files.

## Next.js 16 specifics (verified in `next.config.ts`)

- `cacheComponents` + `partialPrefetching` are enabled: data not covered by `<Suspense>` can fail the build. The version-matched docs in `node_modules/next/dist/docs/` are the source of truth over your training data.
- React Compiler is on (`reactCompiler: true`) — don't hand-add `useMemo`/`React.memo`.
- Tailwind v4 with **no config file**: theme tokens live in `src/app/globals.css` (`@theme inline` + oklch CSS variables). CSS is compiled through the `@tailwindcss/turbopack` rule in `next.config.ts`.
- Path alias `@/*` → `src/*`.

## UI components (shadcn, but Base UI — not Radix)

- `src/components/ui/*` is shadcn-generated (style `base-nova`, config in `components.json`) on **`@base-ui/react` primitives**. Your Radix-based shadcn knowledge doesn't apply here. Add/upgrade components with the vendored CLI: `npx shadcn add <component>` — don't hand-write primitives the registry ships.
- Import `cn` from the `"cn"` package (`src/lib/utils.ts` re-exports it). Don't create a clsx/tailwind-merge util.
- `src/app/globals.css` imports `shadcn/tailwind.css` — required by generated components; keep it.

## Codebase notes

- App Router routes live in `src/app` (`layout.tsx`, `page.tsx`); support code in `src/lib` and `src/hooks`.
- Code highlighting (`src/components/ui/code-block.tsx` → `useHighlightedCode` → `src/lib/highlighter.tsx`) only supports languages in the hardcoded `languages` allowlist; anything else silently renders unhighlighted. Add an entry there (plus an `aliases` entry if it has short names) to support a new language.
