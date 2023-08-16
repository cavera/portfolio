import { Suspense } from 'react'
import Projects from '../components/projects'
import Hero from '../components/Hero'

async function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<div>Loading...</div>}>
				<Projects filtered={true} />
			</Suspense>
		</>
	)
}

export default Home
