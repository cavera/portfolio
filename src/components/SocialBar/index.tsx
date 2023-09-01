'use client'
import { useEffect, useRef, useState } from 'react'
import { Mail } from 'iconoir-react'
import { Brands } from '../Icons/Brands'
import { Icon } from './Icon'
import { gsap } from 'gsap'
import styles from './SocialBar.module.scss'

const links = [
	{
		icon: Brands.github,
		link: 'https://github.com/cavera',
	},
	{
		icon: Brands.behance,
		link: 'https://behance.net/cavera',
	},
	{
		icon: Brands.linkedin,
		link: 'https://linkedin.com/in/leonardo-ui/',
	},
	{
		icon: Brands.codepen,
		link: 'https://codepen.io/cavera',
	},
	{
		icon: Brands['500px'],
		link: 'https://500px.com/p/LeonardoFonseca',
	},
	{
		icon: Mail,
		link: 'mailto:cavera.de@gmail.com',
	},
]

const SocialBar = ({ size }: { size: number }) => {
	const tooltipRef = useRef<HTMLDivElement>(null)
	const socialBarRef = useRef<HTMLDivElement>(null)
	const [urlName, setUrlName] = useState('Tooltip')

	const followMouse = (ev: React.MouseEvent): void => {
		const top = socialBarRef.current?.getBoundingClientRect()?.top || ev.clientX

		if (tooltipRef.current) {
			tooltipRef.current.style.left = `${ev.clientX}px`
			tooltipRef.current.style.top = `${top - 50}px`
		}
	}
	const handleEnter = (e: React.MouseEvent, link: string) => {
		setUrlName(link)
		followMouse(e)
		tooltipRef.current?.classList.add(styles.tooltip_container_active)
	}
	const handleLeave = (e: React.MouseEvent) => {
		tooltipRef.current?.classList.remove(styles.tooltip_container_active)
	}

	return (
		<div
			className={styles.socialbar}
			style={{ fontSize: size }}
			ref={socialBarRef}
			onMouseOut={handleLeave}>
			{links.map((link, i) => (
				<Icon
					key={i}
					link={link.link}
					icon={link.icon}
					onEnter={e => handleEnter(e, link.link)}
				/>
			))}
			<div
				ref={tooltipRef}
				className={styles.tooltip_container}>
				<Tooltip content={urlName} />
			</div>
		</div>
	)
}

const Tooltip = ({ content }: { content: string }) => {
	const urlPrefix = content.includes('mailto') ? 'mailto:' : 'https://'

	const tooltipContent = content.split(urlPrefix)[1]
	return <div className={styles.tooltip}>{tooltipContent}</div>
}

export default SocialBar
