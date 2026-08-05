import { reader } from '@/data/reader'
import { DEFAULT_PROJECT_BG } from '@/data/consts'
import { defaultLocale } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'
import type { Experience, Photo, Project, SocialLink } from '@/types/project'
import type { Node as MarkdocNode } from '@markdoc/markdoc'

/**
 * The single place the app asks for content. Reads straight from the
 * checked-out filesystem via Keystatic's reader — no network call, no
 * expiring URLs, nothing to fall back from.
 *
 * Import from server components only.
 */

export interface SiteProfile {
	email: string
	photoProfile: string
	aboutPortrait: string
	socials: SocialLink[]
	skills: string[]
	certs: string[]
	stats: { n: string; key: string; acc: boolean }[]
}

export async function getProjects(lang: Lang = defaultLocale): Promise<Project[]> {
	const all = await reader.collections.projects.all()

	const mapped = all
		.filter(({ entry }) => entry.public)
		.map(({ slug, entry }) => {
			// English is never itself a fallback; Spanish only claims a real
			// translation when the author has explicitly flipped `translated`.
			const useEs = lang === 'es' && entry.translated
			const localized = useEs ? entry.es : entry.en
			const translated = lang === defaultLocale ? true : entry.translated

			const project: Project = {
				id: slug,
				title: entry.title,
				img: entry.img || DEFAULT_PROJECT_BG,
				kind: localized.kind,
				desc: localized.desc,
				tags: [...entry.tags],
				year: entry.year === null ? '' : String(entry.year),
				live: entry.live ?? undefined,
				code: entry.code ?? undefined,
				hasCase: entry.hasCase,
				role: localized.role,
				stack: [...entry.stack],
				translated,
				lang,
			}
			return { project, sortOrder: entry.sortOrder }
		})

	// Explicit sortOrder first; entries without one sink below those that have one.
	return mapped
		.sort((a, b) => {
			if (a.sortOrder !== null && b.sortOrder !== null) return a.sortOrder - b.sortOrder
			if (a.sortOrder !== null) return -1
			if (b.sortOrder !== null) return 1
			return 0
		})
		.map((m) => m.project)
}

export async function getProject(id: string, lang: Lang = defaultLocale): Promise<Project | null> {
	return (await getProjects(lang)).find((p) => p.id === id) ?? null
}

/**
 * Case bodies are Markdoc nodes — class instances, not serializable to client
 * props — so they never enter `Project`. Fetched separately by the case page.
 */
export async function getCaseNode(id: string, lang: Lang = defaultLocale): Promise<MarkdocNode | null> {
	const entry = await reader.collections.projects.read(id)
	if (!entry) return null
	const useEs = lang === 'es' && entry.translated
	const { node } = useEs ? await entry.caseEs() : await entry.caseEn()
	return node
}

export async function getPhotos(): Promise<Photo[]> {
	const data = await reader.singletons.photos.read()
	return (data?.items ?? []).map((p, i) => ({
		id: `ph_${i}`,
		aspect: p.aspect,
		title: p.title,
		link: p.link ?? '',
		src: p.src ?? '',
	}))
}

export async function getExperience(lang: Lang = defaultLocale): Promise<Experience[]> {
	const data = await reader.singletons.experience.read()
	return (data?.items ?? []).map((e) => ({
		when: e.when,
		role: e.role,
		co: e.co,
		summary: lang === 'es' ? e.summaryEs : e.summaryEn,
		badge: e.badge || undefined,
	}))
}

export async function getProfile(): Promise<SiteProfile> {
	const data = await reader.singletons.profile.readOrThrow()
	return {
		email: data.email,
		photoProfile: data.photoProfile ?? '',
		aboutPortrait: data.aboutPortrait ?? '',
		socials: data.socials.map((s) => ({ name: s.name, url: s.url ?? '' })),
		skills: [...data.skills],
		certs: [...data.certs],
		stats: data.stats.map((s) => ({ n: s.n, key: s.key, acc: s.acc })),
	}
}
