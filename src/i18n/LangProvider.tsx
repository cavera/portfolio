'use client'
import { createContext, ReactNode, useContext } from 'react'
import { Lang, strings, StringKey } from './strings'

interface LangContextValue {
	lang: Lang
	t: (key: StringKey) => string
}

const LangContext = createContext<LangContextValue | null>(null)

/**
 * The URL is the single source of truth for language — `lang` comes from the
 * `[lang]` route segment, not from state or localStorage. Switching language is
 * navigation (see Nav), which is what makes each language a real, indexable URL
 * with its own `hreflang`.
 */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
	const t = (key: StringKey) => strings[lang][key] ?? key

	return <LangContext.Provider value={{ lang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
	const ctx = useContext(LangContext)
	if (!ctx) throw new Error('useLang must be used within LangProvider')
	return ctx
}
