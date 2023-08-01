export function ProjectCard({ project }) {
	return (
		<article className='card'>
			<div className='project-info'>
				<h1>{project.name}</h1>
				<h2>{project.subtitle}</h2>
			</div>
			<img
				src={project.cover}
				alt={''}
			/>
			<a href={project.source}>Source</a>
			<a href={project.live_link}>Live</a>
		</article>
	)
}
