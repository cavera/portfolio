import { getElements, getPageContent, getPageInfo } from '../data/notion'
import { DEFAULT_PROJECT_BG } from './consts'
import { ParsedBlock } from '@/types/Types'

export const revalidate = 60

export async function mapElementsData() {
	const data = await getElements()

	return data.map((page: { id: string; properties: any; cover: any }) => {
		const { id, properties, cover } = page
		const { title, subtitle, source, live_link, skills, featured } = properties
		const isCoverExternal = cover?.type === 'external'
		const coverSource = isCoverExternal ? cover?.external?.url : cover?.file?.url

		const mappedInfo = {
			cover: coverSource || DEFAULT_PROJECT_BG,
			title: title?.title[0].plain_text,
			subtitle: subtitle?.rich_text[0]?.plain_text,
			source: source?.url,
			live_link: live_link?.url,
			skills: skills?.multi_select.map((skill: { name: string }) => skill.name),
			id,
			featured: featured?.checkbox,
		}
		// console.log(mappedInfo)
		return mappedInfo
	})
}

export async function mapPageContent(id: string) {
	const data = await getPageContent(id)
	return data
}

export async function mapPageInfo(id: string) {
	const data = await getPageInfo(id)
	const pageBlocks = await mapPageContent(id)

	const { cover, properties } = data
	const { title, subtitle, live_link, source, skills } = properties

	const blockParsers: { [key: string]: (block: any) => ParsedBlock } = {
		paragraph: (block: any) => ({
			type: block.type,
			text: block.paragraph?.rich_text[0]?.plain_text,
			id: block.id,
		}),

		embed: (block: any) => ({
			type: block.type,
			url: block.embed?.url,
			id: block.id,
		}),

		image: (block: any) => ({
			type: block.type,
			url: block.image?.file.url,
			caption: block.image?.caption[0]?.plain_text,
			id: block.id,
		}),

		link_preview: (block: any) => ({
			type: block.type,
			url: block.link_preview?.url,
			id: block.id,
		}),

		video: (block: any) => ({
			type: block.type,
			url: block.video?.external.url,
			id: block.id,
			caption: block.video?.caption,
		}),
	}

	const blocks = pageBlocks?.results?.map((block: any) => {
		const parser = blockParsers[block.type]
		if (parser) {
			return parser(block)
		}

		return {
			type: block.type,
		}
	})

	const isCoverExternal = cover?.type === 'external'
	const coverSource = isCoverExternal ? cover?.external?.url : cover?.file?.url

	const mappedInfo = {
		cover: coverSource || DEFAULT_PROJECT_BG,
		title: title.title[0]?.plain_text,
		subtitle: subtitle?.rich_text[0]?.plain_text,
		live_link: live_link?.url,
		source: source?.url,
		blocks: blocks,
		skills: skills?.multi_select.map((skill: { name: string }) => skill.name),
	}

	return mappedInfo
}
