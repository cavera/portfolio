import Button from '../Button'

type TCTA = {
	source?: string | null | undefined
	live_link?: string | null | undefined
}

const CTAs = ({ source, live_link }: TCTA) => (
	<>
		{source && (
			<Button
				type='secondary'
				link={source}
			/>
		)}
		{live_link && (
			<Button
				type='primary'
				text='Live'
				link={live_link}
			/>
		)}
	</>
)

export default CTAs
