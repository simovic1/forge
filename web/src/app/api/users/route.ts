import { NextResponse } from 'next/server'

// Registration is not implemented yet. For now this returns 404 so the UI can
// surface a "registration unavailable" state. Replace with a proxy to the
// backend (POST /api/users) once the registration flow is ready.
export async function POST() {
  return NextResponse.json(
    { message: 'Registration is not available yet.' },
    { status: 404 },
  )
}
