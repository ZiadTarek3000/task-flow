import prisma from '@/lib/prisma'
import { mapUserFromDb } from '@/lib/db/mappers'
import type { User } from '@/types'

type EnsureUserInput = Pick<User, 'email'> & Partial<Pick<User, 'name'>>
type CreateUserInput = Pick<User, 'email'> &
  Partial<Pick<User, 'name'>> & {
    passwordHash: string
  }

export async function ensureUser(input: EnsureUserInput): Promise<User> {
  const email = normalizeEmail(input.email)
  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: input.name ?? undefined,
    },
    create: {
      email,
      name: input.name ?? null,
    },
  })

  return mapUserFromDb(user)
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email: normalizeEmail(input.email),
      name: input.name?.trim() || null,
      passwordHash: input.passwordHash,
    },
  })

  return mapUserFromDb(user)
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
  })

  return user ? mapUserFromDb(user) : null
}

export async function getUserAuthByEmail(email: string): Promise<{
  user: User
  passwordHash: string | null
} | null> {
  const record = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
  })

  if (!record) {
    return null
  }

  return {
    user: mapUserFromDb(record),
    passwordHash: record.passwordHash,
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
