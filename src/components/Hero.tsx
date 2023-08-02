import { Logo } from './Logo'

const Hero = () => {
	return (
		<section className='hero'>
			<article>
				<Logo
					caClassName='logo-p-instance'
					className='logo-p'
					compact='false'
					leonardoFonseClassName='logo-instance'
					overlapGroupClassName='logo-p1'
					riClassName='logo-p1-instance'
					veraClassName='design-component-instance-node'
				/>
			</article>
			<article>
				<p>With 10+ years of experience designing user interfaces and interactions for virtual courses in Latin America. I am proficient in Figma, Adobe Illustrator, HTML, CSS, JavaScript, and GSAP. I am committed to continuous learning and growth, and I am able to bridge the gap between designers and programmers.</p>
			</article>
		</section>
	)
}

export default Hero
