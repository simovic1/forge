// Name of the httpOnly cookie holding the access token. Shared by the login
// route handler (sets it), the logout handler (clears it), and the proxy
// (reads it to gate routes).
export const TOKEN_COOKIE = 'forge_token'

// Whether the auth cookie should be marked Secure (HTTPS-only).
// - AUTH_COOKIE_SECURE=false  → plain http works (e.g. same-Wi-Fi LAN deploy)
// - AUTH_COOKIE_SECURE=true   → HTTPS only (e.g. Vercel)
// - unset                     → secure in production, open in local dev
export function authCookieSecure(): boolean {
  const override = process.env.AUTH_COOKIE_SECURE
  if (override != null) return override === 'true'
  return process.env.NODE_ENV === 'production'
}
