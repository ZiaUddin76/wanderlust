import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// Optimistically bounce visitors without a session away from the routes
// that need one. The pages themselves re-check the session server-side —
// the proxy is not an authorization boundary on its own.
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })

    if (!session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    '/add-destination',
    '/my-bookings',
    // Matches `/destinations/<id>` only — the `/destinations` listing stays public.
    '/destinations/:path',
  ],
}
