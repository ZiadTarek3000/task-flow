import Link from 'next/link'
import { Suspense } from 'react'
import { loginAction } from '@/actions/taskActions'

const ERROR_MESSAGES: Record<string, string> = {
  missing: 'Please enter both an email and a password.',
  email: 'Please enter a valid email address.',
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Save your tasks</h1>
          <p className="mt-2 text-gray-600">
            Sign in with any email and password — no account needed. Any tasks
            you&apos;ve already added are kept and linked to your email.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <Suspense fallback={null}>
            <LoginError searchParams={searchParams} />
          </Suspense>

          <form action={loginAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Sign in &amp; save
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/dashboard"
            className="font-medium text-indigo-600 hover:underline"
          >
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  )
}

async function LoginError({ searchParams }: LoginPageProps) {
  const { error } = await searchParams
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined

  if (!errorMessage) {
    return null
  }

  return (
    <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {errorMessage}
    </p>
  )
}
