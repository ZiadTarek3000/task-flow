'use client'

import { useTransition } from 'react'
import { toggleTaskStatusAction } from '@/actions/taskActions'
import type { TaskStatus } from '@/types'

type ToggleTaskStatusButtonProps = {
  id: string
  status: TaskStatus
}

export function ToggleTaskStatusButton({
  id,
  status,
}: ToggleTaskStatusButtonProps) {
  const [isPending, startTransition] = useTransition()
  const nextStatus = status === 'Done' ? 'Pending' : 'Done'

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await toggleTaskStatusAction(id, nextStatus)
        })
      }}
      disabled={isPending}
      className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? 'Updating...' : status === 'Done' ? 'Mark Pending' : 'Mark Done'}
    </button>
  )
}
