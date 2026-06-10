import { cache } from 'react'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { ensureGuestUser, ensureUser } from '@/lib/db/users'
import type { User } from '@/types'

const SESSION_COOKIE = 'session'
export const GUEST_COOKIE = 'guest'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Resolves the current user. A named session cookie (set on sign-in) wins; if
 * absent we fall back to the anonymous guest cookie (minted in `proxy.ts`), so
 * every visitor always has a usable, isolated session. Wrapped in React
 * `cache()` so the layout and page share one lookup per request.
 */
export const getSession = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies()

  const namedUser = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value)
  if (namedUser) {
    return syncNamedUser(namedUser)
  }

  return resolveGuestUser(cookieStore.get(GUEST_COOKIE)?.value)
})

export async function getSessionFromRequest(
  request: NextRequest
): Promise<User | null> {
  const namedUser = parseSessionCookie(request.cookies.get(SESSION_COOKIE)?.value)
  if (namedUser) {
    return syncNamedUser(namedUser)
  }

  return resolveGuestUser(request.cookies.get(GUEST_COOKIE)?.value)
}

export async function createSession(user: User): Promise<void> {
  const cookieStore = await cookies()
  const { isGuest: _isGuest, ...identity } = user
  cookieStore.set(SESSION_COOKIE, JSON.stringify(identity), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function clearGuestCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(GUEST_COOKIE)
}

function parseSessionCookie(rawSessionValue?: string): User | null {
  if (!rawSessionValue) {
    return null
  }

  try {
    return JSON.parse(rawSessionValue) as User
  } catch {
    return null
  }
}

async function syncNamedUser(user: User): Promise<User> {
  try {
    return await ensureUser({ email: user.email, name: user.name })
  } catch (error) {
    console.error('Failed to sync session user with database:', error)
    return { ...user, isGuest: false }
  }
}

async function resolveGuestUser(guestId?: string): Promise<User | null> {
  if (!guestId) {
    return null
  }

  try {
    const user = await ensureGuestUser(guestId)
    return { ...user, isGuest: true }
  } catch (error) {
    console.error('Failed to resolve guest user from database:', error)
    return null
  }
}
