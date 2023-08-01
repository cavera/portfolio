import { mapElementsData } from '@/data/mapData'
import { ProjectCard } from '../components/ProjectCard'

async function Portfolio() {
	const mappedData = await mapElementsData()
	return (
		<>
			<SectionTitle>Projects</SectionTitle>
			<div className='portfolio'>
				{mappedData.map((project: any) => (
					<ProjectCard
						project={project}
						key={project.id}
					/>
				))}
			</div>
		</>
	)
}

function SectionTitle({ children }: { children: any }) {
	return (
		<div className='section-title'>
			<h1>{children}</h1>
		</div>
	)
}

export default Portfolio
