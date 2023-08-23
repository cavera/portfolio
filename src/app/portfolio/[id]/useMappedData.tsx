import { mapPageInfo } from '@/data/mapData'
import { groupBlocks } from './blockMap'

export const useMappedData = async (id: string) => {
	const mappedData = await mapPageInfo(id)
	const groupOfBlocks = groupBlocks(mappedData.blocks)

	const { blocks, cover, title, subtitle, live_link, source, skills } = mappedData
	const { paragraph, image, embed } = groupOfBlocks

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
