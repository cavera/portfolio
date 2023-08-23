import { SectionTitle } from '@/components/SectionTitle'
import SocialBar from '@/components/SocialBar'
import { TITLES, CAVERA } from '@/data/consts'

export const metadata = {
	title: `${CAVERA.name}: ${TITLES.CONTACT}`,
}

function Contact() {
	return (
		<section className='only-content'>
			<SectionTitle>{TITLES.CONTACT}</SectionTitle>
			<div className='section-content'>
				<div className='section-content-image'></div>

				<div className='section-content-text'>
					<p>{`Feel free to contact me with any inquiries or project requests. I'm always happy to discuss potential collaborations or answer any questions you may have.`}</p>
					<p>{`You can reach me via the following social or email:`}</p>
					<SocialBar size={32} />
					<p>{`I look forward to hearing from you!`}</p>
				</div>
			</div>
		</section>
	)
}

export default Contact
