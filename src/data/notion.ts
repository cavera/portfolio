import mockData from '../data/mocks/mockList.json'
import mockCard from '../data/mocks/mockCard.json'
import mockCardContent from '../data/mocks/mockCardContent.json'

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID

// NOTE: NOTION_TOKEN should NEVER be prefixed with NEXT_PUBLIC_
// It must be a server-side only environment variable
const notionToken = process.env.NOTION_TOKEN

if (!notionToken && process.env.NODE_ENV === 'production') {
  console.warn('NOTION_TOKEN is not set. Using fallback mock data.')
}

const headersList = {
  Accept: '*/*',
  'Notion-Version': '2022-06-28',
  Authorization: `Bearer ${notionToken || ''}`,
  'Content-Type': 'application/json',
}

const bodyContent = JSON.stringify({
  filter: {
    property: 'public',
    checkbox: {
      equals: true,
    },
  },
  sorts: [
    {
      timestamp: 'created_time',
      direction: 'descending',
    },
    {
      timestamp: 'last_edited_time',
      direction: 'descending',
    },
  ],
})

export async function getElements() {
  const databasePoint = `https://api.notion.com/v1/databases/${databaseId}/query`

  try {
    const response = await fetch(databasePoint, {
      method: 'POST',
      headers: headersList,
      body: bodyContent,
      // cache: 'no-cache',
      next: {
        revalidate: 60,
      },
    })

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error('Error retrieving notion data:', error)
    return mockData.results
  }
}
export async function getPageInfo(pageId: string) {
  const pagePoint = `https://api.notion.com/v1/pages/${pageId}`
  try {
    const response = await fetch(pagePoint, {
      method: 'GET',
      headers: headersList,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error retrieving page info:', error)
    return mockCard
  }
}
export async function getPageContent(pageId: string) {
  const pageContentPoint = `https://api.notion.com/v1/blocks/${pageId}/children`
  try {
    const response = await fetch(pageContentPoint, {
      method: 'GET',
      headers: headersList,
    })

    const data = await response.json()

    return data
  } catch (error) {
    return mockCardContent
    throw new Error('error retreiving Page content')
  }
}
