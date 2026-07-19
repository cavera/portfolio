'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
	theme: ThemeMode
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// Runs from a pre-hydration <script> in the document head so data-theme is
// set before first paint — avoids a light/dark flash on load.
export const themeInitScript = `(function(){try{var s=localStorage.getItem('pf_theme');var eff=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=eff;}catch(e){}})();`

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<ThemeMode>('dark')

	useEffect(() => {
		// themeInitScript already set this attribute pre-paint; adopt it.
		const current = (document.documentElement.dataset.theme as ThemeMode) || 'dark'
		setTheme(current)

		const sysDark = window.matchMedia('(prefers-color-scheme: dark)')
		const onSystemChange = () => {
			let saved: string | null = null
			try {
				saved = localStorage.getItem('pf_theme')
			} catch {}
			if (saved !== 'light' && saved !== 'dark') {
				const next: ThemeMode = sysDark.matches ? 'dark' : 'light'
				document.documentElement.dataset.theme = next
				setTheme(next)
			}
		}
		sysDark.addEventListener('change', onSystemChange)
		return () => sysDark.removeEventListener('change', onSystemChange)
	}, [])

	const toggleTheme = () => {
		const next: ThemeMode = theme === 'dark' ? 'light' : 'dark'
		document.documentElement.dataset.theme = next
		setTheme(next)
		try {
			localStorage.setItem('pf_theme', next)
		} catch {}
	}

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
