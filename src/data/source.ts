import { aboutPortrait, certs, email, experience, photoProfile, photos, projects, skills, socials } from '@/data/portfolio'
import { getBlocks, notionConfigured, queryProjects, type NotionPage } from '@/data/notion/client'
import { mapCase, mapProject, sortOrder, translationOf } from '@/data/notion/mapper'
import { defaultLocale } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'
import type { Experience, Photo, Project, SocialLink } from '@/types/project'

/**
 * The single place the app asks for content.
 *
 * Backed by Notion when NOTION_TOKEN and NOTION_DATABASE_ID are both set,
 * and by the hand-authored `portfolio.ts` otherwise. The static path is not a
 * stopgap: it keeps local dev and preview builds working without secrets, and
 * keeps the site deployable when the Notion API is down.
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
}

// ---- static path ------------------------------------------------------

function staticProjects(lang: Lang): Project[] {
	return projects.map((p) => ({
		id: p.id,
		title: p.title,
		img: p.img,
		kind: p.kind[lang],
		desc: p.desc[lang],
		tags: p.tags,
		year: p.year,
		live: p.live,
		code: p.code,
		hasCase: p.hasCase,
		role: p.role[lang],
		stack: p.stack,
		case: p.case && {
			context: p.case.context[lang],
			role: p.case.role[lang],
			process: p.case.process.map((s) => s[lang]),
			outcome: p.case.outcome[lang],
		},
		// The authored file carries real prose in both languages, so static
		// content is genuinely translated in either locale.
		translated: true,
		lang,
	}))
}

// ---- Notion path ------------------------------------------------------

async function withCase(page: NotionPage, project: Project): Promise<Project> {
	if (!project.hasCase) return project
	try {
		return { ...project, case: mapCase(await getBlocks(page.id)) }
	} catch (error) {
		// One unreadable body must not take down the whole listing.
		console.error(`Notion: could not read case body for "${project.title}"`, error)
		return { ...project, hasCase: false }
	}
}

async function notionProjects(lang: Lang): Promise<Project[]> {
	const base = await queryProjects(defaultLocale)

	// Non-default locales resolve per project: a real translation when one
	// exists, otherwise the default-locale page marked `translated: false` so
	// callers know not to advertise an hreflang alternate for it.
	let translations = new Map<string, NotionPage>()
	if (lang !== defaultLocale) {
		const localized = await queryProjects(lang)
		translations = new Map(localized.flatMap((page) => translationOf(page).map((id) => [id.replace(/-/g, ''), page])))
	}

	const mapped = await Promise.all(
		base.map(async (page) => {
			const translation = translations.get(page.id.replace(/-/g, ''))
			const source = translation ?? page
			const project = mapProject(source, lang, Boolean(translation))
			return { project: await withCase(source, project), order: sortOrder(page) }
		})
	)

	// Explicit sort_order first, then whatever order Notion returned (newest
	// first). Entries without an order sink below those that have one.
	return mapped
		.map((m, i) => ({ ...m, i }))
		.sort((a, b) => {
			if (a.order !== null && b.order !== null) return a.order - b.order
			if (a.order !== null) return -1
			if (b.order !== null) return 1
			return a.i - b.i
		})
		.map((m) => m.project)
}

// ---- public API -------------------------------------------------------

export async function getProjects(lang: Lang = defaultLocale): Promise<Project[]> {
	if (!notionConfigured) return staticProjects(lang)

	try {
		const fromNotion = await notionProjects(lang)
		if (fromNotion.length) return fromNotion
		console.warn('Notion returned no published projects; falling back to static content.')
	} catch (error) {
		console.error('Notion project query failed; falling back to static content.', error)
	}
	return staticProjects(lang)
}

export async function getProject(id: string, lang: Lang = defaultLocale): Promise<Project | null> {
	return (await getProjects(lang)).find((p) => p.id === id) ?? null
}

export async function getPhotos(): Promise<Photo[]> {
	return photos
}

export async function getExperience(lang: Lang = defaultLocale): Promise<Experience[]> {
	return experience.map((e) => ({ when: e.when, role: e.role, co: e.co, summary: e[lang], badge: e.badge }))
}

export async function getProfile(): Promise<SiteProfile> {
	return { email, photoProfile, aboutPortrait, socials, skills, certs }
}
