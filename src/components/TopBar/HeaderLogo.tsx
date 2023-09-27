import Link from 'next/link'
import styles from './TopBar.module.scss'
import { ROL, ALSO } from '@/data/consts'

export const HeaderLogo = () => {
  return (
    <div className={styles.header_logo}>
      <Link href='/'>
        <h1 className={styles.h1}>
          <span>ca</span>
          <span>vera</span>
        </h1>
      </Link>
      <h2 className={styles.h2}>
        <Role>{ROL}</Role> {'('}
        <Also>{ALSO}</Also>
        {' too)'}
      </h2>
    </div>
  )
}

const Role = ({ children }: { children: string }) => {
  return <span className={styles.role_main}>{children}</span>
}
const Also = ({ children }: { children: string }) => {
  return <span className='role-also'>{children}</span>
}
