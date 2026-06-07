import type { Task } from '@/types'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-5xl mb-4">➕</div>
        <p className="text-lg text-gray-500">No tasks yet. Add your first task!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
