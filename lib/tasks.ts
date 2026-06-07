import 'server-only'

import { cache } from 'react'
import {
  createTask as createTaskRecord,
  deleteTask as deleteTaskRecord,
  getTaskById as getTaskByIdRecord,
  getTaskStats as getTaskStatsRecord,
  getTasks as getTaskRecords,
  updateTask as updateTaskRecord,
} from '@/lib/db/tasks'
import {
  mapPriorityToDb,
  mapStatusToDb,
  mapTaskFromDb,
} from '@/lib/db/mappers'
import type { Task, TaskPriority, TaskStatus } from '@/types'

type TaskMutationInput = {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

type TaskPatchInput = Partial<TaskMutationInput>

export type TaskStats = {
  total: number
  done: number
  inProgress: number
  pending: number
}

export async function getTasks(userId: string): Promise<Task[]> {
  const tasks = await getTaskRecords(userId)
  return tasks.map(mapTaskFromDb)
}

export const getTaskById = cache(
  async (id: string, userId: string): Promise<Task | undefined> => {
    const task = await getTaskByIdRecord(id, userId)
    return task ? mapTaskFromDb(task) : undefined
  }
)

export async function getTaskStats(userId: string): Promise<TaskStats> {
  const stats = await getTaskStatsRecord(userId)

  return {
    total: stats.total,
    done: stats.Done,
    inProgress: stats.InProgress,
    pending: stats.Pending,
  }
}

export async function addTask(
  userId: string,
  data: TaskMutationInput
): Promise<Task> {
  const task = await createTaskRecord({
    userId,
    title: data.title,
    description: data.description || undefined,
    priority: mapPriorityToDb(data.priority),
    status: mapStatusToDb(data.status),
  })

  return mapTaskFromDb(task)
}

export async function updateTask(
  id: string,
  userId: string,
  data: TaskPatchInput
): Promise<Task | undefined> {
  const task = await updateTaskRecord(id, userId, {
    title: data.title,
    description:
      data.description === undefined ? undefined : data.description || null,
    priority:
      data.priority === undefined ? undefined : mapPriorityToDb(data.priority),
    status: data.status === undefined ? undefined : mapStatusToDb(data.status),
  })

  return task ? mapTaskFromDb(task) : undefined
}

export async function deleteTask(id: string, userId: string): Promise<boolean> {
  return deleteTaskRecord(id, userId)
}
