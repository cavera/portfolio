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

- `main` — deployed. Still the **old** design, reading Notion through
  `src/data/notion.ts` + `src/data/mapData.ts`.
- `redesign-merge` — the redesign, with Notion as its CMS. Not merged,
  deliberately: the owner wants it separate until happy with it. As of this
  session it's live in production on the `portfolio-cavera.vercel.app`
  deployment — the Notion switch is **on**, not a plan anymore.
- `redesign-keystatic` — branched off `redesign-merge` to replace Notion with
  Keystatic (this branch). See `docs/CMS-KEYSTATIC-PLAN.md` for why and the
  step-by-step status. Not merged anywhere yet.

Each branch has its own dependency-fix commits, so `package.json` and
`pnpm-lock.yaml` will conflict whenever any of these merge. Resolve by taking
the more recent branch's side, then run `pnpm install` and commit the
lockfile — never hand-edit it.

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

Migrating off Notion onto Keystatic (GitHub mode). Steps 1–4 of the plan in
`docs/CMS-KEYSTATIC-PLAN.md` are done: package scaffold, admin UI + API route,
all 6 complete bilingual projects + the 3 singletons authored as real content
files, and `source.ts`/types/`CaseView` rewired to read through Keystatic's
reader instead of Notion. `src/data/notion/` and `src/data/portfolio.ts` are
deleted — nothing in the app reads them anymore.

Step 5 (GitHub mode + Vercel) has not started: no GitHub App is wired up yet,
so `/keystatic` only works against the local filesystem (`pnpm dev`) — there's
no way to edit content on the deployed site yet, and this branch itself isn't
deployed anywhere. See the plan doc for the exact remaining steps and the
branch caveat about GitHub-mode commits landing on whichever branch the admin
UI is pointed at.

The redesign's earlier Notion rollout (schema, adapter, localized routes,
hreflang, sitemap) is all still true of `redesign-merge`, which remains
Notion-backed and live in production. This branch is a fork of that work, not
a replacement of it — until this migration finishes and merges, the two CMS
approaches exist in parallel on different branches.

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
