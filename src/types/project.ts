export interface LocalizedString {
	en: string
	es: string
}

export interface CaseStudy {
	context: LocalizedString
	role: LocalizedString
	process: LocalizedString[]
	outcome: LocalizedString
}

export interface Project {
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
	case?: CaseStudy
}

export interface Photo {
	id: string
	aspect: string
	title: string
	link: string
	src: string
}

export interface Experience {
	when: string
	role: string
	co: string
	en: string
	es: string
	badge?: string
}

export interface SocialLink {
	name: string
	url: string
}
