# TaskFlow

A small task-management app built on **Next.js 16** (App Router), **React 19**, **Prisma 7**, and **PostgreSQL**.

The defining idea is **instant access, optional sign-in**: there is no auth wall. A first-time visitor gets an anonymous *guest* session and lands straight on a working dashboard pre-seeded with sample tasks. Signing in later — with any email, no password — turns the guest into a named account and carries the existing tasks over.

## Features

- **Guest sessions** — every visitor gets an isolated task list with zero friction.
- **Passwordless sign-in** — any email is accepted; it's just the key tasks are stored against. There's no real authentication.
- **Task CRUD** — create, edit, complete, and delete tasks with a status (`Pending` / `InProgress` / `Done`) and priority (`Low` / `Medium` / `High`).
- **Guest-to-account migration** — on sign-in, a guest's tasks are re-parented to the named account (`claimGuestData`).
- **Streaming dashboard** — `Suspense` streams the header, stats, and task list independently; the task list is cached (60s tag revalidation) while a client component polls `/api/tasks` for a live summary.

## Tech stack

| Concern   | Choice                                                |
| --------- | ----------------------------------------------------- |
| Framework | Next.js 16 (App Router, Server Actions, RSC)          |
| UI        | React 19, Tailwind CSS v4                             |
| Database  | PostgreSQL                                            |
| ORM       | Prisma 7 with the `@prisma/adapter-pg` driver adapter |
| Language  | TypeScript                                            |

## Getting started

Requires Node.js 20+ and a PostgreSQL database.

```bash
npm install                 # postinstall runs `prisma generate`
npx prisma migrate deploy   # apply migrations
npx prisma db seed          # optional: seed a demo user + tasks
npm run dev
```

Open [http://localhost:3000] — you'll be issued a guest session and dropped onto a working dashboard immediately.

Create a `.env` file first:

```bash
# Runtime connection (may be pooled)
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"

# Direct connection for migrations/seed. Optional — falls back to DATABASE_URL.
DIRECT_URL="postgresql://user:password@localhost:5432/taskflow"

# Optional explicit public URL for absolute API calls.
# Falls back to request headers, then http://localhost:3000.
# NEXT_PUBLIC_APP_URL="https://taskflow.example.com"
```

## Scripts

| Script          | Description                |
| --------------- | ------------------------- |
| `npm run dev`   | Start the dev server      |
| `npm run build` | Production build          |
| `npm run start` | Serve the production build|
| `npm run lint`  | Run ESLint                |

## How it works

- **Sessions** ([proxy.ts](proxy.ts), [lib/auth.ts](lib/auth.ts)) — the proxy mints a `guest` cookie for first-time page navigations (skipping API hits, prefetches, and crawlers). `getSession()` prefers a named `session` cookie and falls back to the guest cookie, so there's always a usable, isolated user.
- **Sign-in / out** ([actions/taskActions.ts](actions/taskActions.ts)) — `loginAction` upserts the user, re-parents guest tasks via `claimGuestData`, then sets the session and clears the guest cookie. `logoutAction` sends the visitor home, where the proxy mints a fresh guest.
- **Data** — Prisma models live in [prisma/schema.prisma](prisma/schema.prisma); queries in [lib/db/](lib/db/) are wrapped with domain types in [lib/tasks.ts](lib/tasks.ts). A single client is created in [lib/prisma.ts](lib/prisma.ts). New guests are seeded sample tasks so the dashboard is never empty.
- **Fetching** — the dashboard ([app/dashboard/page.tsx](app/dashboard/page.tsx)) streams via `Suspense`; the task list is fetched server-side through [lib/task-api.ts](lib/task-api.ts) (the protected [app/api/tasks/route.ts](app/api/tasks/route.ts) route, `revalidate: 60`, `tasks` tag), and [components/LiveTaskInsights.tsx](components/LiveTaskInsights.tsx) polls every 30s.

> **No real authentication.** Any email + password signs you in, and the password is never checked or stored. This demos the guest-session UX pattern — don't use the sign-in flow as-is where real access control matters.

