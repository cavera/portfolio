# cavera-portfolio

Next.js 16 (App Router) + React 19 + SASS + GSAP portfolio, deployed on Vercel.
Content is moving from hardcoded TypeScript to a Notion CMS.

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
- `claude/redesign-notion-sync-jcjk31` — the redesign plus all CMS work. Not
  merged, deliberately: the owner wants it separate until happy with it.

The two branches have separate dependency-fix commits, so `package.json` and
`pnpm-lock.yaml` will conflict whenever they finally merge. Resolve by taking
the redesign branch's side, then run `pnpm install` and commit the lockfile —
never hand-edit it.

## Architecture

Content flows one way, and the seam matters:

```
Notion  ─┐
         ├─→ src/data/source.ts ─→ route page.tsx (server) ─→ View (client, props)
portfolio.ts ─┘
```

- `src/data/source.ts` is the **only** place the app asks for content. It reads
  Notion when `NOTION_TOKEN` and `NOTION_DATABASE_ID` are both set, and the
  hand-authored `src/data/portfolio.ts` otherwise.
- Views (`src/components/views/*`) are `'use client'` and receive everything as
  props. They must never import a data module — that was the original bug that
  made a CMS impossible.
- Routes live under `src/app/[lang]/`, prerendered for `en` and `es`.

### Types

`AuthoredProject` (bilingual, how `portfolio.ts` is written) vs `Project`
(resolved to one language, what views receive). Notion pages are monolingual, so
its mapper produces `Project` directly. **Views never index by language.**

## Invariants — breaking these is silent, not loud

1. **Never rename or delete these Notion properties:** `title`, `subtitle`,
   `source`, `live_link`, `skills`, `public`, `featured`. The live site on
   `main` reads them by name, and Notion's API key *is* the display name. A
   rename yields `undefined` → `|| ''` → blank cards. No error, no log.

2. **Spanish pages stay `public: false` forever.** The live site filters on
   `public` alone with no language filter, so a public Spanish page appears as a
   duplicate entry within 60 seconds. Spanish is published by having a `slug`
   and a `translation_of` link instead.

3. **A project's id must come from the default-locale page.** It is the URL
   segment, and `alternates()` builds `/en/work/<id>` and `/es/work/<id>` from a
   single path. If a translation's slug won the id, half of every alternate pair
   would point at a URL that does not exist.

4. **Never advertise an `hreflang` for a locale that falls back.** `Project`
   carries `translated: false` when the content is English standing in for
   Spanish. Pass the available locales to `alternates()` and filter the sitemap
   the same way. Serving English at a `/es/` URL under `hreflang="es"` is worse
   than emitting nothing.

5. **Never bake a Notion-hosted cover into a static page.** They are signed S3
   URLs valid for about an hour. `mapper.ts` accepts external covers only and
   falls back to `DEFAULT_PROJECT_BG`.

## Where things stand

Done: redesign landed, deps patched, localized routes with hreflang, generated
sitemap, server-side fetching, Notion schema + adapter, case studies as real
pages at `/[lang]/work/[slug]`.

The Notion switch is **off**. Four projects have complete content in Notion
(properties + case bodies, EN and ES). The other 27 published pages have titles,
covers, links and skills but empty `desc`/`role`/`year`/`stack`/`has_case`.

**The Notion fetch path has never run.** It was built in an environment with no
network route to `api.notion.com`; the mapper was verified against
realistically-shaped payloads driven through the build, but the transport was
not. The first preview build with the env vars set is the real test. Watch for
`Notion project query failed` in the build log — that means it fell back to
static content.

To turn it on, set on a preview deployment first:

```
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=dd48d35c0dfc4ba38b2392f28c16fd08
```

## Known lint state

`pnpm lint` exits non-zero with 6 problems, all pre-existing and deliberate:

- 1 error, `react-hooks/set-state-in-effect` in `ThemeProvider` — the effect
  adopts a `data-theme` attribute set by a pre-paint script to avoid a
  light/dark flash. Unfixed, not unnoticed.
- 5 warnings, `@next/next/no-img-element` — the owner declined `next/image`.
  Every image is an external Cloudinary or Notion URL, so it would need
  `remotePatterns` and would bill through Vercel image optimization.

Do not "fix" these without asking. A new problem appearing means the count
should change from 6.

## Further reading

- `docs/CMS.md` — the CMS plan, schema gap, and status table
- `docs/DEPENDENCIES.md` — a deliberately dismissed advisory; read before
  touching `brace-expansion` or accepting a Dependabot suggestion
- `src/data/notion/README.md` — the Notion layer and pointers to code deleted in
  the redesign that is worth recovering from git history
