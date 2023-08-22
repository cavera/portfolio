import React from 'react'
import SocialBar from '../SocialBar'
import styles from './Footer.module.scss'

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<article className={styles.footer_info}>
				<p>cavera 2023</p>
				<p className={styles.made_with}>Made with Next.js, TypeScript and GSAP</p>
			</article>

			<div className={styles.social}>
				<SocialBar size={24} />
			</div>
		</footer>
	)
}
