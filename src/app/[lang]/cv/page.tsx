import type { Metadata } from 'next'
import { CVView } from '@/components/views/CVView'
import { CAVERA } from '@/data/consts'
import { getExperience, getProfile } from '@/data/source'
import { alternates } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return {
		title: `${CAVERA.name} — CV`,
		alternates: alternates(lang, '/cv'),
	}
}

export default async function CVPage({ params }: { params: Promise<{ lang: Lang }> }) {
	const { lang } = await params
	const [experience, profile] = await Promise.all([getExperience(lang), getProfile()])

	return (
		<CVView
			experience={experience}
			skills={profile.skills}
			certs={profile.certs}
			socials={profile.socials}
			email={profile.email}
		/>
	)
}
