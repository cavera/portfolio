---
name: Cavera Portfolio
description: Deep-green night studio with a pale-mint paper twin, one mint accent, mono labels.
colors:
  studio-night: "#071813"
  surface: "#0f1a17"
  surface-raised: "#13201c"
  surface-high: "#17261f"
  ink: "#e5f0ed"
  soft: "#8fa39d"
  faint: "#7d8f89"
  mint: "#2bd4a1"
  mint-ink: "#042017"
  mint-hover: "#4fe8ba"
  paper-mint: "#f1f9f7"
  paper-surface: "#f0faf7"
  paper-ink: "#101916"
  paper-soft: "#4f5f5a"
  paper-faint: "#5a6c66"
  paper-mint-deep: "#00775a"
  paper-mint-ink: "#f1fffb"
  paper-mint-hover: "#1a614d"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(52px, 9vw, 148px)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(46px, 7vw, 104px)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(28px, 5vw, 46px)"
    fontWeight: 600
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    letterSpacing: "0.14em"
rounded:
  xs: "2px"
  sm: "6px"
  md: "9px"
  lg: "14px"
  tile: "18px"
  nav-btn: "8px"
  pill: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "26px"
  nav-h: "64px"
components:
  button-fill:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-fill-hover:
    backgroundColor: "{colors.mint-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  tag:
    textColor: "{colors.soft}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "26px"
---

# Design System: Cavera Portfolio

## Overview

**Creative North Star: "The Night Studio"**

A dark, green-tinted workspace where the work is the lit object. Surfaces are near-black forest tones separated by hairlines, not shadows; a single mint accent marks what is live, active or clickable. The light theme is the same studio with the lights on: pale mint paper, same structure, same accent role.

Type does the personality. Space Grotesk sets tight, heavy display lines; JetBrains Mono carries every label, button and tag, so the interface reads like annotations on the work. The shell is a single fixed viewport under a 64px glass nav; views fill it rather than scroll as a page.

**Key Characteristics:**
- One accent (mint), used for state and action, never as a surface wash.
- Hairline borders and tonal steps instead of shadows at rest.
- Mono uppercase labels; grotesk display with negative tracking.
- Quietly tactile: 1–3px lifts, fades, an accent underline that grows.
- Dark and light themes are co-equal; every token has a pair.

## Colors

Deep forest neutrals with a single electric mint. Light theme keeps the hue family, swapping to pale mint paper and a deeper accent for contrast.

### Primary
- **Electric Mint** (`colors.mint`): fills, active nav underline, theme-aware highlights, the pulsing "now" dot. Light theme uses **Paper Mint Deep** (`colors.paper-mint-deep`) with hover to **Paper Mint Hover**.

### Neutral
- **Studio Night** (`colors.studio-night`): page background. Light: **Paper Mint** (`colors.paper-mint`).
- **Surface / Raised / High** (`colors.surface`, `surface-raised`, `surface-high`): three tonal steps for tiles, active nav pills and wells.
- **Ink / Soft / Faint** (`colors.ink`, `soft`, `faint`): primary text, secondary text and labels, tertiary hints. Light: **Paper Ink**, **Paper Soft**.
- **Over-photo colours:** `--ov-ink`, `--ov-acc`, `--ov-scrim` are fixed in both themes (the scrim is always dark); use them for text on images.
- **Hairlines:** `rgba(255,255,255,.085)` default, `.17` stronger (light: ink at .10 / .22).

### Named Rules
**The One Voice Rule.** Mint appears only on state and action: fills, hovers, active markers, the accent word in a headline. It never floods a surface.

**The Twin Theme Rule.** Every colour token has a dark and a light value. Never hard-code a hex in a view; use the variable.

## Typography

**Display / Body Font:** Space Grotesk (system-ui fallback)
**Label / Mono Font:** JetBrains Mono (monospace fallback)

**Character:** Geometric grotesk with a technical, slightly quirky voice, set tight at size; mono supplies the documentary, annotated feel.

### Hierarchy
- **Display** (700, `clamp(52px, 9vw, 148px)`, 0.92, -0.045em): home name block. Last word or line may take the accent.
- **Headline** (600, `clamp(46px, 7vw, 104px)`, 0.94, -0.035em): section intros such as photography.
- **Title** (600, `clamp(28px, 5vw, 46px)`): page and case titles.
- **Body** (400, 14–16px): copy, nav links. Control and caption steps in use: 12.5, 13, 15px.
- **Label** (mono, 11.5px, 0.14em, uppercase, `soft`): `.lab` eyebrow on every view. Buttons and tags are also mono (12.5–14px, 11px).

### Named Rules
**The Mono Controls Rule.** Buttons, tags, lang toggle and eyebrows are mono. Prose and headlines are never mono.

## Layout

Single-viewport shell: fixed 64px nav, then a fixed, clipped view region that fills the rest. Content sits in a `wrap` container capped at 1320px. Headings scale with `clamp()` using vw (and vh on short heroes) so the composition holds from phone to wide desktop. Main breakpoints at 760px (nav tightens, nav CTA hides), 820px and 920px (grids collapse). Print resets the shell to static so the CV paginates.

## Elevation & Depth

Flat by default. Depth is tonal (three surface steps) plus hairline borders. Shadow appears only as a response: a tile hovered lifts 3px and gains `0 20px 48px rgba(0,0,0,.38)`. The nav is the one glass element (82% tinted bg, 16px blur, bottom hairline).

### Named Rules
**The Flat-By-Default Rule.** No shadow at rest. If something needs to feel raised, step the surface tone first.

## Shapes

Soft rectangles with a clear size ladder: 2px focus ring corners, 6px tags, 8–9px buttons and toggles (8px for nav controls), 10–14px inner cards, 18px tiles. Circles (50%) for the go-arrow, the now-dot and avatar-like marks. One hairline border style; no thick borders.

## Components

Precise and quietly tactile: small lifts, mint fills, mono type in controls.

### Buttons
- **Shape:** 9px radius, 12px 20px padding, mono 14px / 500.
- **Fill:** mint bg, `mint-ink` text; hover brightens to `mint-hover` and lifts 1px.
- **Ghost:** transparent, 1px strong hairline; hover turns border and text mint.
- **Small:** 9px 15px, 12.5px.

### Tags
- 11px mono, 6px radius, 1px strong hairline, `soft` text. Hover flips to mint fill.

### Tiles
- 18px radius, `surface` bg, 1px hairline, 26px padding. Linked tiles lift 3px on hover with border strengthening and a round "go" arrow that fills mint and rotates -45°.

### Navigation
- Fixed 64px glass bar. Mono wordmark with mint accent letter. Links 14px `soft`; interactive nav controls are 44px tall; active link gets `surface-raised` pill and a mint underline that grows on hover. Language toggle is a segmented pair of anchors; the active one is mint-filled. Theme button is a 34px outlined square.

### Focus
- 2px mint outline, 2px offset on every link and button.

### Now indicator
- 7px mint dot with a soft pulsing ring (2.6s).

## Do's and Don'ts

### Do:
- **Do** use the CSS variables from `src/styles/globals.scss`; build both themes.
- **Do** keep mint for state and action only.
- **Do** put labels, buttons and tags in JetBrains Mono.
- **Do** respect `prefers-reduced-motion` on every new transition or animation.
- **Do** keep hover lifts to 1–3px and 0.15–0.2s.

### Don't:
- **Don't** add shadows at rest or coloured glows beyond the nav blur and tile hover.
- **Don't** introduce a second accent colour.
- **Don't** use gradient text or decorative side-stripe borders.
- **Don't** hard-code hex values in views; use tokens.
- **Don't** swap to `next/image`; the owner declined it.
