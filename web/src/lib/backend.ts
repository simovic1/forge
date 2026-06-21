// Base URL of the Spring backend, used by the same-origin API proxy routes
// (server-side only). A value without a scheme — e.g. a Render service host
// like "forge-backend.onrender.com" — is treated as HTTPS.
function normalize(url: string): string {
  return url.includes('://') ? url : `https://${url}`
}

export const BACKEND_URL = normalize(
  process.env.BACKEND_URL ?? 'http://localhost:8080',
)
