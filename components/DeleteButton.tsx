'use client'

import { useState, useTransition } from 'react'
import { deleteTaskAction } from '@/actions/taskActions'

interface DeleteButtonProps {
  id: string
}

export function DeleteButton({ id }: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTaskAction(id)
      setIsConfirming(false)
    })
  }

  if (isConfirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isPending ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors text-sm disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
    >
      Delete
    </button>
  )
}
