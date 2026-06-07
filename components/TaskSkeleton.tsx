export function TaskSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
