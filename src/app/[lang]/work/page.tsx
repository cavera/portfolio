import { Suspense } from 'react'
import type { Metadata } from 'next'
import { WorkView } from '@/components/views/WorkView'
import { getProjects } from '@/data/source'
import { alternates } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return { alternates: alternates(lang, '/work') }
}

export default async function WorkPage({ params }: { params: Promise<{ lang: Lang }> }) {
	const { lang } = await params
	const projects = await getProjects(lang)

	return (
		<Suspense fallback={null}>
			<WorkView projects={projects} />
		</Suspense>
	)
}
