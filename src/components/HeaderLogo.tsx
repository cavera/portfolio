import Link from 'next/link'

export const HeaderLogo = () => {
	return (
		<div className='header-logo'>
			<Link href='/'>
				<h1>
					<span>cave</span>
					<span>ra</span>
				</h1>
			</Link>
			<h2>
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
