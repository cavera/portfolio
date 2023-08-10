import { mapElementsData } from '@/data/mapData'
import { SectionTitle } from '../SectionTitle'
import ProjectsList from '../ProjectsList'
import { MoreLink } from './MoreLink'

import styles from './projects.module.scss'

async function Projects(props: any) {
	const { filtered } = props
	const mappedData = await mapElementsData()
	const filteredData = filtered ? mappedData.slice(0, 5) : mappedData
	return (
		<section className={styles.projects_container}>
			<SectionTitle>Projects</SectionTitle>

			<ProjectsList filteredData={filteredData} />
			<MoreLink filtered={filtered} />
		</section>
	)
}

export default Projects
