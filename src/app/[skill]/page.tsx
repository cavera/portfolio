import { SectionTitle } from '@/components/SectionTitle'

import EndOfSection from '@/components/EndOfSection'
import { CAVERA, TITLES } from '@/data/consts'
import { Metadata, ResolvingMetadata } from 'next'
import ProjectsList from '@/components/ProjectsList'
import { mapElementsData } from '@/data/mapData'
import { TProject } from '@/types/Types'

type IdMetadataProps = {
	params: { skill: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: IdMetadataProps): Promise<Metadata> {
	const skill = params.skill

	return {
		title: `${CAVERA.nick}: ${TITLES.PORTFOLIO} | ${skill}`,
		openGraph: {
			title: `${CAVERA.nick}: ${TITLES.PORTFOLIO} | ${skill}`,
			description: `${skill}`,
		},
	}
}

async function Page({ params }: { params: { skill: string } }) {
	const { skill } = params
	const filtered = false

	const mappedData = await mapElementsData()
	const filteredData = mappedData.filter((item: TProject) => item.skills?.includes(skill))

	return (
		<section className={''}>
			{/* cover */}
			<SectionTitle>{skill}</SectionTitle>
			<ProjectsList
				filtered={filtered}
				filteredData={filteredData}
			/>
			<EndOfSection />
		</section>
	)
}
export default Page
