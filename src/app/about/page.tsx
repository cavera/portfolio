import { SectionTitle } from '@/components/SectionTitle'
import ImageFrame from '@/components/ImageFrame'

import { getPageContent } from '@/data/notion'
import Button from '@/components/Button'
import { CV_BLOCK_ID } from '@/data/consts'

async function About() {
	const cvId: string = CV_BLOCK_ID

	const cvData = await getPageContent(cvId)
	const url = cvData.results[0]?.file.file.url
	return (
		<section className='only-content'>
			<SectionTitle>About</SectionTitle>
			<div className='section-content'>
				<div className='section-content-image'>
					<ImageFrame
						src='https://res.cloudinary.com/dwrxp5sqk/image/upload/v1691101258/cavera/profile_about.jpg'
						alt='about'
						width={500}
						height={500}
						priority
					/>
				</div>

				<div className='section-content-text'>
					<p>What sets me apart from other UI designers and Front-end developers is my ability to combine both design and development skills to create a seamless user experience. I believe that the best designs are not only visually appealing but are also intuitive and easy to use.</p>
					<p>I come from the world of e-learning, where the goal is always to make some type of knowledge didactic, interesting, and simple to learn. To that end, I create user interfaces that help provide this knowledge in a way that is unlike the normal dull and generic manner in which educational material is presented.</p>
					<p>If you want to know more about me, you can download my CV below. I hope you enjoy it too!</p>
					<Button
						link={url}
						type='primary'
						text='Download CV'
					/>
				</div>
			</div>
		</section>
	)
}

export default About
