import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import { getSession } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { Suspense } from 'react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// export const metadata: Metadata = {
//   title: 'TaskFlow - Task Manager',
//   description: 'A simple and effective task management application',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={<NavbarSkeleton />}>
          <NavbarWrapper />
        </Suspense>
        <main className="bg-gray-50 min-h-screen">{children}</main>
      </body>
    </html>
  )
}

async function NavbarWrapper() {
  const user = await getSession()
  return <Navbar user={user} />
}

function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E1E8FD] bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  )
}
