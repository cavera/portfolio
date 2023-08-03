import Link from 'next/link'
import styles from './TopBar.module.scss'

export const HeaderLogo = () => {
	return (
		<div className={styles.header_logo}>
			<Link href='/'>
				<h1 className={styles.h1}>
					<span>cave</span>
					<span>ra</span>
				</h1>
			</Link>
			<h2 className={styles.h2}>
				<Role>UI designer</Role> {' (also'} <Also>Front-end</Also>
				{')'}
			</h2>
		</div>
	)
}

const Role = ({ children }: { children: string }) => {
	return <span className='role-main'>{children}</span>
}
const Also = ({ children }: { children: string }) => {
	return <span className='role-also'>{children}</span>
}
