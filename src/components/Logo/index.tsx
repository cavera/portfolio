// import styles from './Logo.module.scss'
import './Logo.scss'

export const Logo = (props: any) => {
	// const { logo_container, logo_name, logo_text, hidden, to_hide, normal } = styles
	return (
		<div className={`logo_container normal`}>
			<p className={`logo_name to_hide`}>Leonardo</p>

			<p>
				<span className={`logo_name to_hide`}>Fonse</span>
				<strong className={`logo_text`}>ca</strong>
				<strong className={`logo_text hidden`}>vera</strong>
			</p>

			<p>
				<span className={`logo_name to_hide`}>Ri</span>
				<strong className={`logo_text to_hide`}>vera</strong>
			</p>
		</div>
	)
}
