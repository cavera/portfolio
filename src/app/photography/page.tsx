import { PhotoView } from '@/components/views/PhotoView'
import { getPhotos, getProfile } from '@/data/source'

export default async function PhotographyPage() {
	const [photos, profile] = await Promise.all([getPhotos(), getProfile()])

	return (
		<PhotoView
			photos={photos}
			photoProfile={profile.photoProfile}
		/>
	)
}
