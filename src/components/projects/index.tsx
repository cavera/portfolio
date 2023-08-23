import { mapElementsData } from '@/data/mapData'
import { SectionTitle } from '../SectionTitle'
import ProjectsList from '../ProjectsList'
import { TProject } from '@/types/Types'
import { TITLES } from '@/data/consts'

import styles from './projects.module.scss'

async function Projects(props: any) {
	const { filtered } = props
	const mappedData = await mapElementsData()
	const filteredData = filtered ? mappedData.filter((item: TProject) => item.featured) : mappedData
	return (
		<section className={styles.projects_container}>
			<SectionTitle>{TITLES.PORTFOLIO}</SectionTitle>

			<ProjectsList
				filteredData={filteredData}
				filtered={filtered}
			/>
		</section>
	)
}

export default Projects
