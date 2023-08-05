import { TProject } from '@/types/Types'
import { Brands } from '../Icons/Brands'
import styles from './Button.module.scss'
import { OpenInBrowser } from 'iconoir-react'

type TButton = {
	type: 'primary' | 'secondary'
	link: TProject['live_link'] | TProject['source']
	text?: string
}

const brandsnames = Object.keys(Brands)

const Button = (props: TButton) => {
	const buttonUrl = props.link ? new URL(props.link.toString()) : undefined
	let icon: any

	function showIcon() {
		brandsnames.forEach(brand => {
			if (buttonUrl?.host.includes(brand)) {
				icon = Brands[brand]
			}
		})

		if (icon) {
			return icon()
		} else {
			return <OpenInBrowser />
		}
	}

	return (
		<a
			className={`${styles.button} ${styles[props.type]}`}
			href={props.link?.toString()}
			target='_blank'>
			{props.text}
			{showIcon()}
		</a>
	)
}

export default Button
