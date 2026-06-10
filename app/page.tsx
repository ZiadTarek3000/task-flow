import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-50 to-indigo-100 px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Tasks, Simply.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Stay organized, focused, and in control of your day. No sign-up —
            jump straight in, and sign in only when you want to save your work.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Open the Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Everything you need
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Create Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-4 text-4xl">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Tasks
              </h3>
              <p className="text-gray-600">
                Add and organize your tasks in seconds.
              </p>
            </div>

            {/* Card 2: Track Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor what&apos;s done and what&apos;s pending.
              </p>
            </div>

            {/* Card 3: Stay Organized */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Stay Organized
              </h3>
              <p className="text-gray-600">
                Keep your work structured and focused.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-100 px-4 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2025 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
