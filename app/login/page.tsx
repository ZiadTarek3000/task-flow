import Link from 'next/link'
import { loginAction, signInWithGoogleAction } from '@/actions/taskActions'
import { Suspense } from 'react'

interface LoginPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

const errorMessages: Record<string, string> = {
  invalid: 'Invalid email or password. Please try again.',
  auth: 'An error occurred during authentication. Please try again.',
  unverified: 'Your email address is not verified. Please check your inbox for a confirmation link.',
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-[#3525CD] via-[#4F46E5] to-[#7C73F2] p-8 text-white shadow-[0_20px_50px_rgba(53,37,205,0.24)] sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(195,192,255,0.28),transparent_32%)]" />
            <div className="relative flex h-full flex-col">
              <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium tracking-wide text-white/90 backdrop-blur">
                Welcome back to TaskFlow
              </div>

              <div className="mt-8 max-w-xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-100/80">
                  Resuming clarity
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Pick up exactly where you left off.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-indigo-50/90 sm:text-lg">
                  Login to your workspace to manage your priorities, check your progress,
                  and keep your team moving forward.
                </p>
              </div>

              <div className="mt-auto pt-10">
                <div className="space-y-4 rounded-3xl border border-white/15 bg-[#21158c]/30 p-6 backdrop-blur-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100/80">
                    Secure Authentication
                  </p>
                  <p className="text-indigo-50/90 sm:text-base">
                    We now support Google Sign-In for a more secure and seamless experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[#dce2f7] bg-white p-6 shadow-[0_18px_45px_rgba(20,27,43,0.08)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3525CD] via-[#4F46E5] to-[#7C73F2]" />

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">
                Login
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#141B2B]">
                Access your workspace
              </h2>
              <p className="mt-3 text-base leading-7 text-[#585F6C]">
                Sign in with your Google account to continue managing your tasks.
              </p>
            </div>

            <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-2xl mb-6"></div>}>
              <LoginErrorDisplay searchParams={searchParams} />
            </Suspense>

            <form action={signInWithGoogleAction} className="mb-8">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#c7c4d8] bg-white px-4 py-3.5 text-base font-semibold text-[#141B2B] shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-[#3525CD]/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dce2f7]"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium uppercase tracking-wider">
                <span className="bg-white px-4 text-[#777587]">Or continue with email</span>
              </div>
            </div>

            <form action={loginAction} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#464555]">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-xl text-[#777587]">
                    mail
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-[#c7c4d8] bg-white pl-12 pr-4 py-3 text-[#141B2B] outline-none transition focus:border-[#3525CD] focus:ring-4 focus:ring-[#3525CD]/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-[#464555]">
                    Password
                  </label>
                  <Link href="#" className="text-sm font-medium text-[#3525CD] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3.5 text-xl text-[#777587]">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#c7c4d8] bg-white pl-12 pr-4 py-3 text-[#141B2B] outline-none transition focus:border-[#3525CD] focus:ring-4 focus:ring-[#3525CD]/15"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-[#c7c4d8] text-[#4F46E5] focus:ring-[#3525CD]/20"
                />
                <label htmlFor="remember" className="text-sm text-[#585F6C]">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#4F46E5] px-4 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 hover:bg-[#3525CD] focus:outline-none focus:ring-4 focus:ring-[#3525CD]/20"
              >
                Sign in to TaskFlow
              </button>
            </form>

            <p className="mt-8 text-sm text-[#585F6C]">
              Don&apos;t have an account yet?{' '}
              <Link href="/signup" className="font-semibold text-[#3525CD] hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

async function LoginErrorDisplay({ searchParams }: LoginPageProps) {
  const { error } = await searchParams
  const errorMessage = error ? errorMessages[error] : null

  if (!errorMessage) return null

  return (
    <div className="mb-6 rounded-2xl border border-[#ffd6d0] bg-[#fff3f0] px-4 py-3 text-sm text-[#93000A]">
      {errorMessage}
    </div>
  )
}
