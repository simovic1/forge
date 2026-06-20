'use client'

import { createContext, useContext, useMemo } from 'react'
import { createTranslator, type Locale, type Translator } from './messages'

type LocaleContextValue = { locale: Locale; t: Translator }

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  // Dictionaries are bundled, so we only need the locale to build the translator.
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: createTranslator(locale) }),
    [locale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useTranslations/useLocale must be used within a LocaleProvider')
  }
  return ctx
}

export function useTranslations(): Translator {
  return useLocaleContext().t
}

export function useLocale(): Locale {
  return useLocaleContext().locale
}
