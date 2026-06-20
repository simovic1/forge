// Name of the httpOnly cookie holding the access token. Shared by the login
// route handler (sets it), the logout handler (clears it), and the proxy
// (reads it to gate routes).
export const TOKEN_COOKIE = 'forge_token'
