export interface IProjects {
	TProjects?: TProject[]
}

export type TProject = {
	cover?: string
	title?: string
	subtitle?: string
	source?: null | string
	live_link?: null | string
	skills?: string[]
	id?: string
	featured?: boolean
}

export interface Block {
	type: string
	text?: string
	url?: string
	code?: string
	caption: string
}

export interface ParsedBlock {
	type: string
	text?: string
	url?: string
	caption?: string
}
