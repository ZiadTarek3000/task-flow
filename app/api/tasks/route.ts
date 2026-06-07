import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { getTasks } from '@/lib/tasks'

export async function GET(request: NextRequest) {
  const user = await getSessionFromRequest(request)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const shouldDelay = request.nextUrl.searchParams.get('slow') === 'true'

  if (shouldDelay) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const tasks = await getTasks(user.id)

  return NextResponse.json(tasks, { status: 200 })
}
