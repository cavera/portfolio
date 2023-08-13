import Link from 'next/link'
import { TProject } from '@/types/Types'
import styles from './projects.module.scss'

export const MoreLink = ({ filtered }: { filtered: boolean }) => {
	return (
		<>
			{filtered && (
				<div className={styles.more}>
					<Link
						href='/portfolio'
						className={styles.more_link}>
						More projects...
					</Link>
				</div>
			)}
		</>
	)
}
