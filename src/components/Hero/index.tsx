'use client'

import { useLayoutEffect, useRef } from 'react'
import { Logo } from '../Logo'
import SocialBar from '../SocialBar'
import { MouseScrollWheel } from 'iconoir-react'
import gsap from 'gsap'
import styles from './Hero.module.scss'

const Hero = () => {
	const logoRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	// gsap animations
	useLayoutEffect(() => {
		const tl = gsap.timeline({
			defaults: {
				duration: 0.8,
				ease: 'power3.out',
				delay: 0.5,
			},
		})

		tl.from(logoRef.current, {
			autoAlpha: 0,
			x: '-=30',
		})
			.from(
				contentRef.current,
				{
					autoAlpha: 0,
					x: '+=30',
				},
				0.5
			)
			.fromTo(
				contentRef.current?.getElementsByTagName('a') as any,
				{
					autoAlpha: 0,
				},
				{
					autoAlpha: 1,
					duration: 0.3,
					stagger: 0.2,
				},
				'-=1'
			)
	}, [])
	return (
		<section className={styles.hero}>
			<article
				className={styles.hero_logo}
				ref={logoRef}>
				<Logo />
			</article>
			<article
				className={styles.hero_content}
				ref={contentRef}>
				<p>With 10+ years of experience designing user interfaces and interactions for virtual courses in Latin America. I am proficient in Figma, Adobe Illustrator, HTML, CSS, JavaScript, and GSAP. I am committed to continuous learning and growth, and I am able to bridge the gap between designers and programmers.</p>
				<SocialBar size={32} />
			</article>
			<div className={styles.scroll_icon}>
				<MouseScrollWheel
					height={32}
					width={32}
				/>
			</div>
		</section>
	)
}

export default Hero
