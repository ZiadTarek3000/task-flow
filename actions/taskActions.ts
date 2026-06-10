'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  clearGuestCookie,
  createSession,
  destroySession,
  getSession,
} from '@/lib/auth'
import { claimGuestData, ensureUser } from '@/lib/db/users'
import { addTask, updateTask, deleteTask } from '@/lib/tasks'
import type { TaskStatus, TaskPriority } from '@/types'

export async function loginAction(formData: FormData): Promise<void> {
  const email = `${formData.get('email') ?? ''}`.trim().toLowerCase()
  const password = `${formData.get('password') ?? ''}`

  if (!email || !password) {
    redirect('/login?error=missing')
  }

  if (!isValidEmail(email)) {
    redirect('/login?error=email')
  }

  // No real authentication: any password is accepted. The email is just the key
  // a user's tasks are stored against.
  const current = await getSession()
  const user = await ensureUser({ email, name: deriveName(email) })

  // Carry the visitor's guest tasks over to their named account so "sign in to
  // save your tasks" actually saves what they were just working on.
  if (current?.isGuest) {
    await claimGuestData(current.id, user.id)
  }

  await createSession(user)
  await clearGuestCookie()

  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  // Drop the named session and the (already-cleared) guest cookie; the next
  // navigation mints a fresh guest, returning the visitor to instant access.
  await destroySession()
  await clearGuestCookie()
  redirect('/')
}

export async function addTaskAction(formData: FormData): Promise<void> {
  const user = await requireAuthenticatedUser()
  const { title, description, priority, status } = parseTaskFormData(formData)

  await addTask(user.id, {
    title,
    description,
    priority,
    status,
  })

  revalidatePath('/dashboard')
  revalidateTag('tasks', 'max')
}

export async function deleteTaskAction(id: string): Promise<void> {
  const user = await requireAuthenticatedUser()
  await deleteTask(id, user.id)
  revalidatePath('/dashboard')
  revalidateTag('tasks', 'max')
}

export async function updateTaskAction(
  id: string,
  formData: FormData
): Promise<void> {
  const user = await requireAuthenticatedUser()
  const { title, description, priority, status } = parseTaskFormData(formData)

  await updateTask(id, user.id, {
    title,
    description,
    priority,
    status,
  })

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/task/${id}/edit`)
  revalidateTag('tasks', 'max')
}

export async function toggleTaskStatusAction(
  id: string,
  nextStatus: TaskStatus
): Promise<void> {
  const user = await requireAuthenticatedUser()

  if (!['Pending', 'In Progress', 'Done'].includes(nextStatus)) {
    throw new Error('Invalid task status.')
  }

  await updateTask(id, user.id, {
    status: nextStatus,
  })

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/task/${id}/edit`)
  revalidateTag('tasks', 'max')
}

async function requireAuthenticatedUser() {
  const user = await getSession()

  if (!user) {
    // No session yet (e.g. cookies disabled). Bounce home; `proxy.ts` mints a
    // guest on the way back.
    redirect('/')
  }

  return user
}

function parseTaskFormData(formData: FormData): {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
} {
  const title = `${formData.get('title') ?? ''}`.trim()
  const description = `${formData.get('description') ?? ''}`.trim()
  const priority = formData.get('priority') as TaskPriority
  const status = formData.get('status') as TaskStatus

  if (!title) {
    throw new Error('Task title is required.')
  }

  if (!['Low', 'Medium', 'High'].includes(priority)) {
    throw new Error('Invalid task priority.')
  }

  if (!['Pending', 'In Progress', 'Done'].includes(status)) {
    throw new Error('Invalid task status.')
  }

  return {
    title,
    description,
    priority,
    status,
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function deriveName(email: string): string {
  const localPart = email.split('@')[0] ?? 'User'
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}
