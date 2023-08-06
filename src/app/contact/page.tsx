import { SectionTitle } from '@/components/SectionTitle'
function Contact() {
	return (
		<section className='only-content'>
			<SectionTitle>Contact</SectionTitle>
			<div className='section-content'>
				<div className='section-content-image'></div>

				<div className='section-content-text'>
					<p>{`Feel free to contact me with any inquiries or project requests. I'm always happy to discuss potential collaborations or answer any questions you may have.`}</p>
					<p>{`You can reach me through the form below, or via the following email or in my social:`}</p>
					<p>
						<a href='mailto:cavera.de@gmail.com'>cavera.de@gmail.com</a>
					</p>
					<p>{`I look forward to hearing from you!`}</p>
				</div>
			</div>
		</section>
	)
}

export default Contact
