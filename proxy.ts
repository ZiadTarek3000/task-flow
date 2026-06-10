import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'session'
const GUEST_COOKIE = 'guest'
const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * Instant access, optional sign-in. There is no auth wall: a first-time visitor
 * is handed an anonymous "guest" id so they land straight on a working, isolated
 * dashboard. Signing in later swaps the guest for a named session (and carries
 * their tasks over — see `loginAction`). Signed-in users are bounced off /login.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE)
  const hasGuest = request.cookies.has(GUEST_COOKIE)
  const { pathname } = request.nextUrl

  if (hasSession && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Already identified (named or guest) — nothing to mint.
  if (hasSession || hasGuest) {
    return NextResponse.next()
  }

  // Only mint a guest for real top-level page navigations, so bare API hits,
  // RSC prefetches, and crawlers don't spawn throwaway guest records.
  const isDocumentNavigation =
    request.headers.get('sec-fetch-mode') === 'navigate' ||
    (request.headers.get('accept') ?? '').includes('text/html')

  if (!isDocumentNavigation) {
    return NextResponse.next()
  }

  const guestId = crypto.randomUUID()

  // Make the cookie visible to Server Components rendering *this* request, and
  // persist it on the client for every subsequent request.
  request.cookies.set(GUEST_COOKIE, guestId)
  const response = NextResponse.next({ request })
  response.cookies.set(GUEST_COOKIE, guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: GUEST_COOKIE_MAX_AGE,
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
