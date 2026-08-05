# CMS — Keystatic (GitHub mode)

Content lives as files in `content/`, edited through Keystatic's admin UI at
`/keystatic`. In GitHub mode (production, once step 5 of the migration lands)
each edit is a real commit through a GitHub App — editable from a phone
browser, no local checkout needed. Locally (`pnpm dev`, no GitHub credentials
set) it reads and writes the checked-out repo directly.

This file is a current-state summary. For the step-by-step migration off
Notion — what's done, what's left, and every real gotcha found by actually
building it rather than trusting the original assumptions — see
`docs/CMS-KEYSTATIC-PLAN.md`.

## Content model

```
content/
  projects/<slug>/index.mdoc   # YAML frontmatter (every data field) + English case body
  projects/<slug>/caseEs.mdoc  # Spanish case body — its own clean file
  profile.yaml                 # singleton: email, portrait, socials, skills, certs, stats
  experience.yaml               # singleton: items[]
  photos.yaml                   # singleton: items[]
```

Schema lives in `keystatic.config.ts` (repo root). The reader
(`src/data/reader.ts`, `createReader(process.cwd(), config)`) is consumed only
by `src/data/source.ts` — nothing else in the app touches Keystatic directly.

## Case bodies are free-form

`caseEn`/`caseEs` are Markdoc fields, not a fixed Context/Role/Process/Outcome
schema — headings, lists, images, quotes, whatever a given story needs.
`getCaseNode(id, lang)` in `source.ts` returns the raw Markdoc `Node`;
`CaseView` renders it with `Markdoc.renderers.react(Markdoc.transform(node),
React)`. Case bodies never enter the `Project` type — they're class
instances, not serializable across a client boundary, and `CaseView` is a
server component so it never needs to cross one.

## Where things stand

Steps 1–4 of the migration are done: package scaffold, admin UI + API route,
all 6 complete bilingual projects and the 3 singletons authored as real
content, and `source.ts`/types/`CaseView` rewired to read through Keystatic
instead of Notion. `src/data/notion/` and `src/data/portfolio.ts` are deleted.

Step 5 (GitHub mode + Vercel) hasn't started: no GitHub App is wired up, so
`/keystatic` only works against the local filesystem — there's no way to edit
content on a deployed site yet. Full detail, including the branch caveat
about which branch GitHub-mode commits land on, is in
`docs/CMS-KEYSTATIC-PLAN.md`.

## Superseded

This file used to describe a plan for a Notion-backed CMS. That path was
abandoned — Notion's mapper silently dropped real content (images,
sub-headings, nested lists, inline formatting), and kept the site living with
expiring signed cover URLs, API rate limits, and property-name-as-API
fragility. `docs/CMS-KEYSTATIC-PLAN.md` explains the decision in full; the
Notion-backed version of this app still exists and is live in production on
the `redesign-merge` branch, unaffected by this migration.
