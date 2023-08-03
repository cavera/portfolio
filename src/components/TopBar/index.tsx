import { HeaderLogo } from './HeaderLogo'
import { Menu } from './Menu'

import styles from './TopBar.module.scss'

export const TopBar = () => {
	return (
		<header className={styles.header}>
			<HeaderLogo />
			<Menu />
		</header>
	)
}
