import { TProject } from '@/types/Types'
import Button from '../Button'

import styles from './projects.module.scss'
import Tags from '../Tags'
import Link from 'next/link'

export function ProjectCard({ project }: { project: TProject }) {
	const { cover, title, subtitle, live_link, source, skills, id } = project

	return (
		<article className={styles.card}>
			<Link
				href={`/portfolio/${id}`}
				className={styles.link}></Link>
			<img
				src={cover}
				alt={''}
			/>
			<div className={styles.project_info}>
				<h1>{title}</h1>
				<h2>{subtitle}</h2>
				<Tags skills={skills} />
			</div>
			<div className={styles.project_cta}>
				{source && (
					<Button
						type='secondary'
						link={source}
					/>
				)}
				{live_link && (
					<Button
						type='primary'
						text='Live'
						link={live_link}
					/>
				)}
			</div>
		</article>
	)
}
