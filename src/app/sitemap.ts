import type { MetadataRoute } from 'next'
import { CAVERA } from '@/data/consts'
import { defaultLocale, localePath, locales } from '@/i18n/routing'

/**
 * Replaces the old hand-written `public/sitemap.xml`, which had gone stale:
 * it still listed `/portfolio` and `/contact` (both removed in the redesign)
 * and knew nothing about `/work` or `/photography`. A generated sitemap cannot
 * drift from the routes that actually exist.
 *
 * Sections only for now. Per-project URLs arrive with the Notion wiring, since
 * that is where the slugs live — see `docs/CMS.md`.
 */
const SECTIONS = [
	{ path: '', priority: 1.0 },
	{ path: '/work', priority: 0.9 },
	{ path: '/photography', priority: 0.8 },
	{ path: '/about', priority: 0.8 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
	const base = CAVERA.portfolio.url.replace(/\/$/, '')
	const lastModified = new Date()

	return SECTIONS.flatMap(({ path, priority }) =>
		locales.map((lang) => ({
			url: `${base}${localePath(lang, path)}`,
			lastModified,
			changeFrequency: 'weekly' as const,
			priority,
			alternates: {
				languages: {
					...Object.fromEntries(locales.map((l) => [l, `${base}${localePath(l, path)}`])),
					'x-default': `${base}${localePath(defaultLocale, path)}`,
				},
			},
		}))
	)
}
