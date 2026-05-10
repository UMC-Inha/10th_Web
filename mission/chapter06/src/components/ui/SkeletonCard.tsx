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

export default SkeletonCard;
