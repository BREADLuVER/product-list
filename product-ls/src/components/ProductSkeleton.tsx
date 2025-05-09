export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-2 space-y-2">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
