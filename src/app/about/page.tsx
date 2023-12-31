import { SectionTitle } from '@/components/SectionTitle'
import ImageFrame from '@/components/ImageFrame'

import Button from '@/components/Button'
import { CV_URL, TITLES, CAVERA } from '@/data/consts'

export const metadata = {
  title: `${CAVERA.name}: ${TITLES.ABOUT}`,
  openGraph: {
    title: `${CAVERA.name}: ${TITLES.ABOUT}`,
    url: CAVERA.portfolio.url + '/about',
    images: [
      {
        url: `${CAVERA.about_image}`,
        width: 481,
        height: 555,
      },
    ],
    siteName: `${CAVERA.name}: ${TITLES.ABOUT}`,
    description: 'What sets me apart from other Front-end developers and UI designers is my ability to combine both design and development skills to create a seamless user experience.',
  },
}

async function About() {
  const cvurl = CV_URL

  return (
    <section className='only-content'>
      <SectionTitle>{TITLES.ABOUT}</SectionTitle>
      <div className='section-content'>
        <div className='section-content-image'>
          <ImageFrame
            src={CAVERA.about_image}
            alt='about'
            width={500}
            height={500}
            priority
          />
        </div>

        <div className='section-content-text'>
          <p>What sets me apart from other Front-end developers and UI designers is my ability to combine both design and development skills to create a seamless user experience. I believe that the best designs are not only visually appealing but are also intuitive and easy to use.</p>
          <p>I come from the world of e-learning, where the goal is always to make some type of knowledge didactic, interesting, and simple to learn. To that end, I create user interfaces that help provide this knowledge in a way that is unlike the normal dull and generic manner in which educational material is presented.</p>
          <p>If you want to know more about me, you can download my CV below. I hope you enjoy it too!</p>
          <div className='scroll-end'>
            <Button
              link={cvurl}
              type='primary'
              text='Download CV'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
