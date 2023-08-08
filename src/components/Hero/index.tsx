import { Logo } from '../Logo'
import SocialBar from '../SocialBar'
import { MouseScrollWheel } from 'iconoir-react'

import styles from './Hero.module.scss'

const Hero = () => {
	return (
		<section className={styles.hero}>
			<article className={styles.hero_logo}>
				<Logo />
			</article>
			<article className={styles.hero_content}>
				<p>With 10+ years of experience designing user interfaces and interactions for virtual courses in Latin America. I am proficient in Figma, Adobe Illustrator, HTML, CSS, JavaScript, and GSAP. I am committed to continuous learning and growth, and I am able to bridge the gap between designers and programmers.</p>
				<SocialBar size={32} />
			</article>
			<div className={styles.scroll_icon}>
				<MouseScrollWheel
					height={32}
					width={32}
				/>
			</div>
		</section>
	)
}

export default Hero
