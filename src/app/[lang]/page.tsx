import type { Metadata } from 'next'
import { HomeView } from '@/components/views/HomeView'
import { CAVERA } from '@/data/consts'
import { getPhotos, getProfile, getProjects } from '@/data/source'
import { alternates } from '@/i18n/routing'
import { strings } from '@/i18n/strings'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return {
		title: CAVERA.portfolio.name,
		description: strings[lang].offer,
		alternates: alternates(lang),
	}
}

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
	const { lang } = await params
	const [projects, photos, profile] = await Promise.all([getProjects(lang), getPhotos(), getProfile()])

	return (
		<HomeView
			projects={projects}
			photos={photos}
			skills={profile.skills}
			email={profile.email}
		/>
	)
}
