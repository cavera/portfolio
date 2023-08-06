import Image from 'next/image'
import styles from './ImageFrame.module.scss'
const ImageFrame = (props: any) => {
	const { src, alt, width, height, objectFit, priority } = props
	return (
		<div className={styles.image_frame}>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				objectFit={objectFit}
				priority={priority}
			/>
		</div>
	)
}

export default ImageFrame
