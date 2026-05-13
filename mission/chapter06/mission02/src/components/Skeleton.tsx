// src/components/Skeleton.tsx

// 카드 스켈레톤 (메인 페이지 그리드용)
export const CardSkeleton = () => (
  <div className="aspect-square bg-zinc-800 rounded-sm animate-pulse" />
);

// 카드 스켈레톤 그리드
export const CardSkeletonGrid = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// 댓글 스켈레톤 (상세 페이지용)
export const CommentSkeleton = () => (
  <div className="flex items-start gap-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 bg-zinc-700 rounded w-24" />
      <div className="h-3 bg-zinc-700 rounded w-full" />
    </div>
  </div>
);

// 댓글 스켈레톤 리스트
export const CommentSkeletonList = ({ count = 8 }: { count?: number }) => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </div>
);