import type { Lang } from './strings'

export const locales = ['en', 'es'] as const satisfies readonly Lang[]
export const defaultLocale: Lang = 'en'

export function isLocale(value: string): value is Lang {
	return (locales as readonly string[]).includes(value)
}

/**
 * Section paths are stored without a locale ('' for home, '/work', …) and get
 * one prefixed on the way out. Option A in `docs/CMS.md`: the segments stay
 * English in both locales, only the locale prefix changes. Moving to localized
 * segments later ('/es/trabajo') is a redirect map, not a rewrite.
 */
export function localePath(lang: Lang, path = ''): string {
	return `/${lang}${path}`
}

/** Strips the locale prefix off a pathname: '/es/work' -> '/work'. */
export function stripLocale(pathname: string): string {
	const [, first, ...rest] = pathname.split('/')
	if (first && isLocale(first)) return rest.length ? `/${rest.join('/')}` : ''
	return pathname === '/' ? '' : pathname
}

/**
 * `alternates` for Next's metadata. Emitted per page so a locale can be left
 * out when it has no real translation — advertising an `hreflang="es"` URL
 * that serves English is a worse signal than emitting nothing.
 */
export function alternates(lang: Lang, path = '', available: readonly Lang[] = locales) {
	const languages = Object.fromEntries(available.map((l) => [l, localePath(l, path)]))

	return {
		canonical: localePath(lang, path),
		languages: { ...languages, 'x-default': localePath(defaultLocale, path) },
	}
}
