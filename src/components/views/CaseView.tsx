import Link from 'next/link'
import { localePath } from '@/i18n/routing'
import { strings } from '@/i18n/strings'
import type { Lang } from '@/i18n/strings'
import type { Project } from '@/types/project'

/**
 * The case study as a real, server-rendered page.
 *
 * It used to exist only as an overlay built with `innerHTML` inside a client
 * effect in WorkView, which meant the most substantial writing on the site was
 * invisible to crawlers and impossible to link to. This renders the same markup
 * — reusing the `.csov` styles through a `.casepage` modifier — as HTML that
 * ships in the initial response.
 *
 * A server component, so it reads `strings` directly rather than through the
 * `useLang` hook.
 */
export const CaseView = ({ project, lang }: { project: Project; lang: Lang }) => {
	const t = (key: keyof typeof strings.en) => strings[lang][key]
	const c = project.case

	return (
		<div className='csov casepage open'>
			<article className='sheet'>
				<div className='hero'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={project.img}
						alt={project.title}
					/>
					<div className='grad'></div>
				</div>
				<div className='body'>
					<div className='k'>{project.kind}</div>
					<h1>{project.title}</h1>

					{lang === 'es' && !project.translated && (
						<p className='translation-note'>Este caso todavía no está traducido — se muestra en inglés.</p>
					)}

					<div className='meta'>
						{project.role && (
							<div>
								<span className='lab'>{t('cs_role')}</span>
								<span className='v'>{project.role}</span>
							</div>
						)}
						{project.year && (
							<div>
								<span className='lab'>Year</span>
								<span className='v'>{project.year}</span>
							</div>
						)}
						{project.stack.length > 0 && (
							<div>
								<span className='lab'>{t('cs_stack')}</span>
								<span className='v'>{project.stack.join(' · ')}</span>
							</div>
						)}
					</div>

					{project.desc && <p>{project.desc}</p>}

					{c?.context && (
						<section>
							<h2>{t('cs_context')}</h2>
							<p>{c.context}</p>
						</section>
					)}
					{c?.role && (
						<section>
							<h2>{t('cs_role')}</h2>
							<p>{c.role}</p>
						</section>
					)}
					{c?.process && c.process.length > 0 && (
						<section>
							<h2>{t('cs_process')}</h2>
							<div className='steps'>
								{c.process.map((step, i) => (
									<div
										className='step'
										key={i}>
										<div className='num'>{String(i + 1).padStart(2, '0')}</div>
										<p>{step}</p>
									</div>
								))}
							</div>
						</section>
					)}
					{c?.outcome && (
						<section>
							<h2>{t('cs_outcome')}</h2>
							<div className='outcome'>
								<p>{c.outcome}</p>
							</div>
						</section>
					)}

					{project.tags.length > 0 && (
						<div className='tags'>
							{project.tags.map((tag) => (
								<span
									className='tag'
									key={tag}>
									{tag}
								</span>
							))}
						</div>
					)}

					<div className='links'>
						{project.live && (
							<a
								className='btn fill sm'
								href={project.live}
								target='_blank'
								rel='noopener'>
								Live ↗
							</a>
						)}
						{project.code && (
							<a
								className='btn ghost sm'
								href={project.code}
								target='_blank'
								rel='noopener'>
								Code ↗
							</a>
						)}
						<Link
							className='btn ghost sm'
							href={localePath(lang, '/work')}>
							← {t('view_all_work')}
						</Link>
					</div>
				</div>
			</article>
		</div>
	)
}
