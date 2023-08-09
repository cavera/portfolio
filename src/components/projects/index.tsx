import { TProject } from '@/types/Types'
import { mapElementsData } from '@/data/mapData'
import { ProjectCard } from '../ProjectCard'
import { SectionTitle } from '../SectionTitle'
import Link from 'next/link'

import styles from './projects.module.scss'

async function Projects(props: any) {
	const { filtered } = props
	const mappedData = await mapElementsData()
	const filteredData = filtered ? mappedData.slice(0, 5) : mappedData
	return (
		<section className={styles.projects_container}>
			<SectionTitle>Projects</SectionTitle>
			<div className={styles.projects}>
				{filteredData.map((project: TProject) => (
					<ProjectCard
						project={project}
						key={project.id}
					/>
				))}
			</div>
			{filtered && (
				<div className={styles.more}>
					<Link
						href='/portfolio'
						className={styles.more_link}>
						More projects...
					</Link>
				</div>
			)}
		</section>
	)
}

export default Projects
