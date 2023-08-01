import { getElements, getPageContent, getPageInfo } from '../data/notion'
export async function mapElementsData() {
	const data = await getElements()

	return data.map((page: { id: string; properties: any; cover: any }) => {
		const { id, properties, cover } = page
		const { title, subtitle, source, live_link, skills } = properties

		const mappedInfo = {
			cover: cover.file.url,
			name: title.title[0].plain_text,
			subtitle: subtitle?.rich_text[0]?.plain_text,
			source: source.url,
			live_link: live_link.url,
			skills: skills.multi_select.map((skill: { name: string }) => skill.name),
			id,
		}
		// console.log(mappedInfo)
		return mappedInfo
	})
}
