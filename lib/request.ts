import 'server-only'

import { cookies, headers } from 'next/headers'

export async function getBaseUrl(): Promise<string> {
  // 1. Check for explicit environment variable (best for production)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  // 2. Try to get from request headers (works in both dev and production)
  try {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
    const protocol = headerStore.get('x-forwarded-proto') ?? 'http'

    if (host) {
      // Ensure protocol is https for non-localhost environments
      const finalProtocol = host.includes('localhost') ? protocol : 'https'
      return `${finalProtocol}://${host}`
    }
  } catch (error) {
    console.warn('Failed to get headers in getBaseUrl:', error)
  }

  // 3. Fallback for build time or edge cases
  return 'http://localhost:3000'
}

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies()

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
}
