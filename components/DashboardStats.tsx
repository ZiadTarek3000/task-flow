import { getBaseUrl, getCookieHeader } from '@/lib/request'
import type { Task } from '@/types'

export async function DashboardStats() {
  const baseUrl = await getBaseUrl()
  const cookieHeader = await getCookieHeader()
  const response = await fetch(`${baseUrl}/api/tasks`, {
    headers: {
      cookie: cookieHeader,
    },
    next: {
      revalidate: 60,
      tags: ['tasks'],
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load dashboard statistics.')
  }

  const tasks = (await response.json()) as Task[]
  const done = tasks.filter((task) => task.status === 'Done').length
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length
  const pending = tasks.filter((task) => task.status === 'Pending').length

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Total Tasks" value={tasks.length} />
      <StatCard label="Completed" value={done} accent="text-emerald-600" />
      <StatCard label="Open Tasks" value={inProgress + pending} accent="text-amber-600" />
    </div>
  )
}

function StatCard({
  label,
  value,
  accent = 'text-indigo-600',
}: {
  label: string
  value: number
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  )
}
