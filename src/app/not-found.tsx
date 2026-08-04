import Link from 'next/link'
import '../styles/globals.scss'
import '../styles/views.scss'

/**
 * The only not-found.tsx that actually renders in this app. A nested
 * app/[lang]/not-found.tsx was tried first — verified (clean .next rebuild,
 * both an explicit notFound() from work/[slug]/page.tsx and a plain
 * unmatched /en/... path) that Next 16 always bubbles to this root file
 * regardless of nesting, so that one was dead code and got removed.
 *
 * This route is statically prerendered at build time (see "○ /_not-found" in
 * the build output) — there is no request path available yet, so it cannot
 * know which locale the visitor wanted. A first attempt read the URL via
 * usePathname() client-side to pick a language, but that made the
 * server-rendered (English-default) and client-rendered (locale-corrected)
 * HTML disagree — a hydration mismatch (React error #418). Showing both
 * languages at once sidesteps the problem entirely: the output is identical
 * on server and client, so there is nothing to mismatch.
 */
export default function NotFound() {
	return (
		<div className='view notfound'>
			<h1>404</h1>
			<h2>Page not found · Página no encontrada</h2>
			<p>That page doesn&apos;t exist, or moved. · Esa página no existe, o se movió.</p>
			<div style={{ display: 'flex', gap: 10 }}>
				<Link
					className='btn fill'
					href='/en'>
					Home →
				</Link>
				<Link
					className='btn ghost'
					href='/es'>
					Inicio →
				</Link>
			</div>
		</div>
	)
}
