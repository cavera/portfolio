import { config, fields, collection, singleton } from '@keystatic/core'

/**
 * Branches on a NEXT_PUBLIC_ var, not NODE_ENV alone and not the server-only
 * client id: this config is also bundled into the browser, where non-public
 * env vars are undefined — keying on KEYSTATIC_GITHUB_CLIENT_ID made the admin
 * UI silently fall back to local mode while the API route ran in GitHub mode.
 * The slug is only set where the GitHub App exists (Vercel Preview), so local
 * `pnpm dev` and any deploy without it stay on local storage.
 */
const useGithub =
	!!process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG &&
	process.env.NODE_ENV !== 'development'

export default config({
	storage: useGithub
		? {
				kind: 'github',
				repo: 'cavera/portfolio',
			}
		: { kind: 'local' },
	collections: {
		projects: collection({
			label: 'Projects',
			slugField: 'title',
			path: 'content/projects/*/',
			format: { contentField: 'caseEn' },
			schema: {
				title: fields.slug({
					name: { label: 'Title' },
					slug: { label: 'Slug', description: 'The URL segment — /work/<slug>. Editable independently so existing links never break.' },
				}),
				public: fields.checkbox({ label: 'Public', description: 'Unpublished entries never render or appear in the sitemap.', defaultValue: false }),
				sortOrder: fields.integer({ label: 'Sort order', description: 'Lower sorts first. Leave empty to sink below ordered entries.' }),
				year: fields.integer({ label: 'Year' }),
				img: fields.url({ label: 'Cover image URL', description: 'Cloudinary (or any stable, non-expiring) URL.' }),
				live: fields.url({ label: 'Live URL' }),
				code: fields.url({ label: 'Code URL' }),
				tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value || 'Tag' }),
				stack: fields.array(fields.text({ label: 'Stack item' }), { label: 'Stack', itemLabel: (props) => props.value || 'Item' }),
				en: fields.object(
					{
						kind: fields.text({ label: 'Kind', description: 'Short category shown on the card, e.g. "Frontend project".' }),
						desc: fields.text({ label: 'Description', multiline: true }),
						role: fields.text({ label: 'Role' }),
					},
					{ label: 'English' }
				),
				es: fields.object(
					{
						kind: fields.text({ label: 'Kind' }),
						desc: fields.text({ label: 'Description', multiline: true }),
						role: fields.text({ label: 'Role' }),
					},
					{ label: 'Spanish' }
				),
				translated: fields.checkbox({
					label: 'Translated',
					description: 'Only check this once real Spanish prose exists. Drives whether the Spanish URL advertises hreflang at all.',
					defaultValue: false,
				}),
				hasCase: fields.checkbox({ label: 'Has case study', description: 'A body can be drafted below without this being checked yet.', defaultValue: false }),
				caseEn: fields.markdoc({
					label: 'Case body (EN)',
					options: { image: { directory: 'public/images/work', publicPath: '/images/work/' } },
				}),
				caseEs: fields.markdoc({
					label: 'Case body (ES)',
					options: { image: { directory: 'public/images/work', publicPath: '/images/work/' } },
				}),
			},
		}),
	},
	singletons: {
		profile: singleton({
			label: 'Profile',
			path: 'content/profile',
			schema: {
				email: fields.text({ label: 'Email' }),
				photoProfile: fields.url({ label: 'Profile photo URL' }),
				aboutPortrait: fields.url({ label: 'About portrait URL' }),
				socials: fields.array(
					fields.object({ name: fields.text({ label: 'Name' }), url: fields.url({ label: 'URL' }) }),
					{ label: 'Socials', itemLabel: (props) => props.fields.name.value || 'Social' }
				),
				skills: fields.array(fields.text({ label: 'Skill' }), { label: 'Skills', itemLabel: (props) => props.value || 'Skill' }),
				certs: fields.array(fields.text({ label: 'Certification' }), { label: 'Certs', itemLabel: (props) => props.value || 'Cert' }),
				stats: fields.array(
					fields.object({
						n: fields.text({ label: 'Number', description: 'e.g. "15+", "EN/ES"' }),
						key: fields.text({ label: 'Label key', description: 'Matches an i18n string key (years / projects / langs).' }),
						acc: fields.checkbox({ label: 'Accent', defaultValue: false }),
					}),
					{ label: 'Stats', itemLabel: (props) => props.fields.n.value || 'Stat' }
				),
			},
		}),
		experience: singleton({
			label: 'Experience',
			path: 'content/experience',
			schema: {
				items: fields.array(
					fields.object({
						when: fields.text({ label: 'When' }),
						role: fields.text({ label: 'Role' }),
						co: fields.text({ label: 'Company' }),
						badge: fields.text({ label: 'Badge', description: 'Optional, e.g. "Current".' }),
						summaryEn: fields.text({ label: 'Summary (EN)', multiline: true }),
						summaryEs: fields.text({ label: 'Summary (ES)', multiline: true }),
					}),
					{ label: 'Items', itemLabel: (props) => `${props.fields.when.value} — ${props.fields.role.value}` }
				),
			},
		}),
		photos: singleton({
			label: 'Photos',
			path: 'content/photos',
			schema: {
				items: fields.array(
					fields.object({
						title: fields.text({ label: 'Title' }),
						aspect: fields.select({
							label: 'Aspect ratio',
							options: [
								{ label: '3 / 2', value: '3/2' },
								{ label: '2 / 3', value: '2/3' },
							],
							defaultValue: '3/2',
						}),
						link: fields.url({ label: '500px link' }),
						src: fields.url({ label: 'Image URL' }),
					}),
					{ label: 'Items', itemLabel: (props) => props.fields.title.value || 'Photo' }
				),
			},
		}),
	},
})
