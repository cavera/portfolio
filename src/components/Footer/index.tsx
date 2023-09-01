import React from 'react'
import styles from './Footer.module.scss'

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<article className={styles.footer_info}>
				<p>cavera 2023</p>
				<p className={styles.made_with}>
					Made with Next.js, TypeScript and GSAP. {'Uses '}
					{
						<a
							href='https://notion.dev/'
							target='_blank'
							className={styles.footer_link}>
							Notion
						</a>
					}
					{' as CMS.'}
				</p>
			</article>
		</footer>
	)
}
