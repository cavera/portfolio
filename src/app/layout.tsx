import { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { metadata as allMetadata } from './metadata'
import '../styles/globals.scss'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = allMetadata

const montserrat = Montserrat({
	subsets: ['latin'],
	variable: '--main-font-family',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={`${montserrat.variable} system-ui sans-serif`}>
				<TopBar />
				<main>{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	)
}
