import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { getLps } from '../../apis/lpsApi';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonGrid } from '../../components/ui/SkeletonCard';
import type { LpDto, LpSortOrder } from '../../types/lp';
import { formatDate } from '../../utils/formatDate';

type LpCardProps = {
  lp: LpDto;
  onClick: () => void;
};

const LpCard = memo(function LpCard({ lp, onClick }: LpCardProps) {
  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-neutral-800"
      onClick={onClick}
    >
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full bg-neutral-700" />
      )}

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold text-white">{lp.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
          <span>{formatDate(lp.createdAt)}</span>
          <span className="flex items-center gap-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {lp.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
});

function LpsPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<LpSortOrder>('desc');
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLps({ order: sort, limit: 20, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  // IntersectionObserver: 목록 하단에 도달하면 다음 페이지 요청
  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lps = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const handleCardClick = useCallback((id: number) => () => navigate(`/lp/${id}`), [navigate]);

  return (
    <div className="p-4">
      {/* 정렬 버튼 */}
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => setSort('asc')}
          className={[
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            sort === 'asc'
              ? 'border-pink-500 bg-pink-500 text-white'
              : 'border-white/20 text-slate-300 hover:border-white/40',
          ].join(' ')}
        >
          오래된순
        </button>
        <button
          onClick={() => setSort('desc')}
          className={[
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            sort === 'desc'
              ? 'border-pink-500 bg-pink-500 text-white'
              : 'border-white/20 text-slate-300 hover:border-white/40',
          ].join(' ')}
        >
          최신순
        </button>
      </div>

      {/* 초기 로딩 — 상단에 Skeleton */}
      {isLoading && <SkeletonGrid count={20} />}

      {isError && (
        <ErrorState message="LP 목록을 불러오는 데 실패했습니다." onRetry={() => refetch()} />
      )}

      {isSuccess && (
        <>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} onClick={handleCardClick(lp.id)} />
            ))}
          </div>

          {/* 추가 로딩 — 하단에 Skeleton */}
          {isFetchingNextPage && (
            <div className="mt-1">
              <SkeletonGrid count={10} />
            </div>
          )}

          {/* 스크롤 트리거 감지 요소 */}
          <div ref={triggerRef} className="h-4" />

          {!hasNextPage && lps.length > 0 && (
            <p className="mt-6 text-center text-xs text-slate-600">모든 LP를 불러왔습니다.</p>
          )}
        </>
      )}
    </div>
  );
}

export default LpsPage;
