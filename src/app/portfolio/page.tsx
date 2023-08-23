import Projects from '@/components/projects'
import { CAVERA, TITLES } from '@/data/consts'

export const metadata = {
	title: `${CAVERA.name}: ${TITLES.PORTFOLIO}`,
}

function Portfolio() {
	return <Projects filtered={false} />
}

export default Portfolio
