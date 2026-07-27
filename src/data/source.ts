import { aboutPortrait, certs, email, experience, photoProfile, photos, projects, skills, socials } from '@/data/portfolio'
import type { Experience, Photo, Project, SocialLink } from '@/types/project'

/**
 * The single place the app asks for content.
 *
 * Everything here is async on purpose even though it currently returns static
 * data from `portfolio.ts`. That is the whole point of the module: when the
 * Notion CMS is wired up, only the bodies below change — no route, no view and
 * no prop type has to move. See `docs/CMS.md`.
 *
 * Import this from server components only. The views are client components and
 * receive the results as props.
 */

export interface SiteProfile {
	email: string
	photoProfile: string
	aboutPortrait: string
	socials: SocialLink[]
	skills: string[]
	certs: string[]
}

export async function getProjects(): Promise<Project[]> {
	return projects
}

export async function getProject(id: string): Promise<Project | null> {
	return projects.find((p) => p.id === id) ?? null
}

export async function getPhotos(): Promise<Photo[]> {
	return photos
}

export async function getExperience(): Promise<Experience[]> {
	return experience
}

export async function getProfile(): Promise<SiteProfile> {
	return { email, photoProfile, aboutPortrait, socials, skills, certs }
}
