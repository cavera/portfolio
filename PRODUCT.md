# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, one shared goal (they contact Leonardo):
- Hiring managers and recruiters evaluating Leonardo for senior design-engineering or solutions-architect roles.
- Freelance and agency clients evaluating Leonardo for project work (UI, e-learning, web builds).

## Product Purpose

Personal portfolio of Leonardo Fonseca (cavera). Shows selected work, case studies, experience, CV and photography, in English and Spanish. Success: a visitor understands what Leonardo does and gets in touch.

## Positioning

Designer, engineer and architect in one person: 15+ years spanning typographic and UI design, front-end engineering (React, Next.js, GSAP) and solutions architecture. A design-only or dev-only portfolio could not truthfully claim the full range.

## Operating Context

- Content is authored as files in `content/` and edited through Keystatic at `/keystatic`; GitHub-mode saves commit to `main` and rebuild production.
- Deployed on Vercel at `https://portfolio-cavera.vercel.app` (no custom domain).
- Every route is statically prerendered for `en` and `es`.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, SASS, GSAP. Views are client components that receive props; data flows only through `src/data/source.ts`.
- Routes: home, work (and per-project case pages), about, CV, photography.
- Bilingual EN/ES. A project is only advertised in Spanish (`hreflang`) when `translated` is true and real Spanish prose exists.
- Cover images always fall back to `DEFAULT_PROJECT_BG`.
- Owner declined `next/image`; images are external (Cloudinary) or self-hosted AVIF.
- Next is pinned to 16.3.8 (16.4.2 breaks `next/font/google` on Vercel).
- Light and dark themes exist, with a pre-paint script setting `data-theme`.

## Brand Commitments

Name: Leonardo Fonseca, handle "cavera". Photography under 500px/LeonardoFonseca is part of his identity. No visual commitments recorded here; the incumbent implementation is the design authority until a redesign is requested.

## Evidence on Hand

- ~30 projects in `content/projects/` (UI experiments, CrearMedia work, RebelMouse translations, an architecture case, and others).
- Experience timeline in `content/experience.yaml` (RebelMouse 2023–present; CrearMedia 2012–2023).
- Four photographs in `content/photos.yaml`.
- Socials: GitHub, Behance, LinkedIn, 500px. Certification: LXD LATAM Summit 2023.
- Not on hand: client testimonials, press, quantified outcomes beyond the profile stats. Do not fabricate them.

## Product Principles

1. Show range honestly: design, code and architecture are all first-class, none is decoration for the others.
2. Work leads; the interface recedes.
3. Both languages are real. Never fake a translation or advertise one that falls back.
4. Contact is the one conversion; keep it reachable from every page.
5. Content stays editable by the owner without a code change.

## Accessibility & Inclusion

WCAG AA target. Respect `prefers-reduced-motion` for GSAP animation. Keep light and dark themes both legible.
