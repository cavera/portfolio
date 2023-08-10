const { Client } = require('@notionhq/client')
import mockData from '../data/mocks/mockList.json'
import mockCard from '../data/mocks/mockCard.json'
import mockCardContent from '../data/mocks/mockCardContent.json'

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN })

export async function getElements() {
	const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID
	try {
		const response = await notion.databases.query({
			database_id: databaseId,
			filter: {
				property: 'public',
				checkbox: {
					equals: true,
				},
			},
			sorts: [
				{
					timestamp: 'created_time',
					direction: 'ascending',
				},
				// {
				// 	timstamp: 'last_edited_time',
				// 	direction: 'descending',
				// },
			],
		})
		return response.results
	} catch (error) {
		return mockData.results
		throw new Error('error retreiving notion data')
	}
}
export async function getPageInfo(pageId: string) {
	try {
		const response = await notion.pages.retrieve({ page_id: pageId })

		return response
	} catch (error) {
		return mockCard
		throw new Error('error retreiving Page data')
	}
}
export async function getPageContent(pageId: string) {
	try {
		const response = await notion.blocks.children.list({
			block_id: pageId,
			page_size: 50,
		})

		return response
	} catch (error) {
		return mockCardContent
		throw new Error('error retreiving Page content')
	}
}
