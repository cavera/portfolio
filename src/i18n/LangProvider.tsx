'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Lang, strings, StringKey } from './strings'

interface LangContextValue {
	lang: Lang
	setLang: (lang: Lang) => void
	t: (key: StringKey) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
	const [lang, setLangState] = useState<Lang>('en')

	useEffect(() => {
		try {
			const saved = localStorage.getItem('pf_lang')
			if (saved === 'en' || saved === 'es') setLangState(saved)
		} catch {}
	}, [])

	const setLang = (next: Lang) => {
		setLangState(next)
		try {
			localStorage.setItem('pf_lang', next)
		} catch {}
	}

	const t = (key: StringKey) => strings[lang][key] ?? key

	return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
	const ctx = useContext(LangContext)
	if (!ctx) throw new Error('useLang must be used within LangProvider')
	return ctx
}
