import type { Metadata } from 'next'
import { PhotoView } from '@/components/views/PhotoView'
import { getPhotos, getProfile } from '@/data/source'
import { alternates } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return { alternates: alternates(lang, '/photography') }
}

export default async function PhotographyPage() {
	const [photos, profile] = await Promise.all([getPhotos(), getProfile()])

	return (
		<PhotoView
			photos={photos}
			photoProfile={profile.photoProfile}
		/>
	)
}
