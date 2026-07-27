import Link from 'next/link'
import { defaultLocale, localePath } from '@/i18n/routing'

export default function NotFound() {
	return (
		<section>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link href={localePath(defaultLocale)}>Return Home</Link>
		</section>
	)
}
