# Ponytail Audit — Over-Engineering Scan

**Date:** 2026-07-19
**Scope:** Repo-wide scan for dead code, duplicate config, unused dependencies, and speculative abstractions. Correctness, security, and performance are explicitly out of scope — see a normal code review for those.
**Verdict:** Not over-engineered architecturally (no needless abstraction layers, no single-implementation interfaces, no factories for one product). The findings below are dead weight left over from before/during the redesign, not design problems.

Ranked biggest cut first.

---

1. **`delete:`** Unused Notion CMS module (0 imports anywhere in `src`) plus its mock fallback data. Nothing replaces it — it's inert until a CMS decision is made (deferred per the redesign plan).
   Replacement: nothing today; pull back from git history when Notion (or another CMS) is actually wired up.
   Files: `src/data/notion.ts` (92 lines), `src/data/mocks/mockList.json` (6731 lines), `src/data/mocks/mockCard.json` (110 lines), `src/data/mocks/mockCardContent.json` (51 lines)

2. **`delete:`** Legacy `.eslintrc.json` duplicates `eslint.config.mjs` — both just `extends: next/core-web-vitals`. ESLint 9 / Next 16 reads the flat config; the legacy file is dead weight.
   Replacement: keep `eslint.config.mjs` only.
   File: `.eslintrc.json`

3. **`delete:`** Six favicon-generator leftovers never referenced by `metadata.tsx` — no `manifest` link, no browserconfig link, no tile/pinned-tab entries anywhere in the codebase.
   Replacement: nothing (regenerate later if PWA/Windows-tile support is ever wanted).
   Files: `public/site.webmanifest`, `public/browserconfig.xml`, `public/mstile-150x150.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png`, `public/safari-pinned-tab.svg`

4. **`delete:`** Orphaned image, zero references anywhere in `src` or `public`.
   File: `public/images/default_bg.jpg`

5. **`delete:`** Empty leftover directory from an earlier audit session, untracked by git.
   Path: `audit_baselines/`

6. **`delete:`** `.gitignore` lists `pnpm-lock.yaml` as ignored, but it's tracked and committed in git history — the rule contradicts the repo's actual state.
   File: `.gitignore` (the `pnpm-lock.yaml` line under the `# pnpm` section)

---

## What's already lean (no action needed)

- `LangProvider` / `ThemeProvider` — single-implementation React contexts sized to exactly what they do, no factory/generic abstraction layer.
- `src/data/consts.ts` — every exported field has exactly one consumer after the redesign trim.
- 4 view components (`HomeView`, `WorkView`, `PhotoView`, `AboutView`) — each has exactly one route consumer.
- `iconoir-react` — already removed during the redesign; no residue.

## Net

`-6987 lines, -0 deps possible` (plus ~72K of orphaned binary assets in `public/`, no `package.json` changes required).

---

*Findings only — nothing applied. Run `/ponytail:ponytail-audit` again after any cleanup to verify.*
