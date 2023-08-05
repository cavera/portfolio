import { SectionTitle } from '@/components/SectionTitle'
import { mapPageInfo } from '@/data/mapData'
import { blockMap, groupBlocks } from './blockMap'
import Button from '@/components/Button'

import styles from './project.module.scss'

async function Page({ params }: { params: { id: string } }) {
	const { id } = params

	const mappedData = await mapPageInfo(id)
	const groupOfBlocks = groupBlocks(mappedData.blocks)

	// console.log(groupOfBlocks)
	// console.log(mappedData.blocks)

	const { blocks, cover, title, subtitle, live_link, source } = mappedData
	const { paragraph, image, embed } = groupOfBlocks

	// console.log(paragraph)
	// console.log(image)

	return (
		<section className={styles.project}>
			<div className={styles.cover}>
				<div className={styles.title_block}>
					<SectionTitle>{title}</SectionTitle>
					<p>{subtitle}</p>
					<div className={styles.project_cta}>
						{source && (
							<Button
								type='secondary'
								link={source}
							/>
						)}
						{live_link && (
							<Button
								type='primary'
								text='Live'
								link={live_link}
							/>
						)}
					</div>
				</div>
				<div className={styles.cover_img}>
					<img
						src={cover}
						alt={title}
					/>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.project_texts}>
					{paragraph?.map((block: any) => {
						const Component = blockMap[block.type]
						return <Component {...block} />
					})}
				</div>
				{/* <div>
				{image?.map((block: any) => {
					const Component = blockMap[block.type]
					return <Component {...block} />
				})}
			</div> */}

				<div className={styles.other_content}>
					{blocks?.map((block: any) => {
						if (block.type === 'paragraph') return null
						const Component = blockMap[block.type]
						return <Component {...block} />
					})}
				</div>
			</div>
		</section>
	)
}
export default Page
