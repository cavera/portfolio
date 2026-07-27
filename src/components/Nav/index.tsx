'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/i18n/LangProvider'
import { useTheme } from '@/theme/ThemeProvider'

const NAV = [
	{ href: '/work', key: 'nav_work' },
	{ href: '/photography', key: 'nav_photo' },
	{ href: '/about', key: 'nav_about' },
] as const

export const Nav = ({ email }: { email: string }) => {
	const pathname = usePathname()
	const { lang, setLang, t } = useLang()
	const { theme, toggleTheme } = useTheme()

	return (
		<nav className='pfnav'>
			<Link
				href='/'
				className='logo'>
				cave<b>ra</b>
				<span style={{ color: 'var(--soft)' }}>.dev</span>
			</Link>
			<div className='links'>
				{NAV.map(({ href, key }) => (
					<Link
						key={href}
						href={href}
						className={pathname === href ? 'on' : ''}>
						{t(key)}
					</Link>
				))}
			</div>
			<div className='right'>
				<button
					className='thbtn'
					aria-label='Toggle theme'
					onClick={toggleTheme}>
					{theme === 'dark' ? '☀' : '☾'}
				</button>
				<div className='langtog'>
					<button
						aria-selected={lang === 'en'}
						onClick={() => setLang('en')}>
						EN
					</button>
					<button
						aria-selected={lang === 'es'}
						onClick={() => setLang('es')}>
						ES
					</button>
				</div>
				<a
					className='btn fill sm'
					href={`mailto:${email}`}>
					{t('cta_talk')} →
				</a>
			</div>
		</nav>
	)
}
