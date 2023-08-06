import React from 'react'
import SocialBar from '../SocialBar'
import styles from './Footer.module.scss'
import { Menu } from '../TopBar/Menu'

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<span className={styles.footer_info}>cavera 2023</span>

			<div className={styles.social}>
				<SocialBar size={24} />
			</div>

			<div className={styles.menu}>
				<Menu />
			</div>
		</footer>
	)
}
