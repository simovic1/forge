'use server'

import { cookies } from 'next/headers'
import { isLocale, LOCALE_COOKIE, type Locale } from './messages'

/** Persists the chosen locale in a cookie that the server reads on each render. */
export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return
  ;(await cookies()).set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
