import prisma from '@/lib/prisma'
import { mapUserFromDb } from '@/lib/db/mappers'
import type { User } from '@/types'

type EnsureUserInput = Pick<User, 'email'> & Partial<Pick<User, 'name'>>

const GUEST_EMAIL_DOMAIN = 'guest.taskflow.local'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function guestEmail(guestId: string): string {
  return `guest-${guestId}@${GUEST_EMAIL_DOMAIN}`
}

/**
 * Finds the user for a real email, creating the record on first sign-in. No
 * password or account management — the email is simply the key a user's tasks
 * are stored against.
 */
export async function ensureUser(input: EnsureUserInput): Promise<User> {
  const email = normalizeEmail(input.email)

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: input.name ?? undefined },
    create: { email, name: input.name ?? null },
  })

  return mapUserFromDb(user)
}

/**
 * Resolves an anonymous guest id (cookie set in `proxy.ts`) to its own isolated
 * user record, seeding a few sample tasks the first time so the dashboard is
 * never empty for someone trying the demo.
 */
export async function ensureGuestUser(guestId: string): Promise<User> {
  const email = guestEmail(guestId)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return mapUserFromDb(existing)
  }

  try {
    const created = await prisma.user.create({
      data: { email, name: 'Guest' },
    })
    await seedGuestTasks(created.id)
    return mapUserFromDb(created)
  } catch (error) {
    // A concurrent request for the same brand-new guest won the unique-email
    // race; re-fetch the record it created instead of failing.
    const fallback = await prisma.user.findUnique({ where: { email } })
    if (fallback) {
      return mapUserFromDb(fallback)
    }
    throw error
  }
}

/**
 * Moves a guest's tasks onto a named account at sign-in, then removes the now
 * empty guest record. This is what makes "sign in to save your tasks" real.
 */
export async function claimGuestData(
  guestUserId: string,
  namedUserId: string
): Promise<void> {
  if (guestUserId === namedUserId) {
    return
  }

  await prisma.task.updateMany({
    where: { userId: guestUserId },
    data: { userId: namedUserId },
  })

  await prisma.user.delete({ where: { id: guestUserId } }).catch(() => {
    // Already gone (e.g. concurrent claim) — nothing to clean up.
  })
}

async function seedGuestTasks(userId: string): Promise<void> {
  await prisma.task.createMany({
    data: [
      {
        userId,
        title: 'Welcome to TaskFlow 👋',
        description:
          'You have instant access — no sign-up needed. Add, edit, complete, and delete tasks freely.',
        status: 'InProgress',
        priority: 'High',
      },
      {
        userId,
        title: 'Sign in to save your tasks',
        description:
          'Using any email keeps these tasks so they follow you next time.',
        status: 'Pending',
        priority: 'Medium',
      },
      {
        userId,
        title: 'Try editing or completing a task',
        description: 'Open a task to change its details, or mark one as Done.',
        status: 'Pending',
        priority: 'Low',
      },
    ],
  })
}
