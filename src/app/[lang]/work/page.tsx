import { Suspense } from 'react'
import type { Metadata } from 'next'
import { WorkView } from '@/components/views/WorkView'
import { CAVERA } from '@/data/consts'
import { getProjects } from '@/data/source'
import { alternates } from '@/i18n/routing'
import { strings } from '@/i18n/strings'
import type { Lang } from '@/i18n/strings'

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
	const { lang } = await params
	return {
		title: `${CAVERA.name} — ${strings[lang].nav_work}`,
		alternates: alternates(lang, '/work'),
	}
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
