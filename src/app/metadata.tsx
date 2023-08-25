import type { Metadata } from 'next'
import { CAVERA, siteLanguage, siteType, siteKeywords, siteColorScheme } from '@/data/consts'

export const metadata: Metadata = {
	title: CAVERA.portfolio.name,
	description: CAVERA.portfolio.description,
	metadataBase: new URL(CAVERA.portfolio.url),
	generator: 'Next.js',
	applicationName: CAVERA.portfolio.description,
	referrer: 'origin-when-cross-origin',
	keywords: siteKeywords,
	authors: [{ name: CAVERA.name, url: CAVERA.portfolio.url }],
	colorScheme: siteColorScheme,
	creator: CAVERA.name,
	publisher: CAVERA.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: CAVERA.portfolio.name,
		description: CAVERA.portfolio.description,
		url: CAVERA.portfolio.url,
		siteName: CAVERA.portfolio.name,
		images: [
			{
				url: 'og.jpg',
			},
		],
		locale: siteLanguage,
		type: siteType,
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
			{ url: 'favicon-32x32.png', sizes: '32x32' },
			{ url: 'favicon-16x16.png', sizes: '16x16' },
		],
		shortcut: 'icon.png',
		apple: 'apple-touch-icon.png',
		other: {
			rel: 'apple-touch-icon-precomposed',
			url: 'apple-touch-icon.png',
		},
	},
	// manifest: 'site.webmanifest',
	twitter: {
		card: 'summary_large_image',
		title: CAVERA.portfolio.description,
		description: CAVERA.portfolio.name,
		// siteId: '1467726470533754880',
		creator: CAVERA.twitter,
		// creatorId: '1467726470533754880',
		images: ['og.jpg'],
	},
}
