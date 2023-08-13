import { mapElementsData } from '@/data/mapData'
import { SectionTitle } from '../SectionTitle'
import ProjectsList from '../ProjectsList'
import { MoreLink } from './MoreLink'
import { TProject } from '@/types/Types'

import styles from './projects.module.scss'
async function Projects(props: any) {
	const { filtered } = props
	const mappedData = await mapElementsData()
	const filteredData = filtered ? mappedData.filter((item: TProject) => item.featured) : mappedData
	return (
		<section className={styles.projects_container}>
			<SectionTitle>Projects</SectionTitle>

			<ProjectsList filteredData={filteredData} />
			<MoreLink filtered={filtered} />
		</section>
	)
}

export default Projects
