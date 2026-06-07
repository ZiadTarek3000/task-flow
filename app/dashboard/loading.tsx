import { TaskSkeleton } from '@/components/TaskSkeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-80 rounded bg-gray-200 animate-pulse" />
      </div>
      <TaskSkeleton />
    </div>
  )
}
