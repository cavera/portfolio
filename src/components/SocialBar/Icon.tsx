type SocialIcon = {
	link: string
	icon: any
	onEnter: (e: React.MouseEvent<Element, MouseEvent>) => void
}

export const Icon = (props: SocialIcon) => {
	return (
		<a
			href={props.link}
			target='_blank'
			rel='noopener noreferrer'
			onMouseOver={e => props.onEnter(e)}>
			{<props.icon />}
		</a>
	)
}
