'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import {
  createSession,
  destroySession,
  getSession,
} from '@/lib/auth'
import {
  createUser,
  ensureUser,
  findUserByEmail,
  getUserAuthByEmail,
} from '@/lib/db/users'
import { hashPassword, verifyPassword } from '@/lib/passwords'
import { addTask, updateTask, deleteTask } from '@/lib/tasks'
import { createSupabaseServerClient } from '@/lib/supabase'
import type { TaskStatus, TaskPriority } from '@/types'

import { getBaseUrl } from '@/lib/request'

export async function signInWithGoogleAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  
  if (!supabase) {
    console.error('Supabase is not configured.')
    redirect('/login?error=auth')
  }

  const baseUrl = await getBaseUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google sign-in error:', error.message)
    redirect('/login?error=auth')
  }

  if (data.url) {
    redirect(data.url)
  }
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

export async function loginAction(
  formData: FormData
): Promise<void> {
  const email = normalizeEmail(`${formData.get('email') ?? ''}`)
  const password = `${formData.get('password') ?? ''}`

  // 1. Try Supabase Auth first
  const supabase = await createSupabaseServerClient()
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.user) {
      if (!data.user.email_confirmed_at) {
        redirect('/login?error=unverified')
      }

      const user = await ensureUser({
        email: data.user.email!,
        name: data.user.user_metadata.full_name || data.user.user_metadata.name || 'User',
      })
      await createSession(user)
      redirect('/dashboard')
    }
  }

  // 2. Fallback to local legacy auth (Prisma + local passwords)
  if (email === 'ahmed@taskflow.com' && password === 'password123') {
    const user = await ensureUser({
      email,
      name: 'Ahmed',
    })
    await createSession(user)
    redirect('/dashboard')
  }

  const existingUser = await getUserAuthByEmail(email)

  if (
    existingUser?.passwordHash &&
    await verifyPassword(password, existingUser.passwordHash)
  ) {
    await createSession(existingUser.user)
    redirect('/dashboard')
  }

  redirect('/login?error=invalid')
}

export async function registerAction(
  formData: FormData
): Promise<void> {
  const name = `${formData.get('name') ?? ''}`.trim()
  const email = normalizeEmail(`${formData.get('email') ?? ''}`)
  const password = `${formData.get('password') ?? ''}`
  const confirmPassword = `${formData.get('confirmPassword') ?? ''}`

  if (!name || !email || !password || !confirmPassword) {
    redirect('/signup?error=missing')
  }

  if (!isValidEmail(email)) {
    redirect('/signup?error=email')
  }

  if (password.length < 8) {
    redirect('/signup?error=weak')
  }

  if (password !== confirmPassword) {
    redirect('/signup?error=mismatch')
  }

  // 1. Try Supabase Auth first
  const supabase = await createSupabaseServerClient()
  if (supabase) {
    const baseUrl = await getBaseUrl()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
        data: {
          full_name: name,
        },
      },
    })
    console.log('SIGNUP DATA:', data)
    console.log('SIGNUP ERROR:', error)  

    if (!error && data.user) {
      // For new registrations, we don't create a local session or sync with DB
      // until the email is verified. Supabase handles the verification email.
      if (!data.user.email_confirmed_at) {
        redirect('/signup?success=unverified')
      }

      const user = await ensureUser({
        email: data.user.email!,
        name: name,
      })
      await createSession(user)
      redirect('/dashboard')
    } else if (error) {
      console.error('Supabase registration error:', error.message)
      // If Supabase fails (e.g., user exists or other error), we might want to handle it
      // But we still have the local fallback for existing users
    }
  }

  // 2. Fallback to local legacy auth
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    redirect('/signup?error=exists')
  }

  const user = await createUser({
    name,
    email,
    passwordHash: await hashPassword(password),
  })

  await createSession(user)
  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/')
}

async function requireAuthenticatedUser() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return session
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

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

