import { AboutView } from '@/components/views/AboutView'
import { CAVERA, TITLES } from '@/data/consts'
import { getExperience, getProfile } from '@/data/source'

export const metadata = {
	title: `${CAVERA.name}: ${TITLES.ABOUT}`,
}

export default async function AboutPage() {
	const [experience, profile] = await Promise.all([getExperience(), getProfile()])

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
