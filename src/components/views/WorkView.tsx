'use client'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import Link from 'next/link'
import { useLang } from '@/i18n/LangProvider'
import { localePath } from '@/i18n/routing'
import type { Project } from '@/types/project'

interface WorkViewProps {
	projects: Project[]
}

const pad = (n: number) => String(n).padStart(2, '0')
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export const WorkView = ({ projects }: WorkViewProps) => {
	const rootRef = useRef<HTMLDivElement>(null)
	const { t, lang } = useLang()
	const initialId = useSearchParams().get('case')
	const featured = projects.filter((p) => p.hasCase)
	const archive = projects.filter((p) => !p.hasCase)
	const n = featured.length

	useEffect(() => {
		const el = rootRef.current
		if (!el || n === 0) return
		const carousel = el.querySelector<HTMLDivElement>('.carousel')!
		const track = el.querySelector<HTMLDivElement>('.track')!
		const dotEls = el.querySelectorAll<HTMLElement>('.progress i')
		const count = el.querySelector<HTMLElement>('#wcount')!
		const paneW = () => track.clientWidth
		let idx = 0
		let anim: number | null = null

		const animateTo = (target: number) => {
			if (anim) cancelAnimationFrame(anim)
			if (reducedMotion()) {
				track.scrollLeft = target
				return
			}
			const start = track.scrollLeft
			const dist = target - start
			const dur = 440
			let t0: number | null = null
			const step = (ts: number) => {
				if (t0 === null) t0 = ts
				const pr = Math.min(1, (ts - t0) / dur)
				const e = pr < 0.5 ? 2 * pr * pr : 1 - Math.pow(-2 * pr + 2, 2) / 2
				track.scrollLeft = start + dist * e
				if (pr < 1) anim = requestAnimationFrame(step)
				else anim = null
			}
			anim = requestAnimationFrame(step)
		}
		const upd = () => {
			dotEls.forEach((d, k) => d.classList.toggle('on', k === idx))
			count.textContent = `${pad(idx + 1)} / ${pad(n)}`
		}
		const animateMeta = () => {
			if (reducedMotion()) return
			const meta = track.querySelectorAll('.pane')[idx]?.querySelector('.meta')
			if (!meta) return
			gsap.fromTo(meta, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' })
		}
		const go = (m: number) => {
			idx = Math.max(0, Math.min(n - 1, m))
			upd()
			animateTo(idx * paneW())
			animateMeta()
		}

		const navBtns = Array.from(el.querySelectorAll<HTMLButtonElement>('.navbtns button'))
		const onNavClick = (b: HTMLButtonElement) => () => go(idx + Number(b.dataset.dir))
		navBtns.forEach((b) => b.addEventListener('click', onNavClick(b)))

		const onScroll = () => {
			const i = Math.round(track.scrollLeft / paneW())
			if (i !== idx) {
				idx = i
				upd()
			}
		}
		track.addEventListener('scroll', onScroll, { passive: true })

		// Scoped to the carousel region so arrow keys don't hijack the whole
		// page — only fires while the carousel itself (or a child) has focus.
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') go(idx + 1)
			else if (e.key === 'ArrowLeft') go(idx - 1)
		}
		carousel.addEventListener('keydown', onKey)

		// Let vertical wheel input drive the horizontal carousel, but only
		// while there's more carousel to see — at either end, fall through to
		// normal page scroll so the archive grid below is reachable.
		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
			const atStart = track.scrollLeft <= 0
			const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1
			if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return
			track.scrollLeft += e.deltaY
			e.preventDefault()
		}
		track.addEventListener('wheel', onWheel, { passive: false })

		if (initialId) {
			const i = featured.findIndex((p) => p.id === initialId)
			if (i >= 0) {
				idx = i
				upd()
				requestAnimationFrame(() => {
					track.scrollLeft = i * paneW()
					animateMeta()
				})
			}
		} else {
			requestAnimationFrame(() => animateMeta())
		}

		return () => {
			carousel.removeEventListener('keydown', onKey)
			track.removeEventListener('scroll', onScroll)
			track.removeEventListener('wheel', onWheel)
			navBtns.forEach((b) => b.removeEventListener('click', onNavClick(b)))
			if (anim) cancelAnimationFrame(anim)
		}
		// Structural setup runs once on mount. `projects` is captured
		// deliberately: it arrives from a server component and is fixed for the
		// life of the page.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div
			ref={rootRef}
			className='view exh'>
			{n > 0 && (
				<div
					className='carousel'
					role='region'
					aria-roledescription='carousel'
					aria-label={t('t_work')}
					tabIndex={0}>
					<div
						className='count'
						id='wcount'
						aria-live='polite'
						aria-atomic='true'>
						{pad(1)} / {pad(n)}
					</div>
					<div className='progress'>
						{featured.map((p, i) => (
							<i
								key={p.id}
								className={i === 0 ? 'on' : ''}
							/>
						))}
					</div>
					<div className='track'>
						{featured.map((p, i) => (
							<section
								className='pane proj'
								role='group'
								aria-roledescription='slide'
								aria-label={`${i + 1} / ${n}`}
								key={p.id}>
								<div className='media'>
									<img
										src={p.img}
										alt={p.title}
									/>
								</div>
								<div className='meta'>
									<div className='idx'>
										{pad(i + 1)} / {pad(n)}
									</div>
									<div className='k'>{p.kind}</div>
									<h2>{p.title}</h2>
									{p.desc && <p>{p.desc}</p>}
									{(p.role || p.year) && (
										<div className='rolerow'>
											{p.role && (
												<div>
													<span className='lab'>{t('cs_role')}</span>
													<span className='v'>{p.role}</span>
												</div>
											)}
											{p.year && (
												<div>
													<span className='lab'>Year</span>
													<span className='v'>{p.year}</span>
												</div>
											)}
										</div>
									)}
									<div className='tags'>
										{p.tags.map((tag) => (
											<span
												className='tag'
												key={tag}>
												{tag}
											</span>
										))}
									</div>
									<div className='actions'>
										{p.hasCase && (
											<Link
												className='btn fill sm'
												href={localePath(lang, `/work/${p.id}`)}>
												{t('view_case')} →
											</Link>
										)}
										{p.live && (
											<a
												className='btn ghost sm'
												href={p.live}
												target='_blank'
												rel='noopener'>
												Live ↗
											</a>
										)}
										{p.code && (
											<a
												className='btn ghost sm'
												href={p.code}
												target='_blank'
												rel='noopener'>
												Code ↗
											</a>
										)}
									</div>
								</div>
							</section>
						))}
					</div>
					<div className='navbtns'>
						<button
							data-dir='-1'
							aria-label={t('prev')}>
							←
						</button>
						<button
							data-dir='1'
							aria-label={t('next')}>
							→
						</button>
					</div>
				</div>
			)}

			{archive.length > 0 && (
				<div className='archive'>
					<h2>{t('t_archive')}</h2>
					<div className='archive-grid'>
						{archive.map((p) => (
							<div
								className='acard'
								key={p.id}>
								<div className='ath'>
									<img
										src={p.img}
										alt={p.title}
									/>
								</div>
								<div className='ab'>
									<div className='ak'>{p.kind}</div>
									<h3>{p.title}</h3>
									<div className='tags'>
										{p.tags.slice(0, 3).map((tag) => (
											<span
												className='tag'
												key={tag}>
												{tag}
											</span>
										))}
									</div>
									<div className='actions'>
										{p.live && (
											<a
												className='btn ghost sm'
												href={p.live}
												target='_blank'
												rel='noopener'>
												Live ↗
											</a>
										)}
										{p.code && (
											<a
												className='btn ghost sm'
												href={p.code}
												target='_blank'
												rel='noopener'>
												Code ↗
											</a>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
