'use client'

import { usePathname } from 'next/navigation'
import { createContext, type ReactNode, useContext, useEffect, useMemo } from 'react'

import { type Locale, normalizeLocale, splitLocalePath, t } from '@/lib/i18n'

interface LocaleContextValue {
  locale: Locale
  dictionary: ReturnType<typeof t>
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const locale = normalizeLocale(splitLocalePath(pathname).locale ?? undefined)
  const dictionary = useMemo(() => t(locale), [locale])

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem('rlp-docs-locale', locale)
    document.cookie = `rlp-docs-locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
  }, [locale])

  const value = useMemo(() => ({ locale, dictionary }), [locale, dictionary])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useI18n must be used inside LocaleProvider')
  }
  return context
}
