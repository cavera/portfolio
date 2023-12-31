import { blockMap } from './blockMap'
import { SectionTitle } from '@/components/SectionTitle'
import ImageFrame from '@/components/ImageFrame'
import CTAs from '@/components/CTAs'
import Tags from '@/components/Tags'
import EndOfSection from '../../../components/EndOfSection'
import { CAVERA, TITLES } from '@/data/consts'
import { Metadata, ResolvingMetadata } from 'next'
import { mapPageInfo } from '@/data/mapData'
import { groupBlocks } from './blockMap'

import styles from './project.module.scss'

type IdMetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const mappingData = async (id: string) => {
  const mappedData = await mapPageInfo(id)
  const groupOfBlocks = await groupBlocks(mappedData.blocks)

  const { blocks, cover, title, subtitle, live_link, source, skills } = mappedData
  const paragraph = groupOfBlocks?.paragraph
  const image = groupOfBlocks?.image
  const embed = groupOfBlocks?.embed

  return {
    blocks,
    cover,
    title,
    subtitle,
    live_link,
    source,
    skills,
    paragraph,
    image,
    embed,
  }
}

export async function generateMetadata({ params, searchParams }: IdMetadataProps): Promise<Metadata> {
  const id = params.id

  const { cover, title, subtitle } = await mappingData(id)

  return {
    title: `${CAVERA.nick}: ${TITLES.PORTFOLIO} | ${title}`,
    openGraph: {
      title: `${CAVERA.nick}: ${TITLES.PORTFOLIO} | ${title}`,
      description: `${subtitle}`,
      images: [`${cover}`],
    },
  }
}

async function Page({ params }: { params: { id: string } }) {
  const { id } = params

  const { blocks, cover, title, subtitle, live_link, source, skills, paragraph } = await mappingData(id)

  const renderParagraphs = () => (
    <div className={styles.project_texts}>
      {paragraph?.map((block: any) => {
        const Component = blockMap[block.type]
        return (
          <Component
            {...block}
            key={block.id}
          />
        )
      })}
      <Tags skills={skills} />
    </div>
  )

  const renderImagesAndObjects = () => (
    <div className={styles.other_content}>
      {blocks?.map((block: any) => {
        if (block.type === 'paragraph') return null
        const Component = blockMap[block.type]

        return (
          <Component
            {...block}
            key={block.id}
          />
        )
      })}
    </div>
  )

  return (
    <section className={styles.project}>
      {/* cover */}
      <div className={styles.title_block}>
        <SectionTitle>{title}</SectionTitle>
        <p>{subtitle}</p>
        <div className={styles.project_cta}>
          <CTAs
            source={source}
            live_link={live_link}
          />
        </div>
      </div>
      <div className={styles.cover_img}>
        <ImageFrame
          src={cover}
          alt={title}
          width={600}
          height={400}
          priority={true}
        />
      </div>
      {/* content */}
      {renderParagraphs()}
      {renderImagesAndObjects()}
      <EndOfSection />
    </section>
  )
}
export default Page
