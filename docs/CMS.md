# CMS plan — making the site editable from Notion

Goal: edit the site from Notion instead of from `src/data/portfolio.ts`, write a
full case study for every project, and add a blog later without rebuilding the
data layer a second time.

This document is the plan. Nothing here is implemented yet.

## Where things stand

The redesign replaced the Notion-backed front-end with hardcoded content. Two
consequences:

- `src/data/portfolio.ts` holds **4 projects**. The Notion database holds **31
  public ones**, including 3 more marked `featured` (To-do react App, Age
  Calculator App, Tic tac toe). Those 27 are currently not on the site.
- `src/data/notion/client.ts` still works but has no callers. See that folder's
  README.

## The gap

Notion database `Proyectos` (data source `1a1e7c1f-f988-4b9f-bfc5-bdf17119697d`)
has these properties today:

`title`, `subtitle`, `skills` (multi-select), `source` (url), `live_link` (url),
`public` (checkbox), `featured` (checkbox), `origin` (multi-select),
`progress` (status) — plus the page cover and the page body.

The redesign's `Project` type (`src/types/project.ts`) wants rather more:

| Field | Notion today | Action |
| --- | --- | --- |
| `title` | `title` | maps as-is |
| `live` | `live_link` | maps as-is |
| `code` | `source` | maps as-is |
| `img` | page cover | works, but see *Images* below |
| `tags` / `stack` | `skills` (one list) | split into two properties |
| `kind` | `subtitle` (EN only) | add `subtitle_es` |
| `year` | `createdTime` only | add an explicit `year` |
| `id` (slug, e.g. `reserva`) | — | add `slug`; needed for stable URLs |
| `desc` | — | add `desc_en` / `desc_es` |
| `role` | — | add `role_en` / `role_es` |
| `hasCase` | — | add checkbox |
| `case.*` (context/role/process/outcome) | — | page body, see below |

Roughly five fields map cleanly; everything the redesign added has no home yet.

### Properties to add to `Proyectos`

```
slug        text        stable URL segment; required, unique
year        number      display year
has_case    checkbox    does this project have a written case study
desc_en     text        one-paragraph card description
desc_es     text
subtitle_es text        Spanish counterpart of the existing `subtitle`
role_en     text        your role, one line
role_es     text
stack       multi-select  tools actually used to build it
sort_order  number      manual ordering; falls back to created time
```

Keep `skills` as the display tags and let `stack` be the build tools — that's the
`tags` vs `stack` split the redesign already assumes. `public` stays the
publish gate, `featured` decides what the home page bento surfaces.

### Case-study prose goes in the page body

Do not model `context` / `role` / `process[]` / `outcome` as properties. Long
prose in Notion text properties is painful to write and impossible to format.
Put it in the page body under four fixed `heading_2` blocks, and have the mapper
section the blocks by heading:

```
## Context
## Role
## Process        (bulleted list — each item becomes one process step)
## Outcome
```

`blockMap.tsx` from git history already renders paragraph, embed, image,
link_preview and video blocks, so most of the renderer exists.

### On Spanish

Notion has no native localization, so paired `_en` / `_es` properties are the
honest option for card-level fields. For case-study bodies, paired properties
don't work — either keep one Spanish sub-page per project, or accept an English
fallback for case bodies. **Recommendation:** ship English case bodies first with
a visible "English only" note in the ES view, and add Spanish per-project as you
write it. Half-empty translations read worse than an honest fallback.

## Architecture

Two changes, in this order. The first is a prerequisite for the second and is
worth doing on its own.

### 1. Lift data fetching to the server

`HomeView`, `WorkView`, `PhotoView` and `AboutView` are all `'use client'` and
import `@/data/portfolio` at module scope. Nothing async can reach them.

Fix: the route files (`src/app/work/page.tsx` and friends) stay server
components, do the fetching, and pass data down as props. The views keep their
GSAP/animation logic and lose their direct data imports. Do this against the
existing static data first — no Notion involved — so it can be verified on its
own.

### 2. One source module behind a stable type

```ts
// src/data/source.ts
export async function getProjects(): Promise<Project[]>
export async function getProject(slug: string): Promise<Project | null>
```

Backed by Notion when `NOTION_TOKEN` is set, and by `portfolio.ts` otherwise.
The static path is not a throwaway — it keeps local dev and preview builds
working without secrets, and keeps the site deployable if the Notion API is
down. `Project` in `src/types/project.ts` is the contract between the two.

## Blog

When it arrives: a **separate** Notion database, not a `type` column on
`Proyectos`. Posts and projects share almost no properties, and overloading one
database means every project query drags blog filters around. Same client, same
block renderer, new mapper — which is exactly what step 2 is designed for.

## Pitfalls

- **Image expiry.** Notion-hosted covers are signed S3 URLs valid for ~1 hour.
  The old code masked this with a 60-second revalidate. Either keep covers as
  external URLs in Notion (the redesign's Cloudinary links already are), or
  re-host at build time. Do not statically export a Notion file URL.
- **Rate limits.** Notion allows ~3 requests/second. A case study per project
  means one query plus N block fetches — fetch page bodies only on the detail
  route, not for the list.
- **`sitemap.xml` is a static file** in `public/`. Once content is dynamic it
  needs to become a generated route, or it will silently go stale — which
  matters a lot more once there's a blog.
- **The site is currently `noindex`.** `src/app/metadata.tsx` sets
  `robots.index: false` while `googleBot.index: true`. Google indexes it;
  Bing and DuckDuckGo are told not to. If the point is to be found, that wants
  fixing — deliberately, since it changes SEO behaviour.
