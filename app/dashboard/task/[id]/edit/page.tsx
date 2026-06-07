import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { getTaskById } from '@/lib/tasks'
import { EditTaskForm } from '@/components/EditTaskForm'

interface EditTaskPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-indigo-600 hover:underline mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Task
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Suspense fallback={<EditTaskSkeleton />}>
          <EditTaskContent params={params} />
        </Suspense>
      </div>
    </div>
  )
}

async function EditTaskContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSession()

  if (!user) {
    notFound()
  }

  const task = await getTaskById(id, user.id) 

  if (!task) {
    notFound()
  }

  return <EditTaskForm task={task} />
}

function EditTaskSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-24 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  )
}
