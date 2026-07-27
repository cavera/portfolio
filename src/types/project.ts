import type { Lang } from '@/i18n/strings'

/**
 * Two layers of type here, on purpose.
 *
 * `Authored*` is how content is written by hand in `portfolio.ts` — both
 * languages side by side, because one file holding both is easier to edit than
 * two parallel files.
 *
 * `Project` / `Experience` are what a view receives: already resolved to one
 * language. Notion (shape 2 in `docs/CMS.md`) stores one page per language, so
 * its mapper produces these directly; the static path resolves the authored
 * form down to the same shape. Views never index by language.
 */

export interface LocalizedString {
	en: string
	es: string
}

export interface CaseStudy {
	context: string
	role: string
	process: string[]
	outcome: string
}

export interface Project {
	id: string
	title: string
	img: string
	kind: string
	desc: string
	tags: string[]
	year: string
	live?: string
	code?: string
	hasCase: boolean
	role: string
	stack: string[]
	case?: CaseStudy
	/**
	 * False when this locale has no real translation and the content shown is a
	 * fallback from the default locale. Drives whether an `hreflang` alternate
	 * gets advertised — never claim a Spanish URL for English text.
	 */
	translated: boolean
	lang: Lang
}

export interface Experience {
	when: string
	role: string
	co: string
	summary: string
	badge?: string
}

export interface Photo {
	id: string
	aspect: string
	title: string
	link: string
	src: string
}

export interface SocialLink {
	name: string
	url: string
}

// ---- authored (bilingual) forms, used by src/data/portfolio.ts ----

export interface AuthoredCaseStudy {
	context: LocalizedString
	role: LocalizedString
	process: LocalizedString[]
	outcome: LocalizedString
}

export interface AuthoredProject {
	id: string
	title: string
	img: string
	kind: LocalizedString
	desc: LocalizedString
	tags: string[]
	year: string
	live?: string
	code?: string
	hasCase: boolean
	role: LocalizedString
	stack: string[]
	case?: AuthoredCaseStudy
}

export interface AuthoredExperience {
	when: string
	role: string
	co: string
	en: string
	es: string
	badge?: string
}
