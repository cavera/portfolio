import Link from 'next/link'

import styles from './Menu.module.scss'

export const Menu = () => {
	return (
		<nav className={styles.nav}>
			<ul>
				<li>
					<Link href='/about'>About</Link>
				</li>
				<li>
					<Link href='/portfolio'>Portfolio</Link>
				</li>
				<li>
					<Link href='/contact'>Contact</Link>
				</li>
			</ul>
		</nav>
	)
}
