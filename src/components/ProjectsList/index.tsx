import { ProjectCard } from '../ProjectCard'
import { TProject } from '@/types/Types'

import styles from './ProjectsList.module.scss'

const ProjectsList = ({ filteredData }: { filteredData: TProject[] }) => {
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
			<div className='scroll-end'></div>
		</>
	)
}

export default ProjectsList
