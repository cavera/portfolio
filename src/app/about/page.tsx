import { AboutView } from '@/components/views/AboutView'
import { CAVERA, TITLES } from '@/data/consts'

export const metadata = {
	title: `${CAVERA.name}: ${TITLES.ABOUT}`,
}

export default function AboutPage() {
	return <AboutView />
}
