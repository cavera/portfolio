import { TProject } from "@/types/Types"
import styles from "./ProjectCard.module.scss"
import Tags from "../Tags"
import Link from "next/link"
import CTAs from "../CTAs"
import { DEFAULT_PROJECT_BG } from "@/data/consts"

export function ProjectCard({ project }: { project: TProject }) {
  const { cover, title, subtitle, live_link, source, skills, id } = project
  const imageSrc = cover || DEFAULT_PROJECT_BG

  return (
    <article className={styles.card}>
      <div className={styles.img_container}>
        <img
          src={imageSrc}
          alt={title || "Project cover image"}
        />
      </div>
      <div className={styles.project_info}>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <Tags skills={skills} />
      </div>
      <Link href={`/portfolio/${id}`} className={styles.card_link}>
        +
      </Link>
      <div className={styles.project_cta}>
        <CTAs source={source} live_link={live_link} />
      </div>
    </article>
  )
}
