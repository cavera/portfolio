import Link from 'next/link'

export const Menu = () => {
	return (
		<nav>
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
