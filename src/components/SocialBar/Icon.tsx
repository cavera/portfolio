import styles from './SocialBar.module.scss'

export const Icon = (props: { link: string; icon: any }) => {
	return (
		<a
			href={props.link}
			target='_blank'
			rel='noopener noreferrer'>
			{<props.icon />}
			<Tooltip content={props.link} />
		</a>
	)
}
const Tooltip = ({ content }: { content: string }) => {
	const tooltipContent = content.includes('mailto') ? content.split('mailto:')[1] : content.split('://')[1]
	return <div className={styles.tooltip}>{tooltipContent}</div>
}
