import type { Lang } from '@/i18n/strings'

/**
 * What a view receives: already resolved to one language. Case bodies are
 * Markdoc nodes fetched separately via `getCaseNode` — they're class
 * instances, not serializable to client props, so they never live here.
 */
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
