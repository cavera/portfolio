import { Suspense } from 'react'
import { WorkView } from '@/components/views/WorkView'

export default function WorkPage() {
	return (
		<Suspense fallback={null}>
			<WorkView />
		</Suspense>
	)
}
