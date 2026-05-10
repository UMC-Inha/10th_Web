// 목록 스켈레톤
export const GridSkeleton = ({ count = 10 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-6 px-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="aspect-square animate-pulse bg-neutral-800" />
    ))}
  </div>
)

// 상세 스켈레톤
export const DetailSkeleton = () => (
  <div className="mx-auto max-w-2xl p-6">
    <div className="animate-pulse rounded-2xl bg-neutral-800 p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-neutral-700" />
        <div className="h-4 w-24 rounded bg-neutral-700" />
      </div>
      <div className="h-6 w-1/2 rounded bg-neutral-700" />
      <div className="mx-auto h-64 w-64 rounded-full bg-neutral-700" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-neutral-700" />
        <div className="h-3 w-4/5 rounded bg-neutral-700" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-20 rounded-full bg-neutral-700" />
        ))}
      </div>
    </div>
  </div>
)
