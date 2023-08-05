const { Client } = require('@notionhq/client')
import mockData from '../data/mocks/mockList.json'

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
	const response = await notion.pages.retrieve({ page_id: pageId })

	return response
}
export async function getPageContent(pageId: string) {
	const response = await notion.blocks.children.list({
		block_id: pageId,
		page_size: 50,
	})

	return response
}
