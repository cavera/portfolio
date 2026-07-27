'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/i18n/LangProvider'
import { localePath, locales, stripLocale } from '@/i18n/routing'
import { useTheme } from '@/theme/ThemeProvider'

const NAV = [
	{ path: '/work', key: 'nav_work' },
	{ path: '/photography', key: 'nav_photo' },
	{ path: '/about', key: 'nav_about' },
] as const

export const Nav = ({ email }: { email: string }) => {
	const pathname = usePathname()
	const { lang, t } = useLang()
	const { theme, toggleTheme } = useTheme()

	// Where we are with the locale peeled off, so the language switch can point
	// at the same page in the other locale instead of dumping you on the home page.
	const section = stripLocale(pathname)

	return (
		<nav className='pfnav'>
			<Link
				href={localePath(lang)}
				className='logo'>
				cave<b>ra</b>
				<span style={{ color: 'var(--soft)' }}>.dev</span>
			</Link>
			<div className='links'>
				{NAV.map(({ path, key }) => (
					<Link
						key={path}
						href={localePath(lang, path)}
						className={section === path ? 'on' : ''}>
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
				{/* Links, not buttons: each language is a real URL, so switching is
				    navigation. Crawlers follow these; a click handler they could not. */}
				<div className='langtog'>
					{locales.map((l) => (
						<Link
							key={l}
							href={localePath(l, section)}
							hrefLang={l}
							aria-current={l === lang ? 'true' : undefined}
							className={l === lang ? 'on' : ''}>
							{l.toUpperCase()}
						</Link>
					))}
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
