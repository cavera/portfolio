import Projects from '../components/projects'
import Hero from '../components/Hero'

export default function Home() {
	return (
		<>
			<Hero />

			<Projects filtered={true} />
		</>
	)
}
