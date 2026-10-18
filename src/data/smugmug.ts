import assert from 'node:assert'
import { createHmac, randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'

/**
 * SmugMug API v2 client — OAuth 1.0a signed GET requests only.
 *
 * Server-only. Reads SMUGMUG_API_KEY / SMUGMUG_API_SECRET / SMUGMUG_OAUTH_TOKEN /
 * SMUGMUG_OAUTH_TOKEN_SECRET from the environment; the access token pair was
 * obtained once via the OAuth 1.0a handshake and is permanent, so there's no
 * login flow here — every call just signs with all four values.
 *
 * Not wired into the app yet. See scripts/smugmug.ts for a CLI that dumps
 * results as JSON for review, and docs/CMS-KEYSTATIC-PLAN.md-adjacent plan
 * for how this feeds into content/photos.yaml.
 *
 * ponytail: get() uses a plain fetch() with no cache option — do not add
 * `next: { revalidate }`. Next's fetch cache keys on headers, and the
 * Authorization header carries a fresh oauth_nonce/oauth_timestamp on every
 * call, so the key never repeats and the cache never hits. If a page ever
 * needs runtime freshness, wrap the *calling function* in
 * `unstable_cache(fn, [key], { revalidate })` instead, so the varying header
 * stays inside the cached body.
 */

const API_ROOT = 'https://api.smugmug.com'

// -- OAuth 1.0a signing -----------------------------------------------------

// encodeURIComponent leaves !*'() unescaped; RFC 3986 (and OAuth's percent
// encoding requirement) wants those escaped too. This is the single most
// common place a hand-rolled OAuth signer breaks.
function rfc3986(input: string): string {
	return encodeURIComponent(input).replace(/[!*'()]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

function buildBaseString(method: string, url: string, params: Record<string, string>): string {
	const normalizedParams = Object.entries(params)
		.map(([k, v]) => [rfc3986(k), rfc3986(v)] as const)
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([k, v]) => `${k}=${v}`)
		.join('&')
	return [method.toUpperCase(), rfc3986(url), rfc3986(normalizedParams)].join('&')
}

function sign(baseString: string, consumerSecret: string, tokenSecret: string): string {
	const key = `${rfc3986(consumerSecret)}&${rfc3986(tokenSecret)}`
	return createHmac('sha1', key).update(baseString).digest('base64')
}

interface Credentials {
	consumerKey: string
	consumerSecret: string
	token: string
	tokenSecret: string
}

function readCredentials(): Credentials {
	const consumerKey = process.env.SMUGMUG_API_KEY
	const consumerSecret = process.env.SMUGMUG_API_SECRET
	const token = process.env.SMUGMUG_OAUTH_TOKEN
	const tokenSecret = process.env.SMUGMUG_OAUTH_TOKEN_SECRET

	const missing = Object.entries({
		SMUGMUG_API_KEY: consumerKey,
		SMUGMUG_API_SECRET: consumerSecret,
		SMUGMUG_OAUTH_TOKEN: token,
		SMUGMUG_OAUTH_TOKEN_SECRET: tokenSecret,
	})
		.filter(([, v]) => !v)
		.map(([k]) => k)
	if (missing.length) throw new Error(`SmugMug credentials missing: ${missing.join(', ')}`)

	return { consumerKey: consumerKey!, consumerSecret: consumerSecret!, token: token!, tokenSecret: tokenSecret! }
}

function authHeader(method: string, url: string, queryParams: Record<string, string>, creds: Credentials): string {
	const oauthParams: Record<string, string> = {
		oauth_consumer_key: creds.consumerKey,
		oauth_token: creds.token,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: String(Math.floor(Date.now() / 1000)),
		oauth_nonce: randomBytes(16).toString('hex'),
		oauth_version: '1.0',
	}
	// The signature covers every param regardless of whether it ends up in
	// the query string or the Authorization header — query params included.
	const baseString = buildBaseString(method, url, { ...queryParams, ...oauthParams })
	const signature = sign(baseString, creds.consumerSecret, creds.tokenSecret)

	const headerParams = { ...oauthParams, oauth_signature: signature }
	const header = Object.entries(headerParams)
		.map(([k, v]) => `${rfc3986(k)}="${rfc3986(v)}"`)
		.join(', ')
	return `OAuth ${header}`
}

// -- Transport ----------------------------------------------------------

/**
 * Generic signed GET. Exported (not just used internally) so the CLI's
 * `raw` command can hit an arbitrary path and print the unmapped response —
 * useful for eyeballing exactly what SmugMug returns before trusting a
 * mapping function's shape.
 */
export async function request<T = unknown>(path: string, params: Record<string, string> = {}): Promise<T> {
	const creds = readCredentials()
	const url = `${API_ROOT}${path}`
	const query = { _verbosity: '1', ...params }
	const authorization = authHeader('GET', url, query, creds)
	const qs = new URLSearchParams(query).toString()

	const res = await fetch(`${url}?${qs}`, {
		headers: { Accept: 'application/json', Authorization: authorization },
	})
	if (!res.ok) {
		throw new Error(`SmugMug ${path} failed: ${res.status} ${res.statusText}`)
	}
	return res.json() as Promise<T>
}

// -- Domain functions ---------------------------------------------------
//
// Response shapes below were checked against a live account (not guessed from
// docs) via `pnpm smugmug raw <path>`. Two things the docs/sketch got wrong
// in practice, on this account/plan:
//   - `_expand` returns an empty Expansions object on every endpoint tried
//     (!authuser?_expand=UserAlbums, !images?_expand=ImageSizes) — dropped
//     entirely in favor of following the plain Uris SmugMug already returns.
//   - The full-size-URLs endpoint is `!sizes`, not `!imagesizes`, and it needs
//     the composite id (`{ImageKey}-{Serial}`, e.g. "mCPq6LZ-0"), not the bare
//     ImageKey — SmugMug hands back the exact path in AlbumImage.Uris.ImageSizes,
//     so that's threaded through rather than reconstructed by hand.

export interface AlbumSummary {
	albumKey: string
	name: string
	urlPath: string
	imageCount: number
}

interface SmugMugAlbumNode {
	AlbumKey?: string
	Name?: string
	UrlPath?: string
	ImageCount?: number
}

interface SmugMugAlbumsPage {
	Response?: { Album?: SmugMugAlbumNode[]; Pages?: { Total: number } }
}

/**
 * All albums for the authenticated user. Two calls: !authuser for the
 * nickname (no SMUGMUG_USERNAME env var needed), then the paginated
 * !albums listing — SmugMug's default page size is 50.
 */
export async function listAlbums(): Promise<AlbumSummary[]> {
	const authuser = await request<{ Response?: { User?: { NickName?: string } } }>('/api/v2!authuser')
	const nickname = authuser.Response?.User?.NickName
	if (!nickname) throw new Error('SmugMug !authuser response had no NickName')

	const albums: AlbumSummary[] = []
	const pageSize = 100
	let start = 1
	for (;;) {
		const data = await request<SmugMugAlbumsPage>(`/api/v2/user/${nickname}!albums`, {
			start: String(start),
			count: String(pageSize),
		})
		const page = data.Response?.Album ?? []
		albums.push(
			...page
				.filter((node): node is Required<Pick<SmugMugAlbumNode, 'AlbumKey'>> & SmugMugAlbumNode =>
					Boolean(node.AlbumKey),
				)
				.map((node) => ({
					albumKey: node.AlbumKey!,
					name: node.Name ?? '',
					urlPath: node.UrlPath ?? '',
					imageCount: node.ImageCount ?? 0,
				})),
		)
		const total = data.Response?.Pages?.Total ?? page.length
		if (page.length === 0 || start + page.length > total) break
		start += pageSize
	}
	return albums
}

export interface ImageSizes {
	thumb: string
	medium: string
	large: string
	x3large: string
}

interface SmugMugImageSizesNode {
	ThumbImageUrl?: string
	MediumImageUrl?: string
	LargeImageUrl?: string
	X3LargeImageUrl?: string
}

function mapSizes(node: SmugMugImageSizesNode): ImageSizes {
	return {
		thumb: node.ThumbImageUrl ?? '',
		medium: node.MediumImageUrl ?? '',
		large: node.LargeImageUrl ?? '',
		x3large: node.X3LargeImageUrl ?? '',
	}
}

export interface AlbumImage {
	imageKey: string
	title: string
	caption: string
	thumb: string
	/** Pass straight to getImageSizes() — SmugMug's own link, not reconstructed. */
	sizesPath: string
}

interface SmugMugAlbumImageNode {
	ImageKey?: string
	Title?: string
	Caption?: string
	ThumbnailUrl?: string
	Uris?: { ImageSizes?: string }
}

/** Images in one album. Sizes are NOT fetched here — that's a separate call per chosen image, see getImageSizes(). */
export async function listAlbumImages(albumKey: string): Promise<AlbumImage[]> {
	const data = await request<{ Response?: { AlbumImage?: SmugMugAlbumImageNode[] } }>(
		`/api/v2/album/${albumKey}!images`,
	)
	const images = data.Response?.AlbumImage ?? []

	return images
		.filter(
			(img): img is Required<Pick<SmugMugAlbumImageNode, 'ImageKey'>> & SmugMugAlbumImageNode =>
				Boolean(img.ImageKey) && Boolean(img.Uris?.ImageSizes),
		)
		.map((img) => ({
			imageKey: img.ImageKey!,
			title: img.Title ?? '',
			caption: img.Caption ?? '',
			thumb: img.ThumbnailUrl ?? '',
			sizesPath: img.Uris!.ImageSizes!,
		}))
}

/** Full-size URLs for one image. Takes the sizesPath from listAlbumImages(), e.g. "/api/v2/image/mCPq6LZ-0!sizes". */
export async function getImageSizes(sizesPath: string): Promise<ImageSizes> {
	const data = await request<{ Response?: { ImageSizes?: SmugMugImageSizesNode } }>(sizesPath)
	return mapSizes(data.Response?.ImageSizes ?? {})
}

// -- Self-check -----------------------------------------------------------

function demo() {
	// RFC 5849 §1.2's worked example (the "Jane / printer.example.com /
	// photos.example.net" temporary-credentials request) — the OAuth 1.0a spec's
	// own test vector, independently re-verified before being hardcoded here.
	// Verifies percent-encoding, param sorting, and the HMAC key format: the
	// three places a hand-rolled signer most commonly breaks, without needing
	// real SmugMug credentials or a network call.
	const baseString = buildBaseString('POST', 'https://photos.example.net/initiate', {
		oauth_consumer_key: 'dpf43f3p2l4k3l03',
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: '137131200',
		oauth_nonce: 'wIjqoS',
		oauth_callback: 'http://printer.example.com/ready',
	})
	const expectedBaseString =
		'POST&https%3A%2F%2Fphotos.example.net%2Finitiate&oauth_callback%3Dhttp%253A%252F%252Fprinter.example.com%252Fready%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3DwIjqoS%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D137131200'
	assert.strictEqual(baseString, expectedBaseString, `base string mismatch:\n  got:      ${baseString}\n  expected: ${expectedBaseString}`)

	// Temporary-credentials request has no token secret yet, so the signing
	// key's second half is empty — the spec's own edge case for that field.
	const signature = sign(baseString, 'kd94hf93k423kf44', '')
	const expectedSignature = '74KNZJeDHnMBp0EMJ9ZHt/XKycU='
	assert.strictEqual(signature, expectedSignature, `signature mismatch: got ${signature}, expected ${expectedSignature}`)

	console.log('OAuth signer self-check passed.')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	demo()
}
