import React from 'react'
import SocialBar from '../SocialBar'
import styles from './Footer.module.scss'

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<span className={styles.footer_info}>cavera 2023</span>

			<div className={styles.social}>
				<SocialBar size={24} />
			</div>
		</footer>
	)
}
