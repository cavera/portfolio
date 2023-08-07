'use client'

import Link from 'next/link'
import { User, ReportColumns, PeaceHand } from 'iconoir-react'

import styles from './Menu.module.scss'

export const Menu = () => {
	return (
		<nav className={styles.nav}>
			<ul>
				<li>
					<Link
						href='/about'
						// activeClassName={styles.active}
						className={styles.nav_link}>
						<User />
						About
					</Link>
				</li>
				<li>
					<Link
						href='/portfolio'
						// activeClassName={styles.active}
						className={styles.nav_link}>
						<ReportColumns />
						Portfolio
					</Link>
				</li>
				<li>
					<Link
						href='/contact'
						// activeClassName={styles.active}
						className={styles.nav_link}>
						<PeaceHand />
						Contact
					</Link>
				</li>
			</ul>
		</nav>
	)
}
