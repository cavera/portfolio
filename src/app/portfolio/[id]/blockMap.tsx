// import styles from './project.module.scss'

export interface Block {
	type: string
	text?: string
	url?: string
	code?: string
}

export type BlockComponent = (block: Block) => JSX.Element
export type BlockGroup = (blocks: Block[]) => any

export const groupBlocks: BlockGroup = blocks => {
	const grouped = blocks.reduce((acc: any, item: any) => {
		if (!item?.type) return null
		const { type } = item

		if (!acc[type]) {
			acc[type] = []
		}

		acc[type].push(item)

		return acc
	}, {})
	return grouped
}

export const blockMap: { [key: string]: BlockComponent } = {
	paragraph: (block: Block) => <p>{block.text}</p>,

	heading_1: (block: Block) => <h1>{block.text}</h1>,

	heading_2: (block: Block) => <h2>{block.text}</h2>,

	heading_3: (block: Block) => <h3>{block.text}</h3>,

	image: (block: Block) => (
		<img
			src={block.url}
			alt={block.text}
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

	embed: (block: Block) => <iframe src={block.url} />,

	video: (block: Block) => (
		<video controls>
			<source
				src={block.url}
				type='video/mp4'
			/>
		</video>
	),

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
