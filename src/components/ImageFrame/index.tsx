import styles from './ImageFrame.module.scss'

const ImageFrame = (props: any) => {
	const { src, alt } = props
	return (
		<div className={styles.image_frame}>
			<img
				src={src}
				alt={alt}
			/>
		</div>
	)
}

export default ImageFrame
