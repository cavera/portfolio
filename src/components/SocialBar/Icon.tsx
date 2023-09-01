export const Icon = (props: { link: string; icon: any }) => {
	return (
		<a
			href={props.link}
			target='_blank'
			rel='noopener noreferrer'>
			{<props.icon />}
		</a>
	)
}
