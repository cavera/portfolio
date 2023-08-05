import React from 'react'
import SocialBar from '../SocialBar'
import styles from './Footer.module.scss'

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<span>cavera 2023</span>

			<SocialBar size={24} />
		</footer>
	)
}
