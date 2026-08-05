# Plan: Move the CMS source off Notion → Keystatic (GitHub mode)

Not started — this is a plan document only, saved for a future implementation
session. No Keystatic code exists yet on this branch.

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
`HomeView`, `WorkView`, sitemap, and metadata code don't change. Markdoc nodes
are class instances (not serializable to client props), so case bodies never
enter `Project`.

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

All on `redesign-merge`.

1. **Install + scaffold**: packages, `keystatic.config.ts` (local storage
   first), the 4 admin/API files, `src/data/reader.ts`. Nothing imports the
   reader yet. Verify `/keystatic` opens in `pnpm dev`.
2. **Author content files**: convert the 4 complete bilingual projects from
   `portfolio.ts` (`public: true, translated: true, hasCase: true`, sortOrder
   1–4); case bodies become `caseEn/caseEs.mdoc` with `## Context`/`## Contexto`
   headings, process as lists; recover the 6 Reserva screenshots from the
   Notion page into `public/images/work/` (re-hosted, captioned). Create the 3
   singletons. Open every entry in the local admin UI.
3. **Rewire**: source.ts → reader; types updated; `getCaseNode`; CaseView +
   case page. Build; diff rendered HTML of `/en`, `/es`, all 8 case pages
   against the previous build.
4. **Delete dead code**: `src/data/notion/` (client, mapper, fixtures, README),
   `src/data/portfolio.ts`, Authored* types, `NOTION_*` mentions. Update
   `CLAUDE.md` (invariants 1/2/5 are Notion-specific → replace with Keystatic
   equivalents; 3/4 survive) and rewrite `docs/CMS.md`.
5. **GitHub mode + Vercel**: storage ternary; deploy preview; run the GitHub
   App flow from the deployed `/keystatic`; set the 4 env vars in Vercel;
   verify a phone edit → commit → redeploy round-trip. Add
   `Disallow: /keystatic` to `robots.txt`.
6. **Later, separately**: import the ~27 Notion stubs as `public: false`
   entries (title/img/links/tags only).

**Branch caveat**: GitHub-mode commits land on the branch selected in the admin
UI (default branch by default). Production deploys from `main`, so merge
`redesign-merge` → `main` before daily phone use, or edits will target content
the deployed site doesn't build from.

## Verification

- `pnpm build`: route list is exactly the current 19 static pages + sitemap,
  plus `/keystatic` and `/api/keystatic` as the only dynamic entries.
- A `public: false` test entry produces no route and no sitemap line.
- Flip one project's `translated` to false, rebuild: its `/es/work/<slug>`
  leaves the sitemap, `/en` head loses `hreflang="es"`, ES listing shows
  English text + fallback note. Flip back.
- Compare hreflang/x-default, case-page `<h1>`, meta description, OG image
  against pre-migration build output.
- Admin UI: edit each collection/singleton locally; upload an image into a case
  body; confirm it lands in `public/images/work/` and renders.
- `pnpm lint` still reports exactly the 6 known pre-existing problems.
- `grep -r notion src/` and imports of `data/portfolio` return nothing.
- After step 5: build log fetches nothing from the network for content.
