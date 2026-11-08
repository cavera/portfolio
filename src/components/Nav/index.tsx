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
				<span className='dev'>.dev</span>
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
				{/* Plain anchors, not <Link>: each language is a real URL (crawlers follow
				    it), and a full load re-runs the pre-paint theme script. A client-side
				    swap re-renders the root layout, which logs a script-tag error and
				    drops data-theme. */}
				<div className='langtog'>
					{locales.map((l) => (
						<a
							key={l}
							href={localePath(l, section)}
							hrefLang={l}
							aria-current={l === lang ? 'true' : undefined}
							className={l === lang ? 'on' : ''}>
							{l.toUpperCase()}
						</a>
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
