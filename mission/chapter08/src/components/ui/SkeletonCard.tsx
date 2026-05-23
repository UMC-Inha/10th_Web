// ── LP 카드 스켈레톤 ────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="aspect-square animate-pulse rounded-md bg-white/10" />
  );
}

type SkeletonGridProps = {
  count?: number;
};

export function SkeletonGrid({ count = 20 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ── 댓글 스켈레톤 ────────────────────────────────────────

export function SkeletonComment() {
  return (
    <div className="animate-pulse flex flex-col gap-2 rounded-xl bg-white/5 p-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-white/15" />
        <div className="h-3 w-24 rounded bg-white/15" />
        <div className="h-3 w-16 rounded bg-white/10 ml-auto" />
      </div>
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-3/4 rounded bg-white/10" />
    </div>
  );
}

type SkeletonCommentListProps = {
  count?: number;
};

export function SkeletonCommentList({ count = 5 }: SkeletonCommentListProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComment key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;
