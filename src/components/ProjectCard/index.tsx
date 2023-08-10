import { TProject } from '@/types/Types'

import styles from './ProjectCard.module.scss'
import Tags from '../Tags'
import Link from 'next/link'
import Image from 'next/image'
import CTAs from '../CTAs'

export function ProjectCard({ project }: { project: TProject }) {
	const { cover, title, subtitle, live_link, source, skills, id } = project

	return (
		<article className={styles.card}>
			<Image
				src={`${cover}`}
				alt={''}
				width={300}
				height={300}
				priority={true}
			/>
			<div className={styles.project_info}>
				<h1>{title}</h1>
				<h2>{subtitle}</h2>
				<Tags skills={skills} />
			</div>
			<Link
				href={`/portfolio/${id}`}
				className={styles.card_link}>
				+
			</Link>
			<div className={styles.project_cta}>
				<CTAs
					source={source}
					live_link={live_link}
				/>
			</div>
		</article>
	)
}
