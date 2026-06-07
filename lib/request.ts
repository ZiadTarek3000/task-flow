import 'server-only'

import { cookies, headers } from 'next/headers'

export async function getBaseUrl(): Promise<string> {
  const headerStore = await headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http'

  if (!host) {
    return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  }

  return `${protocol}://${host}`
}

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies()

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
}
