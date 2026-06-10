import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaskStats } from '@/lib/tasks'
import { TaskSkeleton } from '@/components/TaskSkeleton'
import { AddTaskForm } from '@/components/AddTaskForm'
import { StreamedTaskList } from '@/components/StreamedTaskList'
import { DashboardStats } from '@/components/DashboardStats'
import { LiveTaskInsights } from '@/components/LiveTaskInsights'

export default async function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <DashboardHeader />
        </Suspense>
        <AddTaskForm />
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <LiveTaskInsights />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Tasks</h2>
          <p className="text-sm text-gray-500">
            The list is streamed from a protected API route using an external fetch
            wrapper.
          </p>
        </div>

        <Suspense fallback={<TaskSkeleton />}>
          <StreamedTaskList />
        </Suspense>
      </section>
    </div>
  )
}

async function DashboardHeader() {
  const user = await getSession()

  if (!user) {
    // No session at all (e.g. cookies disabled). Bounce home; proxy mints one.
    redirect('/')
  }

  const taskStats = await getTaskStats(user.id)

  return (
    <div>
      <p className="text-sm font-medium text-indigo-600">
        {user.isGuest ? 'Welcome' : `Welcome back, ${user.name}`}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Task Dashboard</h1>
      <p className="mt-2 text-gray-600">
        {taskStats.done} of {taskStats.total} tasks are complete. Cached summary
        data is refreshed every 60 seconds.
      </p>

      {user.isGuest ? (
        <p className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <span className="material-symbols-outlined text-lg">info</span>
          You&apos;re using a guest session.
          <Link href="/login" className="font-semibold underline underline-offset-2">
            Sign in
          </Link>
          to save these tasks so they follow you next time.
        </p>
      ) : null}
    </div>
  )
}

function DashboardHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
      <div className="h-9 w-64 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-80 bg-gray-200 rounded"></div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-4 h-9 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
