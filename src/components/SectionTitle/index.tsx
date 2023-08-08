import style from './SectionTitle.module.scss'

const SectionTitle = ({ children }: { children: string }) => {
	return (
		<div className={style.section_title}>
			<h1>{children}</h1>
		</div>
	)
}

export { SectionTitle }
