import { NextResponse } from 'next/server'

// Proxies registration to the FORGE backend (POST /api/users) so the browser
// can call a same-origin endpoint (avoids CORS). The backend persists the user
// and returns 201 with the created user, or 409 if the email is already used.
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function POST(request: Request) {
  const body = await request.text()

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  } catch {
    return NextResponse.json(
      { message: 'Unable to reach the registration service.' },
      { status: 502 },
    )
  }

  // Pass the backend's status and JSON body straight through.
  const payload = await res.text()
  return new NextResponse(payload, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  })
}
