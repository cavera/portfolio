import { ProjectCard } from '../ProjectCard'
import { TProject } from '@/types/Types'

import styles from './ProjectsList.module.scss'
import { MoreLink } from '../projects/MoreLink'
const ProjectsList = ({ filteredData, filtered = false }: { filteredData: TProject[]; filtered: boolean }) => {
	return (
		<>
			<div className={styles.projects}>
				{filteredData.map((project: TProject) => (
					<ProjectCard
						project={project}
						key={project.id}
					/>
				))}
			</div>
			<MoreLink filtered={filtered} />
			<div className='scroll-end'></div>
		</>
	)
}

export default ProjectsList
