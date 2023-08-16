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
	const urlPrefix = content.includes('mailto') ? 'mailto:' : 'https://'

	const tooltipContent = content.split(urlPrefix)[1]
	return <div className={styles.tooltip}>{tooltipContent}</div>
}
