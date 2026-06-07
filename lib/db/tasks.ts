import prisma from '@/lib/prisma'
import { TaskStatus, TaskPriority } from '@prisma/client'

export type CreateTaskInput = {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  userId: string
}

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, 'userId'>>

export async function getTasks(userId: string) {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTaskById(id: string, userId: string) {
  return await prisma.task.findFirst({
    where: { id, userId },
  })
}

export async function createTask(data: CreateTaskInput) {
  return await prisma.task.create({
    data,
  })
}

export async function updateTask(id: string, userId: string, data: UpdateTaskInput) {
  await prisma.task.updateMany({
    where: { id, userId },
    data,
  })

  return await getTaskById(id, userId)
}

export async function deleteTask(id: string, userId: string) {
  const result = await prisma.task.deleteMany({
    where: { id, userId },
  })

  return result.count > 0
}

export async function getTaskStats(userId: string) {
  const stats = await prisma.task.groupBy({
    by: ['status'],
    where: { userId },
    _count: {
      status: true,
    },
  })

  const counts = {
    total: 0,
    Pending: 0,
    InProgress: 0,
    Done: 0,
  }

  stats.forEach((stat) => {
    const count = stat._count.status
    counts[stat.status] = count
    counts.total += count
  })

  return counts
}
