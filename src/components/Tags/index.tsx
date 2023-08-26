import { TProject } from '@/types/Types'
import styles from './Tags.module.scss'

const Tags = ({ skills }: { skills: TProject['skills'] }) => {
	// console.log(skills)
	return (
		<article className={styles.tags_container}>
			{skills?.map((skill, index) => (
				<Tag
					key={index}
					skill={skill}
				/>
			))}
		</article>
	)
}

const Tag = ({ skill }: { skill: string }) => {
	return (
		<p className={`${styles.tag} ${styles[skill.toLowerCase().replaceAll(' ', '_')]}`}>
			<span>{skill}</span>
		</p>
	)
}

export default Tags
