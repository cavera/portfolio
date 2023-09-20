import styles from './ImageFrame.module.scss'

const ImageFrame = (props: any) => {
  const { src, alt, caption = '' } = props
  return (
    <div className={styles.image_frame}>
      <img
        src={src}
        alt={alt}
      />

      {caption.length < 1 ? <p>{caption}</p> : null}
    </div>
  )
}

export default ImageFrame
