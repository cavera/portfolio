import styles from './Logo.module.scss'

export const Logo = () => {
	return (
		<p className={styles.logo_container}>
			<span>
				<span className={styles.logo_name}>Leonardo Fonse</span>
				<span className={styles.logo_text}>ca</span>
			</span>
			<br className={styles.br} />
			<span>
				<span className={styles.logo_name2}>Ri</span>
				<span className={styles.logo_text}>vera</span>
			</span>
		</p>
	)
}
