'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/i18n/LangProvider'
import { photoProfile, photos } from '@/data/portfolio'

export const PhotoView = () => {
	const rootRef = useRef<HTMLDivElement>(null)
	const { t } = useLang()
	const panelCount = photos.length + 2 // intro + photo frames + outro

	useEffect(() => {
		const el = rootRef.current
		if (!el) return
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

		const scroller = el.querySelector<HTMLDivElement>('.pscroll')!
		const stage = el.querySelector<HTMLDivElement>('.pstage')!
		const rail = el.querySelector<HTMLDivElement>('.prail')!
		const spacer = el.querySelector<HTMLDivElement>('.pspacer')!
		const ruler = el.querySelector<HTMLDivElement>('.pruler')!
		const fillEl = el.querySelector<HTMLElement>('.pruler .fill')!
		const bgEls = Array.from(el.querySelectorAll<HTMLElement>('.pbg'))
		const panels = Array.from(rail.children) as HTMLElement[]
		const ticks = Array.from(ruler.querySelectorAll<HTMLElement>('.tick'))
		const navBtnsEls = Array.from(el.querySelectorAll<HTMLButtonElement>('.navbtns button'))

		let stageW = 0
		let travel = 0
		let centers: number[] = []
		let bgOwners: (string | null)[] = []
		let bgFront = 0
		let bgCur: string | null | undefined = undefined
		let curNearest = 0
		let raf: number | null = null
		let tween: number | null = null

		const setBackdrop = (nearest: number) => {
			const owner = bgOwners[nearest]
			if (owner === bgCur) return
			bgCur = owner
			if (!owner) {
				bgEls.forEach((b) => b.classList.remove('on'))
				return
			}
			const back = bgFront ^ 1
			bgEls[back].style.backgroundImage = `url("${owner}")`
			bgEls[back].classList.add('on')
			bgEls[bgFront].classList.remove('on')
			bgFront = back
		}

		const render = () => {
			raf = null
			const y = scroller.scrollTop
			rail.style.transform = `translate3d(${-y}px,0,0)`
			const prog = y / travel
			fillEl.style.width = prog * 100 + '%'

			const viewCenter = y + stageW / 2
			let nearest = 0
			let nd = Infinity
			panels.forEach((p, i) => {
				const c = p.offsetLeft + p.offsetWidth / 2
				const d = c - viewCenter
				const ad = Math.abs(d)
				if (ad < nd) {
					nd = ad
					nearest = i
				}
				if (!reduce) {
					const norm = Math.max(-1, Math.min(1, d / (stageW * 0.7)))
					const inner = p.querySelector<HTMLElement>('.frame-in')
					if (inner) inner.style.transform = `translate3d(${-norm * 46}px,0,0) scale(${1 - Math.abs(norm) * 0.06})`
					const cap = p.querySelector<HTMLElement>('.cap')
					if (cap) {
						const k = Math.max(0, 1 - Math.abs(norm) * 1.7)
						cap.style.opacity = String(k)
						cap.style.transform = `translateY(${(1 - k) * 18}px)`
					}
				}
			})
			ticks.forEach((tk, i) => tk.classList.toggle('on', i === nearest))
			setBackdrop(nearest)
			curNearest = nearest
			const atStart = y <= 1
			const atEnd = y >= travel - 1
			if (navBtnsEls[0]) navBtnsEls[0].disabled = atStart
			if (navBtnsEls[1]) navBtnsEls[1].disabled = atEnd
		}

		const layout = () => {
			stageW = stage.clientWidth
			const first = panels[0]
			const last = panels[panels.length - 1]
			rail.style.paddingLeft = Math.max(0, (stageW - first.offsetWidth) / 2) + 'px'
			rail.style.paddingRight = Math.max(0, (stageW - last.offsetWidth) / 2) + 'px'
			travel = Math.max(1, rail.scrollWidth - stageW)
			spacer.style.height = travel + 'px'
			centers = panels.map((p) => p.offsetLeft + p.offsetWidth / 2 - stageW / 2)
			bgOwners = panels.map((p) => p.dataset.bg || null)
			ticks.forEach((tk, i) => {
				tk.style.left = (centers[i] / travel) * 100 + '%'
			})
			render()
		}

		const onScroll = () => {
			if (raf == null) raf = requestAnimationFrame(render)
		}

		const scrollTo = (target: number) => {
			target = Math.max(0, Math.min(travel, target))
			if (tween) cancelAnimationFrame(tween)
			if (reduce) {
				scroller.scrollTop = target
				return
			}
			const start = scroller.scrollTop
			const dist = target - start
			if (Math.abs(dist) < 1) return
			const dur = Math.min(1100, 420 + Math.abs(dist) * 0.35)
			let t0: number | null = null
			const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
			const step = (ts: number) => {
				if (t0 === null) t0 = ts
				const pr = Math.min(1, (ts - t0) / dur)
				scroller.scrollTop = start + dist * ease(pr)
				if (pr < 1) tween = requestAnimationFrame(step)
				else tween = null
			}
			tween = requestAnimationFrame(step)
		}
		const scrollToPanel = (i: number) => scrollTo(centers[Math.max(0, Math.min(centers.length - 1, i))])
		const step = (dir: number) => scrollToPanel(curNearest + dir)

		const onNavClick = (b: HTMLButtonElement) => () => step(Number(b.dataset.dir))
		navBtnsEls.forEach((b) => b.addEventListener('click', onNavClick(b)))

		const onTickClick = (i: number) => () => scrollToPanel(i)
		ticks.forEach((tk, i) => tk.addEventListener('click', onTickClick(i)))

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') {
				e.preventDefault()
				step(1)
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault()
				step(-1)
			}
		}
		window.addEventListener('keydown', onKey)
		scroller.addEventListener('scroll', onScroll, { passive: true })

		const ro = new ResizeObserver(layout)
		ro.observe(stage)
		requestAnimationFrame(layout)
		// Image-slots resolve async in the source; here <img> sizes async too —
		// relayout once dimensions have likely settled.
		const relayoutTimer = window.setTimeout(layout, 300)

		return () => {
			window.removeEventListener('keydown', onKey)
			scroller.removeEventListener('scroll', onScroll)
			navBtnsEls.forEach((b) => b.removeEventListener('click', onNavClick(b)))
			ro.disconnect()
			clearTimeout(relayoutTimer)
			if (raf) cancelAnimationFrame(raf)
			if (tween) cancelAnimationFrame(tween)
		}
	}, [])

	return (
		<div
			ref={rootRef}
			className='view photo'>
			<div className='pbgs'>
				<div className='pbg on' />
				<div className='pbg' />
			</div>
			<div className='pscroll'>
				<div className='pstage'>
					<div className='prail'>
						<section className='frame intro'>
							<div className='lab'>500px · @LeonardoFonseca</div>
							<h2>{t('t_photo')}</h2>
							<p>{t('photo_sub')}</p>
							<div className='scrollcue'>
								<span className='bar'></span>
								{t('scroll_explore')}
							</div>
						</section>

						{photos.map((p, i) => (
							<section
								className='frame pframe'
								data-bg={p.src || ''}
								key={p.id}>
								<div className='frame-in'>
									<img
										src={p.src}
										alt={p.title}
										style={{ aspectRatio: p.aspect || '3/2' }}
									/>
								</div>
								<div className='cap'>
									<span className='pn'>{String(i + 1).padStart(2, '0')}</span>
									<h3>{p.title}</h3>
									<a
										href={p.link}
										target='_blank'
										rel='noopener'>
										{t('view_500')} ↗
									</a>
								</div>
							</section>
						))}

						<section className='frame outro'>
							<div className='lab'>
								{String(photos.length + 1).padStart(2, '0')} / {String(photos.length + 1).padStart(2, '0')}
							</div>
							<h2>{t('photo_outro')}</h2>
							<a
								className='btn fill'
								href={photoProfile}
								target='_blank'
								rel='noopener'>
								{t('photo_cta')} ↗
							</a>
						</section>
					</div>

					<div className='pruler'>
						<div className='line' />
						<div className='fill' />
						{Array.from({ length: panelCount }).map((_, i) => {
							const label = i === 0 ? '00' : i === panelCount - 1 ? 'END' : String(i).padStart(2, '0')
							return (
								<div
									className='tick'
									key={i}>
									<span className='tn'>{label}</span>
									<span className='dot' />
								</div>
							)
						})}
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
				<div className='pspacer' />
			</div>
		</div>
	)
}
