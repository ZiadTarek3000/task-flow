import type { TaskStatus } from '@/types'

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<
    TaskStatus,
    { bg: string; text: string }
  > = {
    Pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    'In Progress': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    Done: {
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  )
}
