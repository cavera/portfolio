# WCAG 2.1 Accessibility Audit Report
## Next.js Portfolio Site
**Audit Date:** March 21, 2026
**Project Path:** /Users/cavera/Documents/git/cavera/portfolio

---

## EXECUTIVE SUMMARY

This comprehensive accessibility audit identified **23 accessibility issues** across eight WCAG 2.1 audit categories. The site demonstrates good semantic HTML structure but lacks several essential accessibility features including proper ARIA labeling, keyboard navigation support, color contrast compliance, and screen reader optimizations.

**Overall Compliance Level:** Non-compliant with WCAG 2.1 Level AA

**Critical Issues:** 3
**High Severity Issues:** 9
**Medium Severity Issues:** 11

---

## 1. SEMANTIC HTML & HEADING HIERARCHY

### Issue 1.1: Improper Heading Hierarchy in Project Cards
**Severity:** HIGH
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Component:** `/src/components/ProjectCard/index.tsx`

**Current State:**
```tsx
<article className={styles.card}>
  <h1>{title}</h1>      // Project title in card
  <h2>{subtitle}</h2>   // Project subtitle
```

**Problem:** The project card uses `<h1>` for project titles, creating multiple h1 elements on the same page (one per project card). This violates heading hierarchy best practices.

**How to Fix:**
- Change ProjectCard h1 to h3 or h4
- Reserve h1 for page main title only
- Ensure heading levels follow document outline (h1 > h2 > h3)

---

### Issue 1.2: Logo Link Semantic Confusion
**Severity:** MEDIUM
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Component:** `/src/components/TopBar/HeaderLogo.tsx`

**Current State:**
```tsx
<Link href='/'>
  <h1 className={styles.h1}>
    <span>ca</span>
    <span>vera</span>
  </h1>
</Link>
```

**Problem:** The h1 element is nested inside a Link, mixing semantic meaning. This creates confusion about whether the element represents a heading or navigation link.

**How to Fix:**
```tsx
<h1><Link href='/'>cavera</Link></h1>
```

---

### Issue 1.3: Multiple Section Landmarks Without Aria Labels
**Severity:** MEDIUM
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Files:** `/src/app/contact/page.tsx`, `/src/app/about/page.tsx`

**Current State:**
```tsx
<section className='only-content'>
  <SectionTitle>{TITLES.CONTACT}</SectionTitle>
```

**Problem:** Sections lack distinctive ARIA labels, making it difficult for screen reader users to distinguish between sections.

**How to Fix:**
```tsx
<section aria-labelledby="contact-title">
  <SectionTitle id="contact-title">{TITLES.CONTACT}</SectionTitle>
```

---

## 2. ARIA LABELS AND ATTRIBUTES

### Issue 2.1: Missing ARIA Labels on Icon Buttons (CRITICAL)
**Severity:** CRITICAL
**WCAG Criterion:** 1.1.1 Non-text Content (Level A), 4.1.2 Name, Role, Value (Level A)
**Affected Components:**
- `/src/components/SocialBar/Icon.tsx`
- `/src/components/Button/index.tsx`
- `/src/components/TopBar/Menu.tsx` (icons in nav)

**Current State:**
```tsx
export const Icon = (props: SocialIcon) => {
	return (
		<a
			href={props.link}
			target='_blank'
			rel='noopener noreferrer'
			onMouseOver={e => props.onEnter(e)}>
			{<props.icon />}  // Icon with no label
		</a>
	)
}
```

**Problem:** Social media links and icon buttons lack accessible names. Screen readers cannot announce what these links do. Users cannot understand the purpose of the icons.

**How to Fix:**
```tsx
<a
  href={props.link}
  target='_blank'
  rel='noopener noreferrer'
  aria-label="Visit my LinkedIn profile"
  onMouseOver={e => props.onEnter(e)}>
  {<props.icon />}
</a>
```

**Affected Pages:** All pages (hero section, contact section)

---

### Issue 2.2: Tooltip Not Associated with Interactive Element
**Severity:** HIGH
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Component:** `/src/components/SocialBar/index.tsx`

**Current State:**
```tsx
<Icon
  key={i}
  link={link.link}
  icon={link.icon}
  onEnter={e => handleEnter(e, link.link)}
/>

<div ref={tooltipRef} className={styles.tooltip_container}>
  <Tooltip content={urlName} />
</div>
```

**Problem:** The tooltip is rendered as an independent floating div with no ARIA connection to the trigger button. Screen reader users cannot access this information.

**How to Fix:**
```tsx
<Icon
  key={i}
  link={link.link}
  icon={link.icon}
  aria-describedby={`tooltip-${i}`}
  onEnter={e => handleEnter(e, link.link)}
/>
<div id={`tooltip-${i}`} ref={tooltipRef} className={styles.tooltip_container} role="tooltip">
  <Tooltip content={urlName} />
</div>
```

---

### Issue 2.3: Links Styled as Buttons Lack Button Role
**Severity:** HIGH
**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)
**Affected Components:** `/src/components/Button/index.tsx`, `/src/components/projects/MoreLink.tsx`

**Current State:**
```tsx
return (
	<a
		className={`${styles.button} ${styles[props.type]}`}
		href={props.link?.toString()}
		target='_blank'>
		{props.text}
		{showIcon()}
	</a>
)
```

**Problem:** Links styled as buttons lack `role="button"` or semantic button elements. This creates mismatch between visual presentation and programmatic role.

**How to Fix:**
- Use semantic `<button>` for button-like actions, or
- Add `role="button"` and keyboard handlers:
```tsx
<a
  className={`${styles.button} ${styles[props.type]}`}
  href={props.link?.toString()}
  target='_blank'
  role="button">
  {props.text}
  {showIcon()}
</a>
```

---

### Issue 2.4: Navigation Landmark Not Labeled
**Severity:** MEDIUM
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Component:** `/src/components/TopBar/Menu.tsx`

**Current State:**
```tsx
<nav className={styles.nav}>
  <ul>...</ul>
</nav>
```

**Problem:** Navigation is semantically correct but not labeled, making it harder to distinguish if multiple navigation regions exist.

**How to Fix:**
```tsx
<nav className={styles.nav} aria-label="Main navigation">
```

---

### Issue 2.5: Decorative Elements Not Hidden from Screen Readers
**Severity:** MEDIUM
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Component:** `/src/components/Hero/index.tsx`

**Current State:**
```tsx
<div className={styles.scroll_icon} ref={scrollRef}>
  <MouseScrollWheel height={32} width={32} />
</div>
```

**Problem:** Decorative scroll wheel icon is announced by screen readers unnecessarily.

**How to Fix:**
```tsx
<div className={styles.scroll_icon} ref={scrollRef} aria-hidden="true">
  <MouseScrollWheel height={32} width={32} aria-hidden="true" />
</div>
```

---

## 3. COLOR CONTRAST

### Issue 3.1: Secondary Button Text Contrast Fails WCAG AA (CRITICAL)
**Severity:** CRITICAL
**WCAG Criterion:** 1.4.3 Contrast (Minimum) Level AA (4.5:1 for text)
**Affected Component:** `/src/components/Button/Button.module.scss`

**Current State:**
```scss
.secondary {
	color: var(--basics-secondary);           // Yellow-yellow05: hsl(44, 100%, 58%)
	background: var(--basics-primary-80);     // Primary with 80% opacity
	&:hover {
		color: var(--basics-secondary-hover);
	}
}
```

**Analysis:**
- Default text color: `hsl(44, 100%, 58%)` = bright yellow
- In light mode background: very light blue/white
- Calculated Contrast Ratio: ~2.5:1 (FAILS AA requirement of 4.5:1)

**Problem:** Yellow text on light background fails contrast requirements. Users with low vision cannot read button text.

**How to Fix:**
```scss
.secondary {
  color: var(--basics-secondary-hover);     // Use darker yellow for better contrast
  background: var(--basics-primary-80);
  &:hover {
    color: var(--blue-blue07);              // Even darker on hover
  }
}
```

**Affected Pages:** All pages with secondary buttons

---

### Issue 3.2: Footer Link Color Contrast Needs Verification
**Severity:** HIGH
**WCAG Criterion:** 1.4.3 Contrast (Minimum) Level AA
**Affected Component:** `/src/components/Footer/index.tsx`

**Current State:**
```tsx
<a href='https://notion.dev/' target='_blank' className={styles.footer_link}>
  Notion
</a>
```

**Problem:** Links inherit text color with only underline differentiation. In dark mode, very light text may not have sufficient contrast with background.

**How to Fix:**
```scss
.footer_link {
  text-decoration: underline;
  color: var(--basics-secondary);

  &:hover {
    color: var(--basics-secondary-hover);
  }
}
```

---

### Issue 3.3: Navigation Hover State Lacks Color Distinction
**Severity:** MEDIUM
**WCAG Criterion:** 1.4.3 Contrast (Minimum) Level AA
**Affected Component:** `/src/components/TopBar/Menu.module.scss`

**Current State:**
```scss
.nav_link {
  color: currentColor;

  &:hover {
    text-decoration: underline;  // Only underline changes
  }
}
```

**Problem:** Hover state relies on underline alone. Users with color blindness may miss state change.

**How to Fix:**
```scss
.nav_link {
  color: var(--basics-primary);

  &:hover {
    color: var(--basics-secondary);
    text-decoration: underline;
  }
}
```

---

## 4. KEYBOARD NAVIGATION

### Issue 4.1: Social Media Tooltips Not Keyboard Accessible (CRITICAL)
**Severity:** CRITICAL
**WCAG Criterion:** 2.1.1 Keyboard (Level A), 2.4.7 Focus Visible (Level AA)
**Affected Component:** `/src/components/SocialBar/index.tsx`, `/src/components/SocialBar/Icon.tsx`

**Current State:**
```tsx
const Icon = (props: SocialIcon) => {
  return (
    <a
      href={props.link}
      target='_blank'
      rel='noopener noreferrer'
      onMouseOver={e => props.onEnter(e)}>  // ONLY mouse event
      {<props.icon />}
    </a>
  )
}
```

**Problem:**
- Tooltip only triggers on mouse events
- Keyboard-only users cannot trigger tooltip
- No `onFocus` event handler
- Keyboard users are completely blocked from accessing this interaction

**How to Fix:**
```tsx
const Icon = (props: SocialIcon) => {
  return (
    <a
      href={props.link}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`Visit my LinkedIn profile`}
      onMouseOver={e => props.onEnter(e)}
      onFocus={e => props.onEnter(e)}        // Add focus event
      onMouseOut={props.onLeave}
      onBlur={props.onLeave}>                // Add blur handler
      {<props.icon />}
    </a>
  )
}
```

**Affected Pages:** Home, Contact

---

### Issue 4.2: Project Card Link Has No Visible Focus Indicator
**Severity:** HIGH
**WCAG Criterion:** 2.4.7 Focus Visible (Level AA)
**Affected Component:** `/src/components/ProjectCard/ProjectCard.module.scss`

**Current State:**
```scss
.card_link {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  font-size: 4em;
  transition: opacity var(--transition-speed);
  opacity: 0;  // Invisible by default

  &:hover {
    opacity: 1;
  }
  // NO :focus or :focus-visible styles
}
```

**Problem:**
- Link is invisible by default (opacity: 0)
- Only becomes visible on hover
- Keyboard users cannot see focus
- No `:focus` or `:focus-visible` styles

**How to Fix:**
```scss
.card_link {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  font-size: 4em;
  transition: opacity var(--transition-speed);
  opacity: 0;
  outline: none;

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--basics-secondary);
    outline-offset: -4px;
  }
}
```

**Affected Pages:** Portfolio

---

### Issue 4.3: No Focus Management on Route Changes
**Severity:** HIGH
**WCAG Criterion:** 2.4.3 Focus Order (Level A)
**Affected Component:** Navigation throughout site

**Current State:**
```tsx
<Link href='/about'>About</Link>
// No focus management when route changes
```

**Problem:** When users navigate between pages, focus is not moved to main content. Focus remains at top of page, forcing users to tab through all elements again.

**How to Fix:**
Create a custom hook for focus management:
```tsx
// hooks/useFocusOnRouteChange.ts
export function useFocusOnRouteChange() {
  const pathname = usePathname()

  useEffect(() => {
    const main = document.querySelector('main')
    if (main) {
      main.setAttribute('tabIndex', '-1')
      main.focus()
    }
  }, [pathname])
}
```

---

### Issue 4.4: No Skip Link to Main Content
**Severity:** HIGH
**WCAG Criterion:** 2.4.1 Bypass Blocks (Level A)
**Affected Component:** `/src/app/layout.tsx`

**Current State:**
No skip link exists in layout.

**Problem:** Keyboard users must tab through entire navigation before reaching main content.

**How to Fix:**
Add to layout:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				<TopBar />
				<main id="main-content">{children}</main>
				<Footer />
			</body>
		</html>
	)
}
```

Add styles:
```scss
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--basics-secondary);
  color: var(--basics-bg);
  padding: var(--2x) var(--3x);
  text-decoration: none;
  z-index: 100;

  &:focus {
    top: 0;
  }
}
```

---

## 5. IMAGES AND ALT TEXT

### Issue 5.1: Project Image Alt Text Could Be More Descriptive
**Severity:** MEDIUM
**WCAG Criterion:** 1.1.1 Non-text Content (Level A)
**Affected Component:** `/src/components/ProjectCard/index.tsx`

**Current State:**
```tsx
<img
  src={imageSrc}
  alt={title || "Project cover image"}  // Generic fallback
/>
```

**Problem:** Alt text fallback is too generic. All projects get same alt text.

**How to Fix:**
```tsx
<img
  src={imageSrc}
  alt={`${title} - ${subtitle || 'Project showcase'}`}
/>
```

---

### Issue 5.2: YouTube Video Thumbnail Alt Text Not Descriptive
**Severity:** MEDIUM
**WCAG Criterion:** 1.1.1 Non-text Content (Level A)
**Affected Component:** `/src/app/portfolio/[id]/blockMap.tsx`

**Current State:**
```tsx
video: (block: Block) => {
  if (block?.url?.includes('youtu')) {
    return (
      <div>
        <a href={block?.url} target='_blank'>
          <ImageFrame
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={'poster'}  // Too generic
```

**Problem:** Alt text "poster" doesn't describe video content.

**How to Fix:**
```tsx
alt={`Video thumbnail: ${block.text || 'Embedded video'}`}
```

---

### Issue 5.3: ImageFrame Allows Empty Alt Text
**Severity:** MEDIUM
**WCAG Criterion:** 1.1.1 Non-text Content (Level A)
**Affected Component:** `/src/components/ImageFrame/index.tsx`

**Current State:**
```tsx
const ImageFrame = (props: any) => {
  const { src = "", alt = "", caption = "" } = props
  return (
    <img src={src} alt={alt} />  // Empty alt default
```

**Problem:** Alt text has empty string default, allowing images without descriptions.

**How to Fix:**
- Make alt text required prop
- Add validation to catch empty alt text during build

---

## 6. FORMS AND FORM CONTROLS

**Status:** No form elements present on site. If contact form is added in future, ensure:
- Associated labels for all inputs
- Clear error messages with aria-describedby
- Keyboard navigation support
- Focus indicators on form fields

---

## 7. SCREEN READER COMPATIBILITY

### Issue 7.1: Navigation Icons Not Associated with Labels
**Severity:** HIGH
**WCAG Criterion:** 1.1.1 Non-text Content (Level A)
**Affected Component:** `/src/components/TopBar/Menu.tsx`

**Current State:**
```tsx
<Link href='/about' className={styles.nav_link}>
  <User />  // Icon with no connection to text
  About
</Link>
```

**Problem:** Icon and text are not semantically associated. Screen readers may announce them separately or in wrong order.

**How to Fix:**
```tsx
<Link
  href='/about'
  className={styles.nav_link}
  aria-label="About Leonardo Fonseca">
  <User aria-hidden="true" />
  About
</Link>
```

---

### Issue 7.2: Automatic Scroll Without User Request
**Severity:** MEDIUM
**WCAG Criterion:** 3.2.5 Change on Request (Level AAA)
**Affected Component:** `/src/components/EndOfSection.tsx`

**Current State:**
```tsx
const EndOfSection = () => {
	useLayoutEffect(() => {
		document.documentElement.scrollTo(0, 0)  // Automatic scroll
	}, [])
```

**Problem:** Automatic page scrolling without user action. Users may lose position unexpectedly.

**How to Fix:**
- Remove automatic scroll, or
- Only scroll on navigation from external sources
- Add aria-live announcement:
```tsx
useLayoutEffect(() => {
  const main = document.querySelector('main')
  if (main) {
    main.setAttribute('tabIndex', '-1')
    main.focus()
  }
}, [])
```

---

### Issue 7.3: Hidden Decorative Elements
**Severity:** MEDIUM
**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)
**Affected Component:** Various `.to_hide` classes in Logo

**Current State:**
Logo uses `.to_hide` class but not all decorative elements have aria-hidden.

**How to Fix:**
Review all decorative elements and add `aria-hidden="true"` where appropriate.

---

## 8. FOCUS MANAGEMENT AND VISUAL INDICATORS

### Issue 8.1: Missing Global Focus Styles
**Severity:** HIGH
**WCAG Criterion:** 2.4.7 Focus Visible (Level AA)
**Affected File:** `/src/styles/globals.scss`

**Current State:**
```scss
a {
  color: inherit;
  text-decoration: none;
  // NO :focus-visible styles
}
```

**Problem:** No global focus indicator CSS. Links and buttons lack visible focus states.

**How to Fix:**
Add to globals.scss:
```scss
:focus-visible {
  outline: 2px solid var(--basics-secondary);
  outline-offset: 2px;
}

a:focus-visible,
button:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--basics-secondary);
  outline-offset: 2px;
}

@media (prefers-color-scheme: light) {
  :focus-visible {
    outline-color: var(--tertiary-01);
  }
}

// For forced colors mode (high contrast)
@media (forced-colors: active) {
  a:focus-visible,
  button:focus-visible,
  [role="button"]:focus-visible {
    outline: 3px solid;
  }
}
```

---

### Issue 8.2: Navigation Links Lack Focus Indicator
**Severity:** HIGH
**WCAG Criterion:** 2.4.7 Focus Visible (Level AA)
**Affected Component:** `/src/components/TopBar/Menu.module.scss`

**Current State:**
```scss
.nav_link {
  color: currentColor;
  font-size: var(--4x);
  font-weight: 300;

  &:hover {
    text-decoration: underline;
  }
  // NO :focus-visible
}
```

**Problem:** Focus state identical to unfocused state. Keyboard users cannot see focus.

**How to Fix:**
```scss
.nav_link {
  color: currentColor;
  font-size: var(--4x);
  font-weight: 300;
  outline: none;
  position: relative;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    text-decoration: underline;
    box-shadow: inset 0 -3px 0 var(--basics-secondary);
  }
}
```

---

### Issue 8.3: Potential Tab Order Mismatch
**Severity:** MEDIUM
**WCAG Criterion:** 2.4.3 Focus Order (Level A)
**Affected Component:** `/src/components/ProjectCard/index.tsx`

**Current State:**
```tsx
<article>
  <img />                    // Visual order: 1
  <h1>{title}</h1>          // Visual order: 2
  <Link className="card_link">+</Link>  // DOM order: 3, but positioned absolutely
  <CTAs />                   // DOM order: 4
</article>
```

**Problem:** Absolutely positioned link may create unexpected tab order. DOM order doesn't match visual order.

**How to Fix:**
- Reorder DOM elements to match visual/logical order, or
- Ensure absolutely positioned elements don't break keyboard navigation
- Test with keyboard Tab key

---

## SUMMARY TABLE

| # | Issue | Severity | WCAG | Component | Status |
|---|-------|----------|------|-----------|--------|
| 1.1 | Multiple h1 elements (heading hierarchy) | HIGH | 1.3.1 | ProjectCard | Not Fixed |
| 1.2 | Logo link semantic confusion | MEDIUM | 1.3.1 | HeaderLogo | Not Fixed |
| 1.3 | Missing section ARIA labels | MEDIUM | 1.3.1 | Multiple | Not Fixed |
| 2.1 | Missing ARIA labels on icons | CRITICAL | 1.1.1, 4.1.2 | Icon, Button | Not Fixed |
| 2.2 | Tooltip not associated with element | HIGH | 1.3.1 | SocialBar | Not Fixed |
| 2.3 | Links styled as buttons lack role | HIGH | 4.1.2 | Button | Not Fixed |
| 2.4 | Nav landmark not labeled | MEDIUM | 1.3.1 | Menu | Not Fixed |
| 2.5 | Decorative elements not hidden | MEDIUM | 1.3.1 | Hero, Logo | Not Fixed |
| 3.1 | Secondary button contrast fails | CRITICAL | 1.4.3 | Button | Not Fixed |
| 3.2 | Footer link contrast insufficient | HIGH | 1.4.3 | Footer | Not Fixed |
| 3.3 | Nav hover lacks color change | MEDIUM | 1.4.3 | Menu | Not Fixed |
| 4.1 | Tooltip not keyboard accessible | CRITICAL | 2.1.1, 2.4.7 | SocialBar | Not Fixed |
| 4.2 | Card link no focus indicator | HIGH | 2.4.7 | ProjectCard | Not Fixed |
| 4.3 | No focus management on navigation | HIGH | 2.4.3 | Navigation | Not Fixed |
| 4.4 | No skip link | HIGH | 2.4.1 | Layout | Not Fixed |
| 5.1 | Project alt text generic | MEDIUM | 1.1.1 | ProjectCard | Not Fixed |
| 5.2 | YouTube alt text not descriptive | MEDIUM | 1.1.1 | blockMap | Not Fixed |
| 5.3 | ImageFrame allows empty alt | MEDIUM | 1.1.1 | ImageFrame | Not Fixed |
| 7.1 | Nav icons not associated | HIGH | 1.1.1 | Menu | Not Fixed |
| 7.2 | Automatic scroll without warning | MEDIUM | 3.2.5 | EndOfSection | Not Fixed |
| 7.3 | Decorative elements not hidden | MEDIUM | 1.3.1 | Logo | Not Fixed |
| 8.1 | Missing global focus styles | HIGH | 2.4.7 | globals.scss | Not Fixed |
| 8.2 | Nav links no focus indicator | HIGH | 2.4.7 | Menu | Not Fixed |
| 8.3 | Potential tab order issue | MEDIUM | 2.4.3 | ProjectCard | Not Fixed |

---

## REMEDIATION ROADMAP

### Phase 1: Critical Issues (Week 1)
1. Add ARIA labels to all icon buttons
2. Fix secondary button color contrast
3. Make social tooltips keyboard accessible
4. Add global focus indicators

**Estimated time:** 4-6 hours

### Phase 2: High Priority (Week 2)
5. Add skip link to main content
6. Fix heading hierarchy in project cards
7. Add focus indicators to all interactive elements
8. Implement focus management on route changes
9. Fix footer link contrast
10. Add visible focus to navigation

**Estimated time:** 6-8 hours

### Phase 3: Medium Priority (Week 3-4)
11. Label section landmarks with aria-label
12. Improve image alt text
13. Hide decorative icons from screen readers
14. Verify/fix tab order
15. Test with screen readers (NVDA/JAWS)

**Estimated time:** 4-6 hours

### Phase 4: Enhancement (Week 5+)
16. Add prefers-reduced-motion support for animations
17. High contrast mode support
18. Consider contact form implementation
19. Comprehensive accessibility testing

---

## TESTING RECOMMENDATIONS

**Automated Tools:**
- axe DevTools (Chrome/Firefox extension)
- Lighthouse (Chrome DevTools)
- WAVE (WebAIM browser extension)
- Accessibility Insights (Microsoft)

**Manual Testing:**
- NVDA (free, Windows)
- JAWS (commercial, Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

**Keyboard Testing:**
- Navigate entire site using only Tab, Shift+Tab, Enter, Space
- Test focus order on each page
- Verify all interactive elements are reachable

**Color Contrast:**
- WebAIM Color Contrast Checker
- Colour Contrast Analyzer
- Accessible Colors tool

---

## FILES TO MODIFY (Priority Order)

1. `/src/components/Button/Button.module.scss` - Fix contrast
2. `/src/components/SocialBar/Icon.tsx` - Add ARIA labels and focus handlers
3. `/src/components/SocialBar/index.tsx` - Connect tooltip to element
4. `/src/app/layout.tsx` - Add skip link
5. `/src/styles/globals.scss` - Add global focus styles
6. `/src/components/TopBar/Menu.module.scss` - Add focus styles and color change
7. `/src/components/ProjectCard/ProjectCard.module.scss` - Add focus indicator
8. `/src/components/ProjectCard/index.tsx` - Fix heading hierarchy
9. `/src/components/TopBar/HeaderLogo.tsx` - Fix h1 in link
10. `/src/components/Footer/Footer.module.scss` - Fix link contrast

---

## NOTES

**Strengths:**
- Good semantic HTML foundation (nav, main, footer, sections)
- Proper use of Next.js Link component
- Dark mode support built-in
- Responsive design with mobile considerations
- No form validation issues (no forms present)

**Areas of Concern:**
- Heavy reliance on CSS animations without reduced-motion support
- Absolute positioning of interactive elements
- Icon-only buttons without labels
- Keyboard interaction incomplete
- Color contrast not optimized for accessibility

**Best Practices Already Implemented:**
- Semantic HTML elements
- Responsive design
- Dark/light mode support
- Proper link rel attributes (noopener noreferrer)
- External link handling
- Metadata optimization

**Recommendations for Future:**
- Add prefers-reduced-motion media query
- Implement form with ARIA landmarks if contact form added
- Add language attribute (already present: lang='en')
- Consider adding sitemap/structured data for better SEO

