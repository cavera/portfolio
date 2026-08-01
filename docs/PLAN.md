# Portfolio review — what's left on `redesign-merge`

An assessment of the branch as of 2026-08-01: shipped defects, the content gap
between the Solutions Architect positioning and the evidence on the site, UX
recommendations, and a suggested order of work.

Owner's decisions that shaped this plan:

- **Audience:** both — SA/technical-leadership hiring managers *and*
  freelance clients. Strengthen each pillar, keep the hybrid positioning.
- **NDA:** anonymized RebelMouse case studies are OK (problem shape,
  decisions, outcomes — no client names or screenshots beyond what's public).
- **Project count:** curated strongest projects featured, with the ability to
  browse the full archive.

## Verdict

The engineering is in good shape — the build is green, the architecture is
clean, and the i18n/SEO plumbing is careful. What holds it back from being a
solutions-architect portfolio is almost entirely **content**: the site *says*
Solutions Architect in the hero, but every project is hands-on front-end work
at bootcamp/personal scale, and the metadata still brands the site as
front-end developer. There are also shipped defects that undercut an
otherwise polished site.

## 1. Defects currently live on the branch

1. **Placeholder text ships on a case page.** The Reserva tu campo outcome
   ends with "*[Add your metrics here — team size, fields listed,
   bookings.]*" in both languages (`src/data/portfolio.ts:112-113`). Renders
   on `/en/work/reserva-tu-campo` — the flagship case study.

2. **Leftover dev instruction on the photography page.** The intro panel says
   "*…drag your exports onto a slot to fill it*" in EN and ES
   (`src/i18n/strings.ts` → `photo_sub`). It's a note-to-self, visible to
   every visitor.

3. **Metadata contradicts the positioning.** `src/data/consts.ts` sets the
   site title to "Front-end developer (UI designer too)" and the description
   to "Leonardo Fonseca's Portfolio" — that's the browser tab, the Google
   result, and every social share. Related, in `src/app/metadata.tsx`:
   - Twitter card `title`/`description` are swapped relative to OpenGraph.
   - `applicationName` is set to the description.
   - `og:locale` is hardcoded `en_US` even on `/es` pages.
   - No page except the case studies sets its own `<title>` — home, work,
     photography and about all share the root title.

4. **The CV undercuts the story.** `public/cv/FrontEnd_Leonardo_Fonseca.pdf` —
   the filename alone re-positions as front-end before anyone opens it.
   Rename and reframe the content for the hybrid SA + builder positioning.

5. **Work-page counter breaks past 9 projects.** `WorkView` renders
   `0${idx + 1} / 0${n}` (`src/components/views/WorkView.tsx`), producing
   "010 / 031" when the Notion catalog goes live. The progress-dot row also
   doesn't scale. A landmine on the planned CMS path.

6. **The 404 page is off-brand.** `src/app/not-found.tsx` is unstyled default
   text, English-only, no nav, no theme.

7. **Fragile photo URLs.** The four 500px images are hardcoded signed CDN
   URLs (`src/data/portfolio.ts`, `photos`). If 500px rotates signatures the
   gallery silently breaks. Either re-host on Cloudinary like the project
   covers, or accept the risk knowingly.

Noted, not defects: the 6 lint findings are documented and deliberate
(CLAUDE.md), and the Notion fetch path has never run over a real network —
the first preview deploy with the env vars set is the actual transport test.

## 2. Content gap — what "SA-worthy" needs

The evidence chain today: hero claims Solutions Architect → stats claim 15
years / 40+ projects → the proof on offer is a bootcamp booking app, a
tutorial-scale store, a movie app, and a drag-and-drop widget. All four case
studies are well written and honestly framed — but they demonstrate *builder*
craft, not architecture. Nothing shows scoping, trade-off decisions,
estimation, integration design, or cross-team delivery.

What to add:

- **1–2 anonymized RebelMouse delivery case studies.** The strongest possible
  content, and it doesn't exist yet. The Lakeville Journal & Millerton News
  donation workflows are already publicly named in the experience section, so
  they can be expanded. Structure differently from the build projects: the
  problem shape, the constraints, the options weighed, what was scoped in vs
  out and why, the outcome. "How I turned an ambiguous client request into a
  costed, shipped solution" is exactly what the title claims.

- **A case study on this portfolio's own architecture.** The material already
  exists: a content pipeline with Notion CMS behind a stable type contract, a
  static fallback that keeps the site deployable when the API is down,
  hreflang alternates that refuse to advertise untranslated locales, a
  generated sitemap that can't drift. The reasoning in `docs/CMS.md` and the
  code comments is architectural thinking that's currently invisible to
  visitors — and it's the one SA artifact showable with full transparency,
  code included.

- **Fix the numbers story.** The home page says "40+ projects delivered" two
  tiles from a work link that says "4 projects". Until the curated Notion set
  lands, that reads as inflation — one of the two numbers has to move.
  Related: `stats` in `portfolio.ts` is exported but never used; `HomeView`
  hardcodes the numbers and silently drops the third (EN/ES) stat.

- **Reconsider the certifications section.** "Software Engineering
  Fundamentals" and "REST APIs with JavaScript" read early-career and anchor
  the level downward. Drop them rather than let them undercut a senior title;
  keep the LXD Summit if it has talk/leadership context.

- **Add metrics to case outcomes.** Good process narration, soft endings.
  Even modest concrete numbers (team size, timeline, users, before/after)
  separate "I built this" from "this worked".

- **Spanish case bodies.** The fallback note is honest and well implemented,
  but the flagship cases should eventually exist in both languages. The four
  complete Notion entries already have EN and ES bodies, so this resolves
  itself when the CMS switches on.

## 3. UX recommendations

- **Rework the work page for featured + archive.** One full-viewport pane per
  project is immersive at 4 items and exhausting at 10+, with no overview.
  Keep the carousel for the featured set; add a compact grid/list for the
  full archive. This also naturally fixes the counter and dots problems.

- **Link the featured home card straight to the case study.** It goes to
  `/work?case=<id>` when a real page exists at `/work/<id>` — one hop
  shorter, and a stronger internal link to the best content.

- **Scope the arrow-key handlers.** `WorkView` and `PhotoView` listen on
  `window`, hijacking arrow keys page-wide; the carousels also have no ARIA
  structure (no `role`, no live region announcing the current slide).

- **Respect reduced motion consistently.** `HomeView` and `PhotoView` check
  `prefers-reduced-motion`; `WorkView`'s scroll animation and meta tween
  don't.

- **Contact is mailto-only.** `mailto:` fails silently without a configured
  mail client. Add a simple form endpoint or a scheduling link alongside.

- **Style the 404** — bilingual, with nav, matching the design.

## 4. Suggested order

1. The three content defects (placeholder, photo copy, metadata/title) —
   under an hour, and the only things actively broken.
2. Rename/reframe the CV.
3. Write the portfolio-architecture case study, then the anonymized
   RebelMouse one(s) — this is the actual SA gap.
4. Rework the work page for featured + archive before flipping the Notion
   switch (fix the counter/dots as part of it).
5. Fill the curated Notion entries, turn the CMS on in a preview deploy
   (watch the build log for `Notion project query failed`), then promote.
