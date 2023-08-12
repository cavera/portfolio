'use client'
import { use, useLayoutEffect, useRef } from 'react'
import { HeaderLogo } from './HeaderLogo'
import { Menu } from './Menu'

import styles from './TopBar.module.scss'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export const TopBar = () => {
	const topBarBgRef = useRef<HTMLDivElement>(null)
	useLayoutEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: document.documentElement,
				start: 'top top',
				end: '+=100',
				scrub: true,
				markers: false,
			},
			defaults: {},
		})

		tl.fromTo(
			topBarBgRef.current,
			{
				autoAlpha: 0,
			},
			{
				autoAlpha: 1,
			}
		)
	}, [])
	return (
		<header className={styles.header}>
			<div
				className={styles.header_bg}
				ref={topBarBgRef}></div>
			<HeaderLogo />
			<Menu />
		</header>
	)
}
