import type { Lang } from '@/i18n/strings'

/**
 * Thin wrapper over the Notion REST API. Server-side only — it carries the
 * token. Mapping lives in `mapper.ts`; this file only fetches.
 *
 * Every call throws on failure rather than swallowing the error. `source.ts`
 * decides what to do about it (fall back to static content), so a broken CMS
 * shows up in the build log instead of silently emptying the site.
 */

const NOTION_VERSION = '2022-06-28'
const API = 'https://api.notion.com/v1'

export const notionConfigured = Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID)

function headers(): HeadersInit {
	return {
		Accept: 'application/json',
		'Notion-Version': NOTION_VERSION,
		Authorization: `Bearer ${process.env.NOTION_TOKEN ?? ''}`,
		'Content-Type': 'application/json',
	}
}

export interface NotionPage {
	id: string
	cover: { type: string; external?: { url: string }; file?: { url: string } } | null
	properties: Record<string, any>
}

async function post(path: string, body: unknown) {
	const res = await fetch(`${API}${path}`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify(body),
		next: { revalidate: 300 },
	})
	if (!res.ok) throw new Error(`Notion ${path} failed: ${res.status} ${res.statusText}`)
	return res.json()
}

async function get(path: string) {
	const res = await fetch(`${API}${path}`, { headers: headers(), next: { revalidate: 300 } })
	if (!res.ok) throw new Error(`Notion ${path} failed: ${res.status} ${res.statusText}`)
	return res.json()
}

/**
 * Publish gates differ by language, and that is deliberate.
 *
 * English pages use `public`, the same checkbox the current live site reads, so
 * the two sites agree on what is published. Spanish pages are kept
 * `public: false` forever — the live site filters on `public` alone and would
 * otherwise render them as duplicate entries. A Spanish page counts as
 * published when it has a slug and points at an English page.
 */
export async function queryProjects(lang: Lang): Promise<NotionPage[]> {
	const databaseId = process.env.NOTION_DATABASE_ID
	const filter =
		lang === 'en'
			? { and: [{ property: 'public', checkbox: { equals: true } }, { property: 'lang', select: { equals: 'en' } }] }
			: {
					and: [
						{ property: 'lang', select: { equals: 'es' } },
						{ property: 'slug', rich_text: { is_not_empty: true } },
						{ property: 'translation_of', relation: { is_not_empty: true } },
					],
				}

	const pages: NotionPage[] = []
	let cursor: string | undefined

	// Notion caps a page of results at 100. Paginate rather than silently
	// truncating once the database outgrows one page.
	do {
		const data = await post(`/databases/${databaseId}/query`, {
			filter,
			sorts: [{ timestamp: 'created_time', direction: 'descending' }],
			page_size: 100,
			...(cursor ? { start_cursor: cursor } : {}),
		})
		pages.push(...(data.results ?? []))
		cursor = data.has_more ? data.next_cursor : undefined
	} while (cursor)

	return pages
}

export async function getBlocks(pageId: string): Promise<any[]> {
	const blocks: any[] = []
	let cursor: string | undefined

	do {
		const qs = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100'
		const data = await get(`/blocks/${pageId}/children${qs}`)
		blocks.push(...(data.results ?? []))
		cursor = data.has_more ? data.next_cursor : undefined
	} while (cursor)

	return blocks
}
