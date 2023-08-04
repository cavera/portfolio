import styles from './Logo.module.scss'

export const Logo = () => {
	return (
		<div className={styles.logo_container}>
			<p className={`${styles.logo_name} ${styles.to_hide}`}>Leonardo</p>

			<p>
				<span className={`${styles.logo_name} ${styles.to_hide}`}>Fonse</span>
				<strong className={styles.logo_text}>ca</strong>
				<strong className={`${styles.logo_text} ${styles.hidden}`}>vera</strong>
			</p>

			<p>
				<span className={`${styles.logo_name} ${styles.to_hide}`}>Ri</span>
				<strong className={`${styles.logo_text} ${styles.to_hide}`}>vera</strong>
			</p>
		</div>
	)
}
