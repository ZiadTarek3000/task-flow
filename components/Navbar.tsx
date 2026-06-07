import Link from 'next/link'
import type { User } from '@/types'
import { logoutAction } from '@/actions/taskActions'

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E1E8FD] bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3525CD] to-[#4F46E5] text-white shadow-sm">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#141B2B]">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 rounded-full bg-[#F1F3FF] px-3 py-1.5 text-sm font-medium text-[#464555]">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  {user.name}
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-xl border border-[#ffd6d0] bg-white px-4 py-2 text-sm font-semibold text-[#93000A] transition hover:bg-[#fff3f0]"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#464555] transition hover:text-[#3525CD]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:bg-[#3525CD]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
