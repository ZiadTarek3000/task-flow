import type {
  Task as PrismaTask,
  TaskPriority as PrismaTaskPriority,
  TaskStatus as PrismaTaskStatus,
  User as PrismaUser,
} from '@prisma/client'
import type {
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from '@/types'

const uiToDbStatusMap: Record<TaskStatus, PrismaTaskStatus> = {
  Pending: 'Pending',
  'In Progress': 'InProgress',
  Done: 'Done',
}

const dbToUiStatusMap: Record<PrismaTaskStatus, TaskStatus> = {
  Pending: 'Pending',
  InProgress: 'In Progress',
  Done: 'Done',
}

const uiToDbPriorityMap: Record<TaskPriority, PrismaTaskPriority> = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
}

export function mapTaskFromDb(task: PrismaTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    status: dbToUiStatusMap[task.status],
    priority: task.priority,
    createdAt: task.createdAt.toISOString(),
  }
}

export function mapUserFromDb(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name ?? 'TaskFlow User',
    email: user.email,
  }
}

export function mapStatusToDb(status: TaskStatus): PrismaTaskStatus {
  return uiToDbStatusMap[status]
}

export function mapPriorityToDb(priority: TaskPriority): PrismaTaskPriority {
  return uiToDbPriorityMap[priority]
}
