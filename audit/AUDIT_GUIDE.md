# Portfolio Audit Guide

Complete guide for running comprehensive audits on the portfolio site.

---

## Quick Start

### Run Full Audit
```bash
./audit-site-comprehensive.sh
```

### Run Quick Audit (Skip Screenshots)
```bash
./audit-site-comprehensive.sh --skip-screenshots
```

### Run Quick Mode (5 minutes instead of 30)
```bash
./audit-site-comprehensive.sh --quick
```

---

## What Gets Audited

### 1. Performance & Build
- Bundle size and chunk analysis
- Image optimization opportunities
- JavaScript and CSS code splitting
- Dependency analysis
- Runtime performance issues
- Build time metrics

**Tools Used:** Next.js build analysis, manual code review

### 2. Accessibility (WCAG 2.1)
- Semantic HTML structure
- ARIA labels and attributes
- Color contrast ratios (AA/AAA)
- Keyboard navigation and focus
- Screen reader compatibility
- Form accessibility
- Alt text on images

**Standards:** WCAG 2.1 Level AA/AAA

### 3. SEO
- Meta tags (title, description)
- Open Graph and Twitter cards
- Structured data / JSON-LD
- Heading hierarchy
- Mobile responsiveness
- robots.txt and sitemap
- Canonical URLs
- Internal linking
- Core Web Vitals signals

**Standards:** Google Search Console, Lighthouse

### 4. Code Quality
- TypeScript strict mode compliance
- Unused imports and variables
- ESLint configuration and rules
- Code duplication
- Security vulnerabilities (OWASP Top 10)
- Dependency vulnerabilities
- Component organization
- Error handling patterns

**Standards:** TypeScript strict, ESLint recommended

---

## Understanding the Report

### Severity Levels

- **CRITICAL** - Must fix immediately (security, breaking functionality)
- **HIGH** - Fix in current sprint (affects user experience)
- **MEDIUM** - Schedule for next sprint (technical debt, performance)
- **LOW** - Nice to have (code style, consistency)

### Report Structure

```
AUDIT_RESULTS_YYYYMMDD_HHMMSS.md
├── Summary
├── Key Metrics
├── Critical Issues
├── High Priority Items
├── Recommendations
├── Files Modified
└── Next Steps
```

---

## Audit Results Location

After running the audit:

```
audit_reports/
├── performance_YYYYMMDD_HHMMSS.txt
├── accessibility_YYYYMMDD_HHMMSS.txt
├── seo_quality_YYYYMMDD_HHMMSS.txt
└── ...

audit_baselines/
├── SCREENSHOTS_YYYYMMDD_HHMMSS.txt
└── ...

AUDIT_RESULTS_YYYYMMDD_HHMMSS.md
```

---

## Manual Audit Checklist

For issues that require manual review:

### Accessibility Testing
- [ ] Keyboard navigation: Tab through entire site
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color contrast check with browser tools
- [ ] Focus indicator visibility
- [ ] Form label associations
- [ ] Image alt text relevance

### Performance Testing
- [ ] Lighthouse score (Target: 90+)
- [ ] Core Web Vitals check in DevTools
- [ ] Mobile performance on slow 4G
- [ ] Animation smoothness at 60fps
- [ ] Bundle size with `npm run build`

### SEO Testing
- [ ] Google Search Console submission
- [ ] Mobile-Friendly Test
- [ ] Schema.org validation
- [ ] Open Graph preview (Facebook, LinkedIn, Twitter)
- [ ] Heading hierarchy validation

### Code Quality
- [ ] Run `npm run lint`
- [ ] Review TypeScript errors: `npx tsc --noEmit`
- [ ] Check security with npm audit
- [ ] Code review for OWASP issues

---

## Integration with CI/CD

To run audits automatically on each commit:

### GitHub Actions Example
```yaml
name: Audit on Push

on:
  push:
    branches: [main, develop]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: ./audit-site-comprehensive.sh --skip-screenshots
      - name: Upload audit results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: audit-reports
          path: audit_reports/
```

---

## Common Issues & Solutions

### Issue: Build fails during audit
**Solution:** Run `npm install` and check `.env.local` exists with proper values

### Issue: Dev server won't start
**Solution:** Kill any existing Node processes: `pkill -f "node.*dev"`

### Issue: Screenshots not captured
**Solution:** Install Playwright: `npm install -D @playwright/test`

### Issue: Missing NOTION_TOKEN warning
**Solution:** This is expected in development. Token should be set in production environment.

---

## Comparing Audit Results

To compare audits over time:

```bash
# Run current audit
./audit-site-comprehensive.sh

# Review changes
cat AUDIT_RESULTS_YYYYMMDD_*.md

# Compare with previous
diff <(cat AUDIT_RESULTS_YYYYMMDD_old.md) <(cat AUDIT_RESULTS_YYYYMMDD_new.md)
```

---

## Fixing Issues

### Based on Audit Reports

1. **Performance Issues**
   - See `audit_reports/performance_*.txt`
   - Implement code splitting, image optimization
   - Profile runtime performance

2. **Accessibility Issues**
   - See `audit_reports/accessibility_*.txt`
   - Add ARIA labels, fix contrast, test keyboard
   - Run WCAG 2.1 validation

3. **SEO Issues**
   - See `audit_reports/seo_quality_*.txt`
   - Add schema markup, complete metadata
   - Submit updated sitemap to Search Console

4. **Code Quality Issues**
   - See `audit_reports/seo_quality_*.txt`
   - Fix TypeScript strict issues
   - Remove unused code, improve error handling

---

## Audit Schedule

Recommended frequency:

- **Weekly:** During active development
- **Monthly:** Stable production site
- **After Major Changes:** New features, dependency updates
- **Before Production:** Before deploying to main

---

## Tools & Resources

### Browser Tools
- Lighthouse (Chrome DevTools)
- axe DevTools (Accessibility)
- WAVE (Accessibility)
- Lighthouse CI (Automated)

### Online Tools
- Google PageSpeed Insights
- Google Mobile-Friendly Test
- Schema.org Validator
- Meta Tags Debugger (Facebook, LinkedIn, Twitter)

### NPM Tools
- `npm audit` - Security vulnerabilities
- `npm ls` - Dependency tree
- `next/telemetry` - Build analytics

---

## Support

For detailed findings from the last audit, see:
- `CLAUDE.md` - Complete audit report with context
- Individual audit report files in `audit_reports/`
- Git history for tracking changes

---

## Questions?

Refer to:
1. Last audit report: `CLAUDE.md`
2. Individual findings in `audit_reports/`
3. WebAIM for accessibility: https://webaim.org/
4. Next.js docs for performance: https://nextjs.org/docs
5. Google Search Central for SEO: https://developers.google.com/search
