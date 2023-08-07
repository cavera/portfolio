import { TProject } from '@/types/Types'
import Button from '../Button'

import styles from './projects.module.scss'
import Tags from '../Tags'
import Link from 'next/link'
import Image from 'next/image'

export function ProjectCard({ project }: { project: TProject }) {
	const { cover, title, subtitle, live_link, source, skills, id } = project

	return (
		<article className={styles.card}>
			<Link
				href={`/portfolio/${id}`}
				className={styles.link}></Link>
			<Image
				src={`${cover}`}
				alt={''}
				width={300}
				height={300}
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
