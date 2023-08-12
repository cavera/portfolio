import { SectionTitle } from '@/components/SectionTitle'
import { mapPageInfo } from '@/data/mapData'
import { blockMap, groupBlocks } from './blockMap'
import ImageFrame from '@/components/ImageFrame'
import CTAs from '@/components/CTAs'
import Tags from '@/components/Tags'

import EndOfSection from './EndOfSection'

import styles from './project.module.scss'

async function Page({ params }: { params: { id: string } }) {
	const { id } = params

	const mappedData = await mapPageInfo(id)
	const groupOfBlocks = groupBlocks(mappedData.blocks)

	const { blocks, cover, title, subtitle, live_link, source, skills } = mappedData
	const { paragraph, image, embed } = groupOfBlocks

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
