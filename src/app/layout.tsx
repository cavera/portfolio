import { Metadata } from 'next'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { metadata as allMetadata } from './metadata'
import '../styles/globals.scss'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = allMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
				<TopBar />
				<main>{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	)
}
