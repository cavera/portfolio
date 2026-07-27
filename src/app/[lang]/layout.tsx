import { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Nav } from '@/components/Nav'
import { LangProvider } from '@/i18n/LangProvider'
import { isLocale, locales } from '@/i18n/routing'
import { ThemeProvider, themeInitScript } from '@/theme/ThemeProvider'
import { metadata as allMetadata } from '../metadata'
import { siteColorScheme } from '@/data/consts'
import { getProfile } from '@/data/source'
import '../../styles/globals.scss'
import '../../styles/views.scss'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = allMetadata

export const viewport: Viewport = {
	themeColor: siteColorScheme,
	colorScheme: siteColorScheme,
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
}

// Only en/es exist. Without this, `/anything` would match [lang] and render the
// site with a nonsense locale instead of 404ing.
export const dynamicParams = false

export function generateStaticParams() {
	return locales.map((lang) => ({ lang }))
}

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-sans',
	display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['400', '500'],
	variable: '--font-mono',
	display: 'swap',
})

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
	const { lang } = await params
	if (!isLocale(lang)) notFound()

	const profile = await getProfile()

	return (
		<html
			lang={lang}
			className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			</head>
			<body>
				<LangProvider lang={lang}>
					<ThemeProvider>
						<Nav email={profile.email} />
						<main id='view'>{children}</main>
					</ThemeProvider>
				</LangProvider>
				<Analytics />
			</body>
		</html>
	)
}
