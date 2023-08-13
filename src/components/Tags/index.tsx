import { TProject } from '@/types/Types'
import styles from './Tags.module.scss'

const Tags = ({ skills }: { skills: TProject['skills'] }) => {
	console.log(skills)
	return (
		<div className={styles.tags_container}>
			{skills?.map((skill, index) => (
				<span
					key={index}
					className={`${styles.tag} ${styles[skill.toLowerCase().replaceAll(' ', '_')]}`}>
					{skill}
				</span>
			))}
		</div>
	)
}

export default Tags
