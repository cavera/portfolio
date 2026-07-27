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

export const WorkView = ({ projects }: WorkViewProps) => {
	const rootRef = useRef<HTMLDivElement>(null)
	const { t, lang } = useLang()
	const initialId = useSearchParams().get('case')
	const n = projects.length

	useEffect(() => {
		const el = rootRef.current
		if (!el) return
		const track = el.querySelector<HTMLDivElement>('.track')!
		const dotEls = el.querySelectorAll<HTMLElement>('.progress i')
		const count = el.querySelector<HTMLElement>('#wcount')!
		const paneW = () => track.clientWidth
		let idx = 0
		let anim: number | null = null

		const animateTo = (target: number) => {
			if (anim) cancelAnimationFrame(anim)
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
			count.textContent = `0${idx + 1} / 0${n}`
		}
		const animateMeta = () => {
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

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') go(idx + 1)
			else if (e.key === 'ArrowLeft') go(idx - 1)
		}
		window.addEventListener('keydown', onKey)

		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
				track.scrollLeft += e.deltaY
				e.preventDefault()
			}
		}
		track.addEventListener('wheel', onWheel, { passive: false })

		if (initialId) {
			const i = projects.findIndex((p) => p.id === initialId)
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
			window.removeEventListener('keydown', onKey)
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
			<div
				className='count'
				id='wcount'>
				01 / 0{n}
			</div>
			<div className='progress'>
				{projects.map((p, i) => (
					<i
						key={p.id}
						className={i === 0 ? 'on' : ''}
					/>
				))}
			</div>
			<div className='track'>
				{projects.map((p, i) => (
					<section
						className='pane proj'
						key={p.id}>
						<div className='media'>
							<img
								src={p.img}
								alt={p.title}
							/>
						</div>
						<div className='meta'>
							<div className='idx'>
								0{i + 1} / 0{n}
							</div>
							<div className='k'>{p.kind}</div>
							<h2>{p.title}</h2>
							<p>{p.desc}</p>
							<div className='rolerow'>
								<div>
									<span className='lab'>{t('cs_role')}</span>
									<span className='v'>{p.role}</span>
								</div>
								<div>
									<span className='lab'>Year</span>
									<span className='v'>{p.year}</span>
								</div>
							</div>
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
	)
}
