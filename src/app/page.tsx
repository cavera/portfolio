import { HomeView } from '@/components/views/HomeView'
import { getPhotos, getProfile, getProjects } from '@/data/source'

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
