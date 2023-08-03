import { TProject } from '@/types/Types'

import styles from './projects.module.scss'

export function ProjectCard({ project }: { project: TProject }) {
	return (
		<article className={styles.card}>
			<div className={styles.project_info}>
				<h1>{project.name}</h1>
				<h2>{project.subtitle}</h2>
			</div>
			<img
				src={project.cover}
				alt={''}
			/>
			<a href={`${project.source}`}>Source</a>
			<a href={`${project.live_link}`}>Live</a>
		</article>
	)
}
