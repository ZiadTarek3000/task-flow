'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Task } from '@/types'

type InsightsState = {
  done: number
  open: number
  total: number
}

export function LiveTaskInsights() {
  const [stats, setStats] = useState<InsightsState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const loadInsights = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/tasks', {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Unable to refresh live task insights.')
      }

      const tasks = (await response.json()) as Task[]
      setStats({
        done: tasks.filter((task) => task.status === 'Done').length,
        open: tasks.filter((task) => task.status !== 'Done').length,
        total: tasks.length,
      })
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to refresh live task insights.'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInsights()
    }, 0)

    const intervalId = window.setInterval(() => {
      void loadInsights()
    }, 30000)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [loadInsights])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Live Task Insights</h2>
          <p className="mt-1 text-sm text-gray-500">
            Client-side polling keeps this summary in sync every 30 seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadInsights()}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <InsightTile label="Total" value={stats?.total ?? 0} />
          <InsightTile label="Done" value={stats?.done ?? 0} />
          <InsightTile label="Open" value={stats?.open ?? 0} />
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        {lastUpdated ? `Last updated at ${lastUpdated}.` : 'Waiting for first refresh.'}
      </p>
    </div>
  )
}

function InsightTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}
