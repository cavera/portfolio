'use client'
import { useLang } from '@/i18n/LangProvider'
import type { Experience, SocialLink } from '@/types/project'

interface AboutViewProps {
	experience: Experience[]
	skills: string[]
	certs: string[]
	socials: SocialLink[]
	email: string
	aboutPortrait: string
}

export const AboutView = ({ experience, skills, certs, socials, email, aboutPortrait }: AboutViewProps) => {
	const { t, lang } = useLang()

	return (
		<div className='view about'>
			<div className='wrap'>
				<div className='lab'>{t('t_about')}</div>
				<div className='about-intro'>
					<img
						className='portrait'
						src={aboutPortrait}
						alt='Leonardo Fonseca Rivera'
					/>
					<div className='about-intro-text'>
						<h1>
							Leonardo Fonse<span className='a'>ca</span> Rivera
						</h1>
						<p className='bio'>{t('bio')}</p>
					</div>
				</div>

				<h4>
					{t('t_exp')} · 2008 — {lang === 'es' ? 'hoy' : 'now'}
				</h4>
				{experience.map((e) => (
					<div
						className='exprow'
						key={e.role + e.when}>
						<div className='when'>{e.when}</div>
						<div>
							<h3>{e.role}</h3>
							<div className='co'>{e.co}</div>
							<p>{e[lang]}</p>
						</div>
						{e.badge ? <div className='badge'>{lang === 'es' ? 'Actual' : 'Current'}</div> : <div></div>}
					</div>
				))}

				<h4>{t('t_skills')}</h4>
				<div className='tags'>
					{skills.map((s) => (
						<span
							className='tag'
							key={s}>
							{s}
						</span>
					))}
				</div>

				<h4>{lang === 'es' ? 'Certificaciones' : 'Certifications'}</h4>
				<div className='tags'>
					{certs.map((c) => (
						<span
							className='tag'
							key={c}>
							{c}
						</span>
					))}
				</div>

				<h4>{lang === 'es' ? 'Idiomas' : 'Languages'}</h4>
				<div className='tags'>
					{lang === 'es' ? (
						<>
							<span className='tag'>Inglés — profesional</span>
							<span className='tag'>Español — nativo</span>
						</>
					) : (
						<>
							<span className='tag'>English — professional</span>
							<span className='tag'>Spanish — native</span>
						</>
					)}
				</div>

				<div className='foot'>
					<h2>
						{t('cta_foot')} <span className='a'>{t('cta_foot2')}</span>
					</h2>
					<a
						className='btn fill'
						href={`mailto:${email}`}>
						{email} →
					</a>
				</div>
				<div
					className='socials'
					style={{ marginTop: 20 }}>
					{socials.map((s) => (
						<a
							className='btn ghost sm'
							href={s.url}
							target='_blank'
							rel='noopener'
							key={s.name}>
							{s.name} ↗
						</a>
					))}
				</div>
			</div>
		</div>
	)
}
