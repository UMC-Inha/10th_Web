import { useEffect, useRef } from 'react'

const GRID_CLS = 'grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

// Web Animations API로 shimmer 적용 — CSS 클래스 의존 없음
const SkeletonBox = ({ className = '' }: { className?: string }) => {
  const shimmerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = shimmerRef.current
    if (!el) return
    el.animate(
      [{ transform: 'translateX(-100%)' }, { transform: 'translateX(100%)' }],
      { duration: 1500, iterations: Infinity, easing: 'linear' },
    )
  }, [])

  return (
    <div className={`relative overflow-hidden bg-neutral-700 ${className}`}>
      <div
        ref={shimmerRef}
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
        }}
      />
    </div>
  )
}

export const GridSkeleton = ({ count = 10 }: { count?: number }) => (
  <div className={`${GRID_CLS} py-6 px-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonBox key={i} className="aspect-square" />
    ))}
  </div>
)

export const BottomSkeleton = () => (
  <div className={`${GRID_CLS} px-4 pb-4`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonBox key={i} className="aspect-square" />
    ))}
  </div>
)

// 댓글 스켈레톤 (아바타 + 이름/내용 두 줄)
export const CommentSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <SkeletonBox className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2 pt-1">
          <SkeletonBox className="h-3 w-20 rounded" />
          <SkeletonBox className="h-3 w-full rounded" />
        </div>
      </div>
    ))}
  </div>
)

export const DetailSkeleton = () => (
  <div className="mx-auto max-w-2xl p-6">
    <div className="rounded-2xl bg-neutral-800 p-8 space-y-6">
      <div className="flex items-center gap-3">
        <SkeletonBox className="h-10 w-10 rounded-full" />
        <SkeletonBox className="h-4 w-24 rounded" />
      </div>
      <SkeletonBox className="h-6 w-1/2 rounded" />
      <SkeletonBox className="mx-auto h-64 w-64 rounded-full" />
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-full rounded" />
        <SkeletonBox className="h-3 w-4/5 rounded" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <SkeletonBox key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>
  </div>
)
