import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { ensureUser } from '@/lib/db/users'
import { createSupabaseServerClient } from '@/lib/supabase'
import type { User } from '@/types'

export async function getSession(): Promise<User | null> {
  const supabase = await createSupabaseServerClient()
  
  if (supabase) {
    const { data: { user: sbUser } } = await supabase.auth.getUser()

    // Only allow authenticated users with a confirmed email
    // OAuth users (Google) usually have email_confirmed_at set automatically
    if (sbUser && sbUser.email_confirmed_at) {
      return await ensureUser({
        email: sbUser.email!,
        name: sbUser.user_metadata.full_name || sbUser.user_metadata.name || 'User',
      })
    }
  }

  const cookieStore = await cookies()
  return syncSessionUser(parseSessionCookie(cookieStore.get('session')?.value))
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<User | null> {
  const supabase = await createSupabaseServerClient()

  if (supabase) {
    const { data: { user: sbUser } } = await supabase.auth.getUser()

    if (sbUser && sbUser.email_confirmed_at) {
      return await ensureUser({
        email: sbUser.email!,
        name: sbUser.user_metadata.full_name || sbUser.user_metadata.name || 'User',
      })
    }
  }

  return syncSessionUser(parseSessionCookie(request.cookies.get('session')?.value))
}

export async function createSession(user: User): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function destroySession(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  
  const cookieStore = await cookies()
  cookieStore.delete('session')
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

async function syncSessionUser(user: User | null): Promise<User | null> {
  if (!user) {
    return null
  }

  try {
    return await ensureUser({
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error('Failed to sync session user with database:', error)
    // Fallback to the user data from the session cookie if the database is temporarily unavailable
    return user
  }
}
