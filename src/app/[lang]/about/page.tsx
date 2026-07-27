import type { Metadata } from 'next'
import { AboutView } from '@/components/views/AboutView'
import { CAVERA, TITLES } from '@/data/consts'
import { getExperience, getProfile } from '@/data/source'
import { alternates } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return {
		title: `${CAVERA.name}: ${TITLES.ABOUT}`,
		alternates: alternates(lang, '/about'),
	}
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Lang }> }) {
	const { lang } = await params
	const [experience, profile] = await Promise.all([getExperience(lang), getProfile()])

	return (
		<AboutView
			experience={experience}
			skills={profile.skills}
			certs={profile.certs}
			socials={profile.socials}
			email={profile.email}
			aboutPortrait={profile.aboutPortrait}
		/>
	)
}
