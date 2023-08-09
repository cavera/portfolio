import { mapElementsData } from '@/data/mapData'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from '../SectionTitle'
import Link from 'next/link'
import { TProject } from '@/types/Types'

import styles from './projects.module.scss'

async function Projects(props: any) {
	const { filtered } = props
	const mappedData = await mapElementsData()
	const filteredData = filtered ? mappedData.slice(0, 5) : mappedData
	return (
		<section>
			<SectionTitle>Projects</SectionTitle>
			<div className={styles.projects}>
				{filteredData.map((project: TProject) => (
					<ProjectCard
						project={project}
						key={project.id}
					/>
				))}
				{filtered && <Link href='/portfolio'>More projects...</Link>}
			</div>
		</section>
	)
}

export default Projects
