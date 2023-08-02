export interface IProjects {
	TProjects?: TProject[]
}

export interface TProject {
	cover?: string
	name?: string
	subtitle?: string
	source?: null | string
	live_link?: null | string
	skills?: string[]
	id?: string
}
