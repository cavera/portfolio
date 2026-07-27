import { Suspense } from 'react'
import { WorkView } from '@/components/views/WorkView'
import { getProjects } from '@/data/source'

export default async function WorkPage() {
	const projects = await getProjects()

	return (
		<Suspense fallback={null}>
			<WorkView projects={projects} />
		</Suspense>
	)
}
