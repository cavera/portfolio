'use client'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { useLang } from '@/i18n/LangProvider'
import { projects } from '@/data/portfolio'

export const WorkView = () => {
	const rootRef = useRef<HTMLDivElement>(null)
	const { t, lang } = useLang()
	const initialId = useSearchParams().get('case')
	const n = projects.length

	// Case-overlay text is built imperatively; read the latest lang/t through
	// a ref so switching language doesn't force a full effect re-run (which
	// would reset the filmstrip back to pane 0).
	const liveRef = useRef({ t, lang })
	liveRef.current = { t, lang }

	useEffect(() => {
		const el = rootRef.current
		if (!el) return
		const track = el.querySelector<HTMLDivElement>('.track')!
		const dotEls = el.querySelectorAll<HTMLElement>('.progress i')
		const count = el.querySelector<HTMLElement>('#wcount')!
		const csov = el.querySelector<HTMLDivElement>('#csov')!
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
			if (csov.classList.contains('open')) return
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

		const closeCase = () => csov.classList.remove('open')
		const openCase = (id: string) => {
			const { t, lang } = liveRef.current
			const p = projects.find((x) => x.id === id)
			if (!p || !p.case) return
			const c = p.case
			const steps = c.process.map((s, i) => `<div class="step"><div class="num">0${i + 1}</div><p>${s[lang]}</p></div>`).join('')
			csov.innerHTML = `
        <div class="sheet">
          <button class="close" aria-label="${t('back')}">×</button>
          <div class="hero"><img src="${p.img}" alt="${p.title}"/><div class="grad"></div></div>
          <div class="body">
            <div class="k">${p.kind[lang]}</div>
            <h2>${p.title}</h2>
            <div class="meta">
              <div><span class="lab">${t('cs_role')}</span><span class="v">${p.role[lang]}</span></div>
              <div><span class="lab">Year</span><span class="v">${p.year}</span></div>
              <div><span class="lab">${t('cs_stack')}</span><span class="v">${p.stack.join(' · ')}</span></div>
            </div>
            <section><h3>${t('cs_context')}</h3><p>${c.context[lang]}</p></section>
            <section><h3>${t('cs_role')}</h3><p>${c.role[lang]}</p></section>
            <section><h3>${t('cs_process')}</h3><div class="steps">${steps}</div></section>
            <section><h3>${t('cs_outcome')}</h3><div class="outcome"><p>${c.outcome[lang]}</p></div></section>
            <div class="links">
              <a class="btn fill sm" href="${p.live}" target="_blank" rel="noopener">Live ↗</a>
              <a class="btn ghost sm" href="${p.code}" target="_blank" rel="noopener">Code ↗</a>
            </div>
          </div>
        </div>`
			csov.classList.add('open')
			csov.querySelector('.close')?.addEventListener('click', closeCase)
		}
		const onCsovClick = (e: MouseEvent) => {
			if (e.target === csov) closeCase()
		}
		csov.addEventListener('click', onCsovClick)
		const caseBtns = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-case]'))
		const onCaseClick = (b: HTMLButtonElement) => () => openCase(b.dataset.case!)
		caseBtns.forEach((b) => b.addEventListener('click', onCaseClick(b)))

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
			csov.removeEventListener('click', onCsovClick)
			navBtns.forEach((b) => b.removeEventListener('click', onNavClick(b)))
			caseBtns.forEach((b) => b.removeEventListener('click', onCaseClick(b)))
			if (anim) cancelAnimationFrame(anim)
		}
		// Structural setup runs once on mount; lang/t changes are read live via
		// liveRef so the filmstrip position isn't reset by a language toggle.
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
							<div className='k'>{p.kind[lang]}</div>
							<h2>{p.title}</h2>
							<p>{p.desc[lang]}</p>
							<div className='rolerow'>
								<div>
									<span className='lab'>{t('cs_role')}</span>
									<span className='v'>{p.role[lang]}</span>
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
									<button
										className='btn fill sm'
										data-case={p.id}>
										{t('view_case')} →
									</button>
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
			<div
				className='csov'
				id='csov'></div>
		</div>
	)
}
