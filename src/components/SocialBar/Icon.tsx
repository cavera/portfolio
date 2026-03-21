type SocialIcon = {
	link: string
	icon: any
	onEnter: (e: React.MouseEvent<Element, MouseEvent>) => void
}

const getPlatformName = (url: string): string => {
	if (url.includes('mailto:')) return 'Email'
	const domain = new URL(url).hostname.replace('www.', '')
	return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
}

export const Icon = (props: SocialIcon) => {
	const platformName = getPlatformName(props.link)

	return (
		<a
			href={props.link}
			target='_blank'
			rel='noopener noreferrer'
			aria-label={`Visit ${platformName}`}
			title={`Visit ${platformName}`}
			onMouseOver={e => props.onEnter(e)}>
			{<props.icon />}
		</a>
	)
}
