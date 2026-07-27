import type { Metadata } from 'next'
import { HomeView } from '@/components/views/HomeView'
import { getPhotos, getProfile, getProjects } from '@/data/source'
import { alternates } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return { alternates: alternates(lang) }
}

export default async function Home() {
	const [projects, photos, profile] = await Promise.all([getProjects(), getPhotos(), getProfile()])

	return (
		<HomeView
			projects={projects}
			photos={photos}
			skills={profile.skills}
			email={profile.email}
		/>
	)
}
