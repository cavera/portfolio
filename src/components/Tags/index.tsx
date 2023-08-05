import { TProject } from '@/types/Types'
import styles from '../projects/projects.module.scss'

const Tags = ({ skills }: { skills: TProject['skills'] }) => {
	return (
		<div className={styles.tags_container}>
			{skills?.map((skill, index) => (
				<span
					key={index}
					className={`${styles.tag} ${styles[skill.toLowerCase()]}`}>
					{skill}
				</span>
			))}
		</div>
	)
}

export default Tags
