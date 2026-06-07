import 'dotenv/config'

import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Missing DIRECT_URL or DATABASE_URL for Prisma seed.')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'ahmed@taskflow.com' },
    update: {},
    create: {
      email: 'ahmed@taskflow.com',
      name: 'Ahmed demo',
      tasks: {
        create: [
          {
            title: 'Welcome to TaskFlow',
            description: 'This is your first task created via seed script',
            status: TaskStatus.InProgress,
            priority: TaskPriority.High,
          },
          {
            title: 'Explore the Dashboard',
            description: 'Check out the stats and task management features',
            status: TaskStatus.Pending,
            priority: TaskPriority.Medium,
          },
        ],
      },
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
