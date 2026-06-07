import Link from 'next/link'
import type { Task } from '@/types'
import { StatusBadge } from './StatusBadge'
import { DeleteButton } from './DeleteButton'
import { ToggleTaskStatusButton } from './ToggleTaskStatusButton'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const isDone = task.status === 'Done'

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-lg font-bold ${isDone ? 'text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

      <div className="flex gap-2 mb-4">
        <StatusBadge status={task.status} />
      </div>

      <div className="flex gap-2">
        <ToggleTaskStatusButton id={task.id} status={task.status} />
        <Link
          href={`/dashboard/task/${task.id}/edit`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          Edit
        </Link>
        <DeleteButton id={task.id} />
      </div>
    </div>
  )
}
