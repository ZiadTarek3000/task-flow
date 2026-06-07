import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { ensureUser } from '@/lib/db/users'
import { createSession } from '@/lib/auth'
import { getBaseUrl } from '@/lib/request'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const baseUrl = await getBaseUrl()

  if (code) {
    const supabase = await createSupabaseServerClient()
    
    if (!supabase) {
      console.error('Supabase client failed to initialize in callback')
      return NextResponse.redirect(`${baseUrl}/login?error=auth`)
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      if (!data.user.email_confirmed_at) {
        return NextResponse.redirect(`${baseUrl}/login?error=unverified`)
      }

      try {
        // Sync Supabase user with local Prisma database
        const user = await ensureUser({
          email: data.user.email!,
          name: data.user.user_metadata.full_name || data.user.user_metadata.name || 'User',
        })

        // Create local session to maintain compatibility with existing session logic
        await createSession(user)

        return NextResponse.redirect(`${baseUrl}${next}`)
      } catch (syncError) {
        console.error('Failed to sync user or create session:', syncError)
        return NextResponse.redirect(`${baseUrl}/login?error=auth`)
      }
    } else if (error) {
      console.error('Supabase auth exchange error:', error.message)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseUrl}/login?error=auth`)
}
