import { cookies } from 'next/headers'
import {
  createTranslator,
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from './messages'

/** Reads the locale from the cookie (server-side), falling back to the default. */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

/** Returns a translator bound to the current request's locale. */
export async function getT() {
  return createTranslator(await getLocale())
}
