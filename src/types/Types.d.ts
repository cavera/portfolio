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
}
