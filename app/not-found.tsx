import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-9xl font-bold text-indigo-600">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mt-4">
        Page Not Found
      </h1>
      <p className="text-gray-500 mt-2 mb-8">
        Looks like this page doesn&apos;t exist.  
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  )
}
