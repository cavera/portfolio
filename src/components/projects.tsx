import { mapElementsData } from '@/data/mapData'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from './SectionTitle'
import { TProject } from '@/types/Types'

async function Projects() {
	const mappedData = await mapElementsData()
	return (
		<>
			<SectionTitle>Projects</SectionTitle>
			<div className='portfolio'>
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
