import '../styles/globals.scss'
import type { Metadata } from 'next'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
	subsets: ['latin'],
	variable: '--main-font-family',
})

export const metadata: Metadata = {
	title: `UI Designer (Front-end dev too)`,
	description: `Leonardo Fonseca's Portfolio`,

	generator: 'Next.js',
	applicationName: `Leonardo Fonseca's Portfolio`,
	referrer: 'origin-when-cross-origin',
	keywords: ['Next.js', 'React', 'JavaScript', 'Figma', 'UI Design', 'Front-end', 'Frontend', 'Graphic Design', 'e-learning', 'CSS'],
	authors: [{ name: 'Leonardo Fonseca', url: 'https://portfolio-cavera.vercel.app/' }],
	colorScheme: 'dark',
	creator: 'Leonardo Fonseca',
	publisher: 'Leonardo Fonseca',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: `UI Designer (Front-end dev too)`,
		description: `Leonardo Fonseca's Portfolio`,
		url: 'https://portfolio-cavera.vercel.app/',
		siteName: `UI Designer (Front-end dev too)`,
		images: [
			{
				url: 'public/og.jpg',
				width: 640,
				height: 480,
			},
			{
				url: 'public/og-alt.jpg',
				width: 1024,
				height: 768,
				alt: 'My custom alt',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	robots: {
		index: false,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: false,
			noimageindex: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: [
			{ url: 'public/favicon-32x32.png', sizes: '32x32' },
			{ url: 'public/favicon-16x16.png', sizes: '16x16' },
		],
		shortcut: 'public/icon.png',
		apple: 'public/apple-touch-icon.png',
		other: {
			rel: 'apple-touch-icon-precomposed',
			url: 'public/apple-touch-icon.png',
		},
	},
	manifest: 'public/manifest.json',
	twitter: {
		card: 'summary_large_image',
		title: 'Leonardo Fonseca Rivera',
		description: 'UI Designer (Front-end dev too)',
		// siteId: '1467726470533754880',
		creator: '@cavera_de',
		creatorId: '1467726470533754880',
		images: ['public/og.jpg'],
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={`${montserrat.variable} sans-serif`}>
				<TopBar />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
