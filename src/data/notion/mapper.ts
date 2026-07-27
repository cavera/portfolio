import { DEFAULT_PROJECT_BG } from '@/data/consts'
import type { Lang } from '@/i18n/strings'
import type { CaseStudy, Project } from '@/types/project'
import type { NotionPage } from './client'

// ---- property readers -------------------------------------------------
// Notion keys properties by their display name, so a rename in the UI silently
// turns these into undefined. Each reader returns a usable empty value instead
// of throwing, so one missing field never takes a page down.

const text = (p: any): string => p?.rich_text?.[0]?.plain_text ?? ''
const title = (p: any): string => p?.title?.[0]?.plain_text ?? ''
const url = (p: any): string | undefined => p?.url || undefined
const num = (p: any): number | null => (typeof p?.number === 'number' ? p.number : null)
const check = (p: any): boolean => p?.checkbox === true
const multi = (p: any): string[] => p?.multi_select?.map((o: { name: string }) => o.name) ?? []
const select = (p: any): string => p?.select?.name ?? ''
const relationIds = (p: any): string[] => p?.relation?.map((r: { id: string }) => r.id) ?? []

/**
 * Notion covers are either an external URL or a Notion-hosted file. The hosted
 * ones are signed S3 links that expire in about an hour, so they must not be
 * baked into a static page — prefer external, and fall back to the local
 * placeholder rather than shipping a link that will 404 by tomorrow.
 */
function cover(page: NotionPage): string {
	if (page.cover?.type === 'external' && page.cover.external?.url) return page.cover.external.url
	return DEFAULT_PROJECT_BG
}

/**
 * Case-study prose lives in the page body under four fixed headings, sectioned
 * by heading rather than stored in properties — long text in a Notion text
 * property is miserable to write and impossible to format.
 *
 *   ## Context   ## Role   ## Process   ## Outcome
 *
 * Process collects list items; the others collect paragraphs.
 *
 * Spanish headings are accepted too. A Spanish page written by someone typing
 * "## Contexto" should work — expecting an author to write English headings on
 * a Spanish page is the kind of hidden rule that quietly produces empty pages.
 */
const HEADINGS: Record<string, string> = {
	context: 'context',
	contexto: 'context',
	role: 'role',
	rol: 'role',
	papel: 'role',
	process: 'process',
	proceso: 'process',
	outcome: 'outcome',
	resultado: 'outcome',
	resultados: 'outcome',
}

export function mapCase(blocks: any[]): CaseStudy | undefined {
	const sections: Record<string, string[]> = {}
	let current = ''

	for (const block of blocks) {
		if (block.type === 'heading_2') {
			const raw = (block.heading_2?.rich_text?.[0]?.plain_text ?? '').trim().toLowerCase()
			current = HEADINGS[raw] ?? ''
			if (current) sections[current] ||= []
			continue
		}
		if (!current) continue

		const body =
			block.type === 'paragraph'
				? block.paragraph?.rich_text?.map((r: any) => r.plain_text).join('')
				: block.type === 'bulleted_list_item'
					? block.bulleted_list_item?.rich_text?.map((r: any) => r.plain_text).join('')
					: block.type === 'numbered_list_item'
						? block.numbered_list_item?.rich_text?.map((r: any) => r.plain_text).join('')
						: ''

		if (body?.trim()) sections[current].push(body.trim())
	}

	const context = sections.context?.join('\n\n') ?? ''
	const role = sections.role?.join('\n\n') ?? ''
	const process = sections.process ?? []
	const outcome = sections.outcome?.join('\n\n') ?? ''

	// A case study with no prose at all is not a case study. Returning undefined
	// keeps the UI from opening an empty overlay.
	if (!context && !role && !process.length && !outcome) return undefined

	return { context, role, process, outcome }
}

export function mapProject(page: NotionPage, lang: Lang, translated: boolean): Project {
	const p = page.properties ?? {}
	const year = num(p.year)

	return {
		id: text(p.slug) || page.id,
		title: title(p.title),
		img: cover(page),
		kind: text(p.subtitle),
		desc: text(p.desc),
		tags: multi(p.skills),
		year: year === null ? '' : String(year),
		live: url(p.live_link),
		code: url(p.source),
		hasCase: check(p.has_case),
		role: text(p.role),
		stack: multi(p.stack),
		translated,
		lang,
	}
}

export const projectLang = (page: NotionPage): string => select(page.properties?.lang)
export const translationOf = (page: NotionPage): string[] => relationIds(page.properties?.translation_of)
export const sortOrder = (page: NotionPage): number | null => num(page.properties?.sort_order)
