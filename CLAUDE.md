# cavera-portfolio

Next.js 16 (App Router) + React 19 + SASS + GSAP portfolio, deployed on Vercel.
Content lives as files in `content/`, managed through Keystatic
(`/keystatic` admin UI, GitHub-mode commits once deployed).

## Commands

```bash
pnpm dev      # dev server
pnpm build    # production build — the real check; it prerenders every route
pnpm lint     # eslint (see "Known lint state" below)
```

There is no test suite. `pnpm build` is the verification step: every route is
statically generated, so a build that succeeds has actually rendered each page
with real data.

## Branches

- `main` — deployed. The redesign on Keystatic, live at
  `https://portfolio-cavera.vercel.app` (Vercel Production tracks `main`; there
  is no custom domain). Keystatic's admin UI there commits to `main`, so every
  admin save triggers a Production rebuild.
- `redesign-merge` — the old Notion-backed redesign, kept as a rollback
  reference. Not deployed from; safe to delete once the Keystatic site has
  proven stable.
- `redesign-keystatic` — the branch the Keystatic work was done on. Fully
  merged into `main`; kept only until `main` has proven stable.

Merging branches that each carry their own dependency fixes will conflict on
`package.json` and `pnpm-lock.yaml`. Resolve by taking the more recent branch's
side, then run `pnpm install` and commit the lockfile — never hand-edit it.
Check `git checkout --ours` didn't discard the other side's non-conflicting
hunks (pnpm overrides live in `pnpm-workspace.yaml`, not `package.json`).

## Architecture

Content flows one way, and the seam matters:

```
content/ (Keystatic-managed files) ─→ src/data/reader.ts ─→ src/data/source.ts ─→ route page.tsx (server) ─→ View (client, props)
```

- `src/data/source.ts` is the **only** place the app asks for content. It reads
  through `src/data/reader.ts` (`createReader(process.cwd(), keystaticConfig)`)
  — straight off the checked-out filesystem, no network call, no expiring URLs.
- Views (`src/components/views/*`) are `'use client'` and receive everything as
  props. They must never import a data module directly — that was the original
  bug that made a CMS impossible in the first place.
- Routes live under `src/app/[lang]/`, prerendered for `en` and `es`.
- `/keystatic` (admin UI) and `/api/keystatic/[...params]` (its API route) are
  the only non-static routes in the app — everything else is fully prerendered
  at build time now that there's no remote content source to revalidate.

### Types

`Project` (`src/types/project.ts`) is what views receive — already resolved to
one language. There is no bilingual "authored" layer anymore: each content
entry holds both languages' fields (`en`/`es` objects) and `source.ts` picks
one per request. Case bodies are Markdoc `Node` instances, fetched separately
via `getCaseNode(id, lang)` — they never enter `Project`, since they're class
instances and not serializable across a client boundary. **Views never index
by language.**

## Invariants — breaking these is silent, not loud

1. **Never rename a field key in `keystatic.config.ts` without migrating every
   content file.** The field key is exactly what `reader.ts`/`source.ts` reads
   from the YAML frontmatter (or a singleton's YAML) by name — same failure
   shape as the old Notion invariant, just with a different API surface. A
   rename yields `undefined` on every existing entry until the files are bulk
   migrated. No error, no log — same silent-blank-card failure as before.

2. **There's no more "public Spanish page" to leak.** The old Notion model kept
   English and Spanish as two separate pages, so a stray `public: true` on the
   Spanish one produced a duplicate listing. Keystatic's model has one entry
   per project holding both languages' fields — that specific failure mode is
   now structurally impossible. The invariant it collapsed into is #4 below:
   don't let `translated` claim a Spanish version that isn't real prose.

3. **A project's id is the folder slug — always the same value regardless of
   language**, because both languages live in one entry now. The old
   discipline ("id must come from the default-locale page, never a
   translation's own slug") is what this replaces; it doesn't need enforcing
   by hand anymore, but the *reason* it mattered still applies to
   `alternates()`: `/en/work/<id>` and `/es/work/<id>` are built from one path,
   and every URL pair must actually resolve.

4. **Never advertise an `hreflang` for a locale that falls back.** `Project`
   carries `translated: false` when the content is English standing in for
   Spanish — driven by the `translated` checkbox on the entry, flipped only
   once real Spanish prose exists in `es.*` and `caseEs`. Pass the available
   locales to `alternates()` and filter the sitemap the same way. Serving
   English at a `/es/` URL under `hreflang="es"` is worse than emitting
   nothing.

5. **Cover images (`img`) must never be an empty/missing value without a
   fallback.** Notion's version of this invariant was about expiring signed S3
   URLs — that risk is gone, `img` is just a stable URL field now (Cloudinary
   or nothing). The equivalent risk today: `entry.img` reads as `null` for an
   entry with no cover set, and `getProjects` in `source.ts` falls back to
   `DEFAULT_PROJECT_BG` rather than emitting an empty `src`. Don't remove that
   fallback — an empty `src` is a broken image request, not a graceful default.

## Where things stand

The Keystatic migration is finished and live. All steps in
`docs/CMS-KEYSTATIC-PLAN.md` are done: content authored as files, `source.ts`
reading through Keystatic's reader, GitHub mode running in production.
Notion is no longer read by anything.

Production setup (Vercel, project `portfolio`): the 4 Keystatic env vars
(`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
`KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) are set for
Production and Preview. The GitHub App lists redirect URIs for local dev
(`127.0.0.1`), the preview alias and the production domain. The storage switch
in `keystatic.config.ts` keys on `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (the
config is bundled client-side, so a server-only var silently gives local mode);
`pnpm dev` always stays on local storage.

Gotchas learned going live:
- **Next 16.4.2 breaks `next/font/google` on Vercel's builders** (Turbopack:
  "queries have exactly one entry"), though it builds fine locally. Production
  is pinned to Next 16.3.8. Don't bump Next without a preview deploy first.
- The canonical/sitemap/robots URL is hardcoded in `src/data/consts.ts`,
  `public/robots.txt` and one project's `live` link; keep it matching the real
  production domain.
- Vercel env vars only apply to new builds.

Remaining Dependabot finding: `braces` (no patched release exists on npm).

## Known lint state

`pnpm lint` exits non-zero with 7 problems, all pre-existing and deliberate:

- 1 error, `react-hooks/set-state-in-effect` in `ThemeProvider` — the effect
  adopts a `data-theme` attribute set by a pre-paint script to avoid a
  light/dark flash. Unfixed, not unnoticed.
- 6 warnings, `@next/next/no-img-element` — the owner declined `next/image`.
  Every image is an external Cloudinary or Notion URL, so it would need
  `remotePatterns` and would bill through Vercel image optimization. (Was 5;
  the work-page archive grid added a second `<img>` to `WorkView.tsx`.)

Do not "fix" these without asking. A new problem appearing means the count
should change from 7.

## Further reading

- `docs/CMS.md` — current-state summary of the Keystatic CMS
- `docs/CMS-KEYSTATIC-PLAN.md` — the full migration plan: architecture,
  content model, ordered steps, and every real gotcha found by actually
  building it rather than trusting the original assumptions
- `docs/DEPENDENCIES.md` — a deliberately dismissed advisory; read before
  touching `brace-expansion` or accepting a Dependabot suggestion
