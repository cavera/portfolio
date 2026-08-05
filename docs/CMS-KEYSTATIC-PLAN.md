# Plan: Move the CMS source off Notion → Keystatic (GitHub mode)

**Status: steps 1, 2, 3, 4, and 6 done; step 5 not started.** On the
`redesign-keystatic` branch (forked from `redesign-merge`). Scaffold,
content (including the 27 Notion stubs and the 6 recovered Reserva
screenshots), and rewiring are all live and verified locally. Only step 5
(GitHub mode + Vercel) remains — it's the one piece that genuinely needs a
real deployment, since the GitHub App OAuth flow has to run against a public
URL. See "Ordered migration steps" below for exactly what's done.

## Context

The portfolio (Next.js 16 App Router, fully static, bilingual en/es, Vercel) was
mid-migration to a Notion CMS. That path is being abandoned: the Notion mapper
silently drops real content (on the actual "Reserva tu campo" page it loses the
intro paragraph and all six screenshots, plus images, sub-headings, nested
lists, and inline formatting everywhere), and fixing it means rebuilding a block
model while still living with Notion's structural traps — expiring signed image
URLs, rate limits, property names as API, a transport never run in CI.

Owner requirements (confirmed):
1. **Phone editing** — a real editing UI usable from a phone browser (why plain
   markdown-in-repo was rejected).
2. **Free-form case bodies** — headings, lists, images, quotes; the
   Context/Role/Process/Outcome schema becomes a writing convention, not a type.
3. **Everything content-like moves out of code** — projects + case bodies,
   experience, skills, certs, socials, photos, profile (all currently in
   `src/data/portfolio.ts`).
4. Site stays fully static; bilingual invariants hold (English default,
   `translated` only when real Spanish exists, hreflang/sitemap only advertise
   real locales).
5. No expiring image URLs ever.

## Chosen approach: Keystatic in GitHub mode

Content lives as files in the repo; the admin UI (served by the site at
`/keystatic`) edits via commits through a GitHub App — editable from a phone
browser; each edit triggers a Vercel rebuild. Builds read content from the
checked-out filesystem via `createReader` — **zero external dependency at
build**. Verified: `@keystatic/core ^0.6.4` (2026-07-31, React 19 peer),
`@keystatic/next ^5.0.4` (next ≥14), `@markdoc/markdoc ^0.4.0`.

```
pnpm add @keystatic/core @keystatic/next @markdoc/markdoc
```

Admin file layout (verified against official template):
- `keystatic.config.ts` (repo root)
- `src/app/keystatic/keystatic.tsx` — `'use client'; makePage(config)`
- `src/app/keystatic/layout.tsx` — **must render its own `<html><body>`**: this
  app has no root layout (`[lang]/layout.tsx` is the root of its subtree) and
  `/keystatic` sits outside `[lang]`
- `src/app/keystatic/[[...params]]/page.tsx`
- `src/app/api/keystatic/[...params]/route.ts` — `makeRouteHandler({ config })` from
  `@keystatic/next/route-handler` (**verified**: not `@keystatic/next/api`, which
  is the Pages Router variant taking `NextApiRequest`/`NextApiResponse` — the
  App Router one lives at the `route-handler` subpath and returns
  `{ GET, POST }` handlers that take a `Request`)

Storage: `process.env.KEYSTATIC_GITHUB_CLIENT_ID ? { kind: 'github', repo: 'cavera/portfolio' } : { kind: 'local' }`
— **verified deviation:** the original plan said branch on `NODE_ENV ===
'development'`, but `next build` always sets `NODE_ENV=production`, even
locally, so that check sent every local `pnpm build` down the GitHub path and
failed on missing credentials before a single page even rendered. Branching on
whether the credential actually exists means local dev, local build
verification, and any preview deploy before step 5 sets up the GitHub App all
safely fall back to local storage. GitHub mode setup is a guided flow on first
visit to the deployed `/keystatic`; it produces 4 env vars
(`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
`KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) to set in Vercel.

## Content model

```
content/
  projects/<slug>/index.mdoc       # YAML frontmatter (all data fields) + caseEn body
  projects/<slug>/caseEs.mdoc      # free-form ES case body — its own clean file
  profile.yaml                     # singleton: email, portrait, socials, skills, certs, stats
  experience.yaml                  # singleton: items[]
  photos.yaml                      # singleton: items[]
public/images/work/                # images uploaded via the editor (committed → never expire)
```

**Verified deviation from the original plan — corrected after actually creating
an entry and reading the files, not just reasoning about types:**
`format.contentField` only accepts one field (a single name, or an array
that's a *path* into a nested object — not a list of independent fields).
Tried `contentField: ['caseEn', 'caseEs']` expecting two sibling `.mdoc`
files; Keystatic rejected it at runtime with "Path specified in contentField
does not point to a content field." Fix: `caseEn` is the sole `contentField`.
An earlier version of this note assumed that made `caseEs` collapse into an
inline string inside a separate `index.yaml` — **that was wrong**, corrected
by creating a real entry through the admin UI and reading what Keystatic
actually wrote to disk:

- The designated `contentField` doesn't produce its own named file — it
  merges with the data fields into **`index.mdoc`**: YAML frontmatter (every
  non-markdoc field) followed by `---` and then the `caseEn` body as plain
  Markdoc text.
- `caseEs`, despite not being the `contentField`, still gets its own clean
  **`caseEs.mdoc`** file automatically — no config needed for that. Both
  fields are real, standalone, human-diffable Markdoc files; the only
  asymmetry is that the EN one is folded into `index.mdoc` and the ES one is
  a sibling. There is no `index.yaml` at all.

Confirmed in the admin UI: both fields render as full rich Markdoc editors
(toolbar, image upload, etc.) with identical editing UX regardless of which
one is the file that also carries the frontmatter.

**Separate finding, not a Keystatic bug:** the rich-text editor's "/" slash
menu is the only reliable way to insert headings/lists — typing literal
`## ` or `- ` as plain text does **not** auto-convert (no Markdoc-shorthand
input rules). Worse, driving multi-block content (heading → paragraph →
list → heading → paragraph) through Playwright by alternating `press('/')` +
click-menu-option + `fill(text)` + `press('Enter')` silently corrupted the
document after ~8 steps — the final `fill()` call replaced the *entire*
multi-block body with just its own text, wrapped in bold, nested in a
leftover list. Actual case-body content for every project was therefore
**hand-authored directly as `.mdoc` files** (Markdoc's whole point is being a
plain-text format — no need to go through the WYSIWYG editor to produce
valid output), verified only by loading the finished entries in the admin UI
afterward to confirm Keystatic parses them without error.

**`projects` collection** — one entry per project, both locales in one entry
(shared fields can't drift; one entry to open on the phone):
- `title: fields.slug(...)` — slug independently editable → existing URLs
  (`reserva-tu-campo`, …) preserved exactly
- `public: fields.checkbox({ defaultValue: false })` — **draft gate**; the ~27
  Notion stubs import later as `public: false` and never render
- `sortOrder: fields.integer()` — nulls sink, keeping current sort semantics
- `year`, `img` (url — keep Cloudinary), `live`, `code`, `tags[]`, `stack[]`
- `en: fields.object({ kind, desc, role })`, `es: fields.object({ ... })`
- `translated: fields.checkbox()` — **explicit** source of truth for the
  hreflang invariant; owner flips it only when real Spanish exists
- `hasCase: fields.checkbox()` — a body can be drafted without publishing
- `caseEn` / `caseEs: fields.markdoc({ options: { image: { directory:
  'public/images/work', publicPath: '/images/work/' } } })` — the free-form
  replacement for `CaseStudy`

**`experience` singleton**: `items: array(object({ when, role, co, badge?,
summaryEn, summaryEs }))` — admin arrays support drag-reorder.
**`photos` singleton**: `items: array(object({ title, aspect: select, link,
src: url }))`. The 500px `src` URLs are signed — optionally re-host on
Cloudinary during migration (same risk category as Notion URLs).
**`profile` singleton**: email, portrait URLs, socials[], skills[], certs[],
stats[]. Note: `HomeView` stats tile is hardcoded JSX today (`HomeView.tsx:123-134`)
and `portfolio.ts`'s `stats` export is dead — add a `stats` prop to HomeView.

**Types (`src/types/project.ts`)**: delete `CaseStudy` and the whole Authored*
layer; `Project` drops `case?` but otherwise stays byte-identical, so
`WorkView`, sitemap, and metadata code don't change. Markdoc nodes are class
instances (not serializable to client props), so case bodies never enter
`Project`. **Correction after actually doing it:** `HomeView` needed one real
change unrelated to `Project` — its stats tile imported the `stats` constant
directly from `portfolio.ts` (added in an earlier, separate session), so
deleting that file meant threading `stats` through as a prop from
`getProfile()` instead. Small, but not a "no changes" case as first assumed.

## source.ts rewiring (signatures preserved)

New `src/data/reader.ts`: `createReader(process.cwd(), keystaticConfig)`.

- `getProjects(lang)`: `reader.collections.projects.all()` → filter `public` →
  sort by `sortOrder` (nulls last) → map to `Project`; for `es && !translated`
  serve `en.*` text with `translated: false` (current fallback semantics). Do
  not touch the `caseEn()`/`caseEs()` async content functions here.
- `getProject`, `getPhotos`, `getExperience`, `getProfile`: same contracts,
  reader-backed.
- **New** `getCaseNode(id, lang): Promise<Node | null>` — picks `caseEs` when
  `lang==='es' && translated`, else `caseEn`; returns the Markdoc node.

`CaseView.tsx` (server component): keep hero/meta/tags/links chrome and the ES
fallback note; replace the four fixed sections (lines 65–99) with
`Markdoc.renderers.react(Markdoc.transform(node, markdocConfig), React)`.
`work/[slug]/page.tsx` calls `getCaseNode` and passes the node as a prop; its
`generateStaticParams`/hreflang logic unchanged.

## Ordered migration steps (green `pnpm build` after each)

All on `redesign-keystatic` (forked from `redesign-merge`, not merged
anywhere).

1. ✅ **Install + scaffold** — packages, `keystatic.config.ts` (storage
   branches on `KEYSTATIC_GITHUB_CLIENT_ID` presence, see deviation note
   above), the 4 admin/API files, `src/data/reader.ts`. Verified `/keystatic`
   opens in `pnpm dev` with the Projects collection and all 3 singletons
   registered, zero console errors.
2. ✅ **Author content files** — all **6** complete bilingual projects
   migrated (not 4: this plan was written from a checkout that predated two
   case studies added later in the same session — `portfolio-architecture`
   and `rebelmouse-translations` — so all 6 that existed went in, not just
   the original 4), `sortOrder` 1–6. Case bodies hand-authored directly as
   `.mdoc` files (see the WYSIWYG-corruption finding above), verified by
   loading every entry back into the admin UI. The 3 singletons created.
   The 6 Reserva screenshots were initially deferred, then recovered in a
   later pass (see step 6 below) — fetched from the live Notion page as
   signed S3 URLs (300-second expiry; 2 of 6 expired mid-download on the
   first attempt and needed a second fetch for fresh URLs) and committed to
   `public/images/work/`.
3. ✅ **Rewire** — `source.ts` reads through `reader` instead of
   Notion/`portfolio.ts`; `Project` type dropped `case`/`CaseStudy`/`Authored*`;
   `getCaseNode` added; `CaseView` renders Markdoc directly; `HomeView`'s
   stats tile takes `stats` as a prop instead of importing a static constant.
   Verified live in a browser (not just `pnpm build`) on every route: home,
   work listing, a case page in both languages, about, photography, CV,
   `sitemap.xml` — zero console errors, correct Markdoc rendering, live
   stats, correct hreflang.
4. ✅ **Delete dead code** — folded into step 3's commit rather than kept
   separate: deleting the `Authored*`/`CaseStudy` types (step 3's own scope)
   immediately breaks `src/data/notion/` and `src/data/portfolio.ts`, which
   depend on them, so there was no way to sequence these as genuinely
   separate steps. Both deleted, confirmed zero remaining imports of either
   first. `CLAUDE.md`'s Notion invariants rewritten with their Keystatic
   equivalents (invariant 2's old risk — a stray public Spanish page —
   doesn't exist anymore now that both languages live in one entry, so it's
   documented as dissolved rather than replaced). `docs/CMS.md` rewritten as
   a short current-state summary pointing here for detail.
5. ⬜ **GitHub mode + Vercel** — not started, the one step that genuinely
   needs a real deployment (the GitHub App's OAuth callback needs a public
   URL). Deploy a preview; run the GitHub App flow from the deployed
   `/keystatic`; set the 4 env vars in Vercel; verify a phone edit → commit
   → redeploy round-trip. `Disallow: /keystatic` in `robots.txt` was done
   ahead of time (see step 6) since it doesn't depend on the App itself.
6. ✅ **Local-only pieces, done ahead of step 5** — three things that didn't
   need a deployment: imported all **27** Notion stubs as `public: false`
   entries (title, live/code links, skills-as-tags; no individual cover
   fetch — 27 unpublished stubs don't render anywhere, so they fall back to
   `DEFAULT_PROJECT_BG` until whoever publishes one fills in a real cover
   through the admin UI at that point), added `Disallow: /keystatic` to
   `robots.txt`, and recovered the 6 Reserva screenshots. Verified: `pnpm
   build` still green with 12 case pages (all 27 stubs correctly excluded),
   `pnpm lint` unchanged at 7, all 6 recovered images return 200 and render
   with correct alt text on the live case page, and the admin UI lists all
   33 entries with zero console errors.

**Branch caveat**: GitHub-mode commits land on the branch selected in the admin
UI (default branch by default). Production deploys from `main`, which is
still on the old design reading Notion through different, older code — not
even `redesign-merge`. This branch needs its own deploy target decided before
step 5 means anything: merge to `redesign-merge` (which is itself unmerged to
`main`), or deploy standalone for testing first. Don't assume "deploy" means
"go live" here the way it did for the Notion switch.

## Verification

Confirmed through step 4:

- `pnpm build`: 12 case pages (6 projects × 2 locales) + the rest of the
  static routes, `/keystatic` and `/api/keystatic/[...params]` as the only
  dynamic entries — no revalidate windows anywhere anymore, since there's no
  remote content source left to periodically refresh.
- `pnpm lint`: unchanged at 7 pre-existing problems (was 6 before this
  session's separate PLAN.md work added a second `<img>` to `WorkView`; not
  related to this migration).
- `grep -rl "@/data/portfolio\|@/data/notion" src/` returns nothing.
- Real browser checks (not just build output) on every route: home (live
  project count in stats, not a hardcoded figure), work listing, a case page
  in both languages (real Markdoc headings/lists/inline-code render
  correctly), about, photography, CV, `sitemap.xml` (correct hreflang) — zero
  console errors anywhere.
- Every project + singleton opens in the admin UI with zero console errors.
- `public: false` produces no route and no sitemap line — confirmed for
  real with the 27 imported Notion stubs, not just a hypothetical test
  entry: `pnpm build` still generates exactly 12 case pages after adding
  them, all 27 excluded correctly.

Still pending, blocked on step 5:

- Flip one project's `translated` to false, rebuild: its `/es/work/<slug>`
  leaves the sitemap, `/en` head loses `hreflang="es"`, ES listing shows
  English text + fallback note. Flip back.
- Upload an image into a case body through the admin UI; confirm it lands in
  `public/images/work/` and renders. Not yet tried — every image URL used so
  far is an existing Cloudinary link, not an editor upload.
- Build log fetches nothing from the network for content — true today by
  construction (filesystem reader only), but worth confirming again once
  GitHub-mode storage is live, since that mode does talk to the GitHub API.
