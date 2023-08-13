'use client'

import { useLayoutEffect } from 'react'

const EndOfSection = () => {
	useLayoutEffect(() => {
		document.documentElement.scrollTo(0, 0)
		// console.log('scrolltop')
	}, [])
	return <div></div>
}

export default EndOfSection
