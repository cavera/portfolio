'use client'

import { useLayoutEffect, useRef } from 'react'
import { Logo } from '../Logo'
import SocialBar from '../SocialBar'
import { MouseScrollWheel } from 'iconoir-react'
import gsap from 'gsap'
import styles from './Hero.module.scss'

const Hero = () => {
	const sectionRef = useRef<HTMLDivElement>(null)
	const logoRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const socialRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)

	// gsap animations
	useLayoutEffect(() => {
		const speed = 0.5
		const tl = gsap.timeline({
			defaults: {
				ease: 'power3.out',
				duration: speed,
			},
		})

		tl.to(sectionRef.current, {
			css: {
				visibility: 'visible',
			},
			duration: 0,
		})
			.from(logoRef.current, {
				autoAlpha: 0,
				x: '-=30',
				duration: speed,
			})
			.from(contentRef.current, {
				autoAlpha: 0,
				x: '+=30',
				duration: speed,
			})
			.add('social')
			.call(
				() => {
					logoRef.current?.querySelector('.logo_container')?.classList.remove('normal')
				},
				[],
				'social'
			)
			.fromTo(
				socialRef.current?.getElementsByTagName('a') as any,
				{
					autoAlpha: 0,
				},
				{
					autoAlpha: 1,
					duration: 0.2,
					stagger: 0.15,
				},
				'social+=0.2'
			)
			.from(
				scrollRef.current,
				{
					autoAlpha: 0,
					y: '+=30',
				},
				`+=${speed}`
			)
	}, [])
	return (
		<section
			className={styles.hero}
			style={{ visibility: 'hidden' }}
			ref={sectionRef}>
			<article
				className={styles.hero_logo}
				ref={logoRef}>
				<Logo />
			</article>
			<article
				className={styles.hero_content}
				ref={contentRef}>
				<p>With 10+ years of experience designing user interfaces and interactions for virtual courses in Latin America. I am proficient in Figma, Adobe Illustrator, HTML, CSS, JavaScript, and GSAP. I am committed to continuous learning and growth, and I am able to bridge the gap between designers and programmers.</p>
			</article>
			<aside
				className={styles.social}
				ref={socialRef}>
				<SocialBar size={32} />
			</aside>
			<div
				className={styles.scroll_icon}
				ref={scrollRef}>
				<MouseScrollWheel
					height={32}
					width={32}
				/>
			</div>
		</section>
	)
}

export default Hero
