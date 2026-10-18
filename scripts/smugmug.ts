import { getImageSizes, listAlbumImages, listAlbums, request } from '../src/data/smugmug.ts'

async function main() {
	const [cmd, arg] = process.argv.slice(2)
	let result: unknown

	switch (cmd) {
		case 'albums':
			result = await listAlbums()
			break
		case 'images':
			if (!arg) throw new Error('usage: pnpm smugmug images <AlbumKey>')
			result = await listAlbumImages(arg)
			break
		case 'sizes':
			// Takes the `sizesPath` an `images` call already returned for this
			// image (e.g. "/api/v2/image/mCPq6LZ-0!sizes") — not a bare ImageKey.
			if (!arg) throw new Error('usage: pnpm smugmug sizes <sizesPath>  (from the "images" command\'s output)')
			result = await getImageSizes(arg)
			break
		case 'raw':
			// ponytail: bypasses the domain mappings in smugmug.ts entirely —
			// exists to eyeball an unmapped response before trusting a mapping.
			if (!arg) throw new Error('usage: pnpm smugmug raw <path>  (e.g. /api/v2!authuser)')
			result = await request(arg)
			break
		default:
			throw new Error(`unknown command "${cmd}". usage: pnpm smugmug <albums|images|sizes|raw> [arg]`)
	}

	console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err)
	process.exit(1)
})
