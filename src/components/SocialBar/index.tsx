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
		link: 'https://www.behance.net/cavera',
	},
	{
		icon: Brands.linkedin,
		link: 'https://www.linkedin.com/in/leonardo-ui/',
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
		</div>
	)
}

export default SocialBar
