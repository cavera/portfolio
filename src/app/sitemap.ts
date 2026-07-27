import type { MetadataRoute } from 'next'
import { CAVERA } from '@/data/consts'
import { getProjects } from '@/data/source'
import { defaultLocale, localePath, locales } from '@/i18n/routing'

/**
 * Replaces the old hand-written `public/sitemap.xml`, which had gone stale:
 * it still listed `/portfolio` and `/contact` (both removed in the redesign)
 * and knew nothing about `/work` or `/photography`. A generated sitemap cannot
 * drift from the routes that actually exist.
 *
 * Includes every case study that exists, in every locale that genuinely has it.
 * A project falling back to English is listed under the default locale only —
 * listing a Spanish URL that serves English is worse than listing nothing.
 */
const SECTIONS = [
	{ path: '', priority: 1.0 },
	{ path: '/work', priority: 0.9 },
	{ path: '/photography', priority: 0.8 },
	{ path: '/about', priority: 0.8 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = CAVERA.portfolio.url.replace(/\/$/, '')
	const lastModified = new Date()

	const entry = (path: string, priority: number, available: readonly string[]) => ({
		url: `${base}${localePath(available[0] as never, path)}`,
		lastModified,
		changeFrequency: 'weekly' as const,
		priority,
		alternates: {
			languages: {
				...Object.fromEntries(available.map((l) => [l, `${base}/${l}${path}`])),
				'x-default': `${base}${localePath(defaultLocale, path)}`,
			},
		},
	})

	const sections = SECTIONS.flatMap(({ path, priority }) =>
		locales.map((lang) => ({
			...entry(path, priority, locales),
			url: `${base}${localePath(lang, path)}`,
		}))
	)

	const byLocale = await Promise.all(
		locales.map(async (lang) => {
			const projects = await getProjects(lang)
			return projects
				.filter((p) => p.hasCase)
				.filter((p) => lang === defaultLocale || p.translated)
				.map((p) => {
					const path = `/work/${p.id}`
					const available = p.translated ? locales : [defaultLocale]
					return { ...entry(path, 0.7, available), url: `${base}${localePath(lang, path)}` }
				})
		})
	)

	return [...sections, ...byLocale.flat()]
}
