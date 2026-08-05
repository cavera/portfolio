import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseView } from '@/components/views/CaseView'
import { getCaseNode, getProject, getProjects } from '@/data/source'
import { alternates, defaultLocale, locales } from '@/i18n/routing'
import type { Lang } from '@/i18n/strings'

type Params = { params: Promise<{ lang: Lang; slug: string }> }

export async function generateStaticParams() {
	const perLocale = await Promise.all(
		locales.map(async (lang) => (await getProjects(lang)).filter((p) => p.hasCase).map((p) => ({ lang, slug: p.id })))
	)
	return perLocale.flat()
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { lang, slug } = await params
	const project = await getProject(slug, lang)
	if (!project) return {}

	// Only advertise the locales that actually have this case study translated.
	// Claiming an hreflang="es" URL that serves English is a worse signal than
	// claiming nothing at all.
	const available = project.translated ? locales : ([defaultLocale] as const)

	return {
		title: `${project.title} — ${project.kind}`,
		description: project.desc || undefined,
		alternates: alternates(lang, `/work/${slug}`, available),
		openGraph: {
			title: project.title,
			description: project.desc || undefined,
			images: project.img ? [{ url: project.img }] : undefined,
			type: 'article',
		},
	}
}

export default async function CasePage({ params }: Params) {
	const { lang, slug } = await params
	const project = await getProject(slug, lang)
	if (!project || !project.hasCase) notFound()
	const node = await getCaseNode(slug, lang)

	return (
		<CaseView
			project={project}
			lang={lang}
			node={node}
		/>
	)
}
