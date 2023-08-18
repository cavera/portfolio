import ImageFrame from '@/components/ImageFrame'
import { Block } from '@/types/Types'

export type BlockComponent = (block: Block) => JSX.Element
export type BlockGroup = (blocks: Block[]) => any

export const groupBlocks: BlockGroup = blocks => {
	const grouped = blocks?.reduce((acc: any, item: any) => {
		if (!item?.type) return null
		const { type } = item

		if (!acc[type]) acc[type] = []

		acc[type].push(item)

		return acc
	}, {})
	return grouped
}

export const blockMap: { [key: string]: BlockComponent } = {
	paragraph: (block: Block) => {
		if (!block.text || block.text.length < 1) return <></>
		return <p>{block.text}</p>
	},

	heading_1: (block: Block) => <h1>{block.text}</h1>,
	heading_2: (block: Block) => <h2>{block.text}</h2>,
	heading_3: (block: Block) => <h3>{block.text}</h3>,

	image: (block: Block) => (
		<ImageFrame
			src={block.url as string}
			alt={(block.text as string) || 'snapshoot'}
			quality={100}
			width={600}
			height={400}
			caption={block.caption}
		/>
	),

	bulleted_list_item: (block: Block) => <li>{block.text}</li>,
	numbered_list_item: (block: Block) => <li>{block.text}</li>,

	quote: (block: Block) => <blockquote>{block.text}</blockquote>,

	code: (block: Block) => (
		<pre>
			<code>{block.code}</code>
		</pre>
	),

	link_preview: (block: Block) => <a href={block.url}>{block.url}</a>,
	bookmark: (block: Block) => <a href={block.url}>{block.text}</a>,

	embed: (block: Block) => (
		<iframe
			src={block.url}
			height={'400'}
		/>
	),

	video: (block: Block) => {
		if (block?.url?.includes('youtu')) {
			return (
				<iframe
					src={block.url}
					height={'300'}
					title='YouTube video player'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
				/>
			)
		} else {
			return (
				<video controls>
					<source
						src={block?.url}
						type='video/mp4'
					/>
				</video>
			)
		}
	},
	audio: (block: Block) => (
		<audio controls>
			<source
				src={block.url}
				type='audio/mpeg'
			/>
		</audio>
	),

	pdf: (block: Block) => (
		<embed
			src={block.url}
			type='application/pdf'
		/>
	),
}
