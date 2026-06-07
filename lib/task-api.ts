import 'server-only'

import type { Task } from '@/types'
import { getBaseUrl, getCookieHeader } from '@/lib/request'

type FetchTasksOptions = {
  slow?: boolean
}

export async function fetchTasksFromApi(
  options: FetchTasksOptions = {}
): Promise<Task[]> {
  const baseUrl = await getBaseUrl()
  const cookieHeader = await getCookieHeader()
  const searchParams = new URLSearchParams()

  if (options.slow) {
    searchParams.set('slow', 'true')
  }

  const queryString = searchParams.toString()
  const url = `${baseUrl}/api/tasks${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url, {
    headers: {
      cookie: cookieHeader,
    },
    next: {
      revalidate: 60,
      tags: ['tasks'],
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch tasks from the API.')
  }

  return (await response.json()) as Task[]
}
