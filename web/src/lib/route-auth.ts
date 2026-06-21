import { cookies } from 'next/headers'
import { TOKEN_COOKIE } from '@/lib/auth'

// Reads the auth token inside a Route Handler. Use this rather than
// `NextRequest.cookies`, which is not populated for route handlers in this
// Next.js version — only `cookies()` from next/headers reads request cookies here.
export async function getRequestToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value
}
