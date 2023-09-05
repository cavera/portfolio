'use client'
import { useRef, useState } from 'react'
import { Icon } from './Icon'
import styles from './SocialBar.module.scss'
import { CAVERA } from '@/data/consts'

const SocialBar = ({ size }: { size: number }) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const socialBarRef = useRef<HTMLDivElement>(null)
  const [urlName, setUrlName] = useState('Tooltip')

  const followMouse = (ev: React.MouseEvent): void => {
    const top = socialBarRef.current?.getBoundingClientRect()?.top || ev.clientX

    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${ev.clientX}px`
      tooltipRef.current.style.top = `${top - 50}px`
    }
  }
  const handleEnter = (e: React.MouseEvent, link: string) => {
    setUrlName(link)
    followMouse(e)
    tooltipRef.current?.classList.add(styles.tooltip_container_active)
  }
  const handleLeave = (e: React.MouseEvent) => {
    tooltipRef.current?.classList.remove(styles.tooltip_container_active)
  }

  return (
    <div
      className={styles.socialbar}
      style={{ fontSize: size }}
      ref={socialBarRef}
      onMouseOut={handleLeave}>
      {CAVERA?.links.map((link, i) => (
        <Icon
          key={i}
          link={link.link}
          icon={link.icon}
          onEnter={e => handleEnter(e, link.link)}
        />
      ))}

      <div
        ref={tooltipRef}
        className={styles.tooltip_container}>
        <Tooltip content={urlName} />
      </div>
    </div>
  )
}

const Tooltip = ({ content }: { content: string }) => {
  const urlPrefix = content.includes('mailto') ? 'mailto:' : 'https://'

  const tooltipContent = content.split(urlPrefix)[1]
  return <div className={styles.tooltip}>{tooltipContent}</div>
}

export default SocialBar
