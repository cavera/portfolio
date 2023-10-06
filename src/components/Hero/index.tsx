'use client'

import { useLayoutEffect, useRef } from 'react'
import { Logo } from '../Logo'
import SocialBar from '../SocialBar'
import { MouseScrollWheel } from 'iconoir-react'
import gsap from 'gsap'
import styles from './Hero.module.scss'
import Button from '../Button'
import { CV_URL } from '@/data/consts'

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const cvurl = CV_URL

  // gsap animations
  useLayoutEffect(() => {
    const speed = 0.3
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: speed,
      },
    })

    tl.to(sectionRef.current, {
      css: {
        visibility: 'visible',
      },
      duration: 0,
    })
      .fromTo(
        logoRef.current,
        {
          autoAlpha: 0,
          x: '-=30',
          duration: speed,
        },
        {
          autoAlpha: 1,
          x: 0,
        }
      )
      .fromTo(
        contentRef.current,
        {
          autoAlpha: 0,
          x: '+=30',
          duration: speed,
        },
        {
          autoAlpha: 1,
          x: 0,
        }
      )
      .add('social')
      .call(
        () => {
          logoRef.current?.querySelector('.logo_container')?.classList.remove('normal')
        },
        [],
        'social'
      )
      .fromTo(
        socialRef.current?.getElementsByTagName('a') as any,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.15,
          stagger: 0.1,
        },
        'social+=0.2'
      )
      .from(cvRef.current, {
        autoAlpha: 0,
        y: '+=20',
      })
      .from(
        scrollRef.current,
        {
          autoAlpha: 0,
          y: '+=30',
        },
        `+=${speed}`
      )
  }, [])
  return (
    <section
      className={styles.hero}
      style={{ visibility: 'hidden' }}
      ref={sectionRef}>
      <article
        className={styles.hero_logo}
        ref={logoRef}>
        <Logo />
      </article>
      <article
        className={styles.hero_content}
        ref={contentRef}>
        <p>Front-end developer with 10+ years of experience in designing and developing user interfaces for e-learning courses. Proven ability to create engaging, user-friendly experiences in the public and private sectors in Latin America. Expertise in CSS, HTML, React.js, Next.js, and GSAP. Self-learner with a passion for staying updated with evolving technologies and trends in front-end development and problem-solving.</p>
      </article>
      <aside
        className={styles.social}
        ref={socialRef}>
        <SocialBar size={32} />
      </aside>
      <div
        className={styles.CTA}
        ref={cvRef}>
        <Button
          link={cvurl}
          type='primary'
          text='Download CV'
        />
      </div>
      <div
        className={styles.scroll_icon}
        ref={scrollRef}>
        <MouseScrollWheel
          height={32}
          width={32}
        />
      </div>
    </section>
  )
}

export default Hero
