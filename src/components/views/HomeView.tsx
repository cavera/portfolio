'use client'
import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useLang } from '@/i18n/LangProvider'
import { email, photos, projects, skills } from '@/data/portfolio'

export const HomeView = () => {
	const rootRef = useRef<HTMLDivElement>(null)
	const { t, lang } = useLang()
	const feat = projects[0]
	const photoCells = photos.slice(0, 3)

	useLayoutEffect(() => {
		const el = rootRef.current
		if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
		// Scoped so cleanup can kill+revert these tweens. Without it, React's
		// dev-only Strict Mode double-invoke (mount, cleanup, mount again) fires
		// gsap.from() twice on the same elements with nothing killing the first
		// tween, which can leave the hero permanently stuck mid-animation.
		const ctx = gsap.context(() => {
			gsap.from(el.querySelectorAll('.bline i'), { yPercent: 110, duration: 0.8, stagger: 0.09, ease: 'power3.out' })
			gsap.from(el.querySelectorAll('.btop, .bsub'), { opacity: 0, y: 14, duration: 0.5, delay: 0.35, ease: 'power2.out', clearProps: 'all' })
			gsap.from(el.querySelectorAll('.bgrid > *'), { opacity: 0, y: 18, duration: 0.38, stagger: 0.06, delay: 0.45, ease: 'power2.out', clearProps: 'all' })
		}, el)
		return () => ctx.revert()
	}, [])

	return (
		<div
			ref={rootRef}
			className='view bhome'>
			<div className='bwrap bhero'>
				<div className='btop mono'>
					<span>
						cave<b className='acc'>ra</b>.dev
					</span>
					<span className='now'>
						<span className='dot'></span>
						{t('now_role')} · {t('now_at')}
					</span>
				</div>
				<h1 className='bname'>
					<span className='bline'>
						<i>Leonardo</i>
					</span>
					<span className='bline'>
						<i>
							Fonse<span className='a'>ca</span> Ri<span className='a'>vera</span>
						</i>
					</span>
				</h1>
				<div className='bsub'>
					<p>{t('role_line')}</p>
					<div className='ctas'>
						<a
							className='btn fill'
							href={`mailto:${email}`}>
							{t('cta_talk')} →
						</a>
						<a
							className='btn ghost'
							href='/cv/FrontEnd_Leonardo_Fonseca.pdf'
							target='_blank'
							rel='noopener'>
							{t('cta_cv')}
						</a>
					</div>
				</div>
			</div>

			<div
				className='bmarq'
				aria-hidden='true'>
				<div className='in'>
					{skills.map((s) => (
						<span key={s}>
							<span>{s}</span>
							<span className='a'>✦</span>
						</span>
					))}
				</div>
				<div className='in'>
					{skills.map((s) => (
						<span key={`dup-${s}`}>
							<span>{s}</span>
							<span className='a'>✦</span>
						</span>
					))}
				</div>
			</div>

			<div className='bwrap bgrid'>
				<Link
					className='bfeat'
					href={`/work?case=${feat.id}`}>
					<img
						src={feat.img}
						alt={feat.title}
					/>
					<div className='ov'>
						<div className='k'>
							{feat.kind[lang]} — {lang === 'es' ? 'Caso de estudio' : 'Case study'}
						</div>
						<h3>{feat.title}</h3>
					</div>
					<span className='go'>↗</span>
				</Link>

				<div className='bcol'>
					<div className='tile b-stats'>
						<div>
							<div className='n'>
								<b>15+</b>
							</div>
							<div className='l'>{t('years')}</div>
						</div>
						<div>
							<div className='n'>40+</div>
							<div className='l'>{t('projects')}</div>
						</div>
					</div>
					<Link
						className='tile t-about b-about'
						href='/about'>
						<div className='lab'>{t('t_about')}</div>
						<h3>CrearMedia → RebelMouse</h3>
						<span className='go'>↗</span>
					</Link>
					<a
						className='tile t-cta b-cta'
						href={`mailto:${email}`}>
						<h3>{t('cta_foot')}</h3>
						<div className='m'>{email} →</div>
						<span className='go'>↗</span>
					</a>
				</div>

				<Link
					className='tile t-photo b-photo'
					href='/photography'>
					<div className='row'>
						{photoCells.map((p) => (
							<div
								className='cell'
								key={p.id}>
								<img
									src={p.src}
									alt={p.title}
								/>
							</div>
						))}
					</div>
					<div className='lblrow'>
						<span className='lab'>{t('t_photo')}</span>
						<span className='lab'>500px ↗</span>
					</div>
				</Link>
				<Link
					className='tile b-work'
					href='/work'>
					<div className='lab'>{t('nav_work')}</div>
					<h3>
						{projects.length} {t('projects').toLowerCase()}
					</h3>
					<span className='go'>↗</span>
				</Link>
			</div>
		</div>
	)
}
