import Projects from '@/components/projects'
import styles from './Portfolio.module.scss'

function Portfolio() {
	return (
		// <section className={styles.portfolio}>
		<Projects filtered={false} />
		// </section>
	)
}

export default Portfolio
