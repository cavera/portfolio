import { mapElementsData } from '@/data/mapData'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from '../SectionTitle'
import Link from 'next/link'
import { TProject } from '@/types/Types'

import styles from './projects.module.scss'

async function Projects() {
	const mappedData = await mapElementsData()
	return (
		<>
			<SectionTitle>Projects</SectionTitle>
			<div className={styles.projects}>
				{mappedData.map((project: TProject) => (
					<ProjectCard
						project={project}
						key={project.id}
					/>
				))}
			</div>
		</>
	)
}

export default Projects
