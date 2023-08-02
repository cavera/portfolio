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
