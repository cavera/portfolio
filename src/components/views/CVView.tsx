'use client'
import { useLang } from '@/i18n/LangProvider'
import type { Experience, SocialLink } from '@/types/project'

interface CVViewProps {
	experience: Experience[]
	skills: string[]
	certs: string[]
	socials: SocialLink[]
	email: string
}

const stripUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export const CVView = ({ experience, skills, certs, socials, email }: CVViewProps) => {
	const { t, lang } = useLang()

	return (
		<div className='view cv'>
			<div className='cv-actions'>
				<button
					className='btn fill'
					onClick={() => window.print()}>
					{lang === 'es' ? 'Imprimir / Guardar como PDF' : 'Print / Save as PDF'}
				</button>
			</div>

			<div className='cv-sheet'>
				<div className='cv-main'>
					<h1>Leonardo Fonseca</h1>
					<div className='cv-role'>{t('now_role')}</div>
					<div className='cv-role-sub'>{lang === 'es' ? 'Desarrollador front-end y diseñador UI' : 'Front-end developer & UI designer'}</div>

					<h2>{lang === 'es' ? 'Perfil profesional' : 'Professional profile'}</h2>
					<p className='cv-profile'>{t('offer')}</p>

					<h2>{t('t_exp')}</h2>
					{experience.map((e) => (
						<div
							className='cv-job'
							key={e.role + e.when}>
							<div className='cv-job-head'>
								<span className='cv-job-title'>{e.role}</span>
								<span className='cv-job-when'>{e.when}</span>
							</div>
							<div className='cv-job-co'>{e.co}</div>
							<p>{e.summary}</p>
						</div>
					))}

					<h2>{lang === 'es' ? 'Educación' : 'Education'}</h2>
					<div className='cv-job'>
						<div className='cv-job-head'>
							<span className='cv-job-title'>Platzi</span>
							<span className='cv-job-when'>2014 — 2023</span>
						</div>
						<div className='cv-job-co'>platzi.com/p/cavera_de</div>
					</div>
					<div className='cv-job'>
						<div className='cv-job-head'>
							<span className='cv-job-title'>Corporación Nuestra Señora de las Mercedes</span>
							<span className='cv-job-when'>2002 — 2006</span>
						</div>
						<div className='cv-job-co'>{lang === 'es' ? 'Técnico profesional en artes gráficas y publicidad' : 'Professional Graphic Artist and Advertisement Technician'}</div>
					</div>
				</div>

				<div className='cv-side'>
					<div className='cv-contact'>
						<div>Bogotá, Colombia</div>
						<div>
							<a href={`mailto:${email}`}>{email}</a>
						</div>
						{socials.map((s) => (
							<div key={s.name}>
								<a
									href={s.url}
									target='_blank'
									rel='noopener'>
									{stripUrl(s.url)}
								</a>
							</div>
						))}
					</div>

					<h3>{t('t_skills')}</h3>
					<ul>
						{skills.map((s) => (
							<li key={s}>{s}</li>
						))}
					</ul>

					<h3>{lang === 'es' ? 'Certificaciones' : 'Certifications'}</h3>
					<ul>
						{certs.map((c) => (
							<li key={c}>{c}</li>
						))}
					</ul>

					<h3>{lang === 'es' ? 'Idiomas' : 'Languages'}</h3>
					<ul>
						<li>{lang === 'es' ? 'Español (nativo)' : 'Spanish (native)'}</li>
						<li>{lang === 'es' ? 'Inglés (C1)' : 'English (C1)'}</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
