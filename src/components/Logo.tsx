'use client'

import PropTypes from 'prop-types'
import React from 'react'
import { useReducer } from 'react'

interface Props {
	compact: 'vertical' | 'false' | 'true'
	className: any
	overlapGroupClassName: any
	leonardoFonseClassName: any
	caClassName: any
	riClassName: any
	veraClassName: any
}

export const Logo = ({ compact, className, overlapGroupClassName, leonardoFonseClassName, caClassName, riClassName, veraClassName }: Props): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, {
		compact: compact || 'true',
	})

	return (
		<div
			className={`logo ${state.compact} ${className}`}
			onMouseEnter={() => {
				dispatch('mouse_enter')
			}}
			onMouseLeave={() => {
				dispatch('mouse_leave')
			}}>
			{state.compact === 'true' && (
				<>
					<div className='ca'>ca</div>
					<div className='vera'>vera</div>
				</>
			)}

			{['false', 'vertical'].includes(state.compact) && (
				<div className={`overlap-group ${overlapGroupClassName}`}>
					{state.compact === 'false' && (
						<>
							<div className={`leonardo-fonse ${leonardoFonseClassName}`}>
								Leonardo
								<br />
								Fonse
							</div>
							<div className={`text-wrapper ${caClassName}`}>ca</div>
							<div className={`ri ${riClassName}`}>Ri</div>
							<div className={`div ${veraClassName}`}>vera</div>
						</>
					)}

					{state.compact === 'vertical' && (
						<>
							<div className='ca-2'>ca</div>
							<div className='vera-2'>vera</div>
						</>
					)}
				</div>
			)}
		</div>
	)
}

function reducer(state: any, action: any) {
	if (state.compact === 'false') {
		switch (action) {
			case 'mouse_leave':
				return {
					compact: 'vertical',
				}
		}
	}

	switch (action) {
		case 'mouse_enter':
			return {
				...state,
				compact: 'false',
			}
	}

	return state
}

Logo.propTypes = {
	compact: PropTypes.oneOf(['vertical', 'false', 'true']),
}
