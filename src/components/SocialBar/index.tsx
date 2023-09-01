'use client'
import { useEffect, useRef } from 'react'
import { Mail } from 'iconoir-react'
import { Brands } from '../Icons/Brands'
import { Icon } from './Icon'
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

	useEffect(() => {
		//follow mouse
		// document.addEventListener('mousemove', e => {
		// 	if (tooltipRef.current) {
		// 		tooltipRef.current.style.left = `${e.clientX}px`
		// 		tooltipRef.current.style.top = `${e.clientY}px`
		// 	}
		// })
	}, [])
	return (
		<div
			className={styles.socialbar}
			style={{ fontSize: size }}>
			{links.map((link, i) => (
				<Icon
					key={i}
					link={link.link}
					icon={link.icon}
				/>
			))}
			{/* <div
				ref={tooltipRef}
				className={styles.tooltip_container}>
				<Tooltip content='tooltip' />
			</div> */}
		</div>
	)
}

const Tooltip = ({ content }: { content: string }) => {
	const urlPrefix = content.includes('mailto') ? 'mailto:' : 'https://'

	const tooltipContent = content.split(urlPrefix)[1]
	return <div className={styles.tooltip}>{tooltipContent}</div>
}

export default SocialBar
