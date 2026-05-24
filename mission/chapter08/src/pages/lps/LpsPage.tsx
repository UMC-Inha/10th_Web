import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getLps } from '../../apis/lpsApi';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonGrid } from '../../components/ui/SkeletonCard';
import useDebounce from '../../hooks/useDebounce';
import useThrottle from '../../hooks/useThrottle';
import type { LpDto, LpSortOrder } from '../../types/lp';
import { formatDate } from '../../utils/formatDate';

type LpCardProps = {
  lp: LpDto;
  onNavigate: (id: number) => void;
};

const LpCard = memo(function LpCard({ lp, onNavigate }: LpCardProps) {
  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-neutral-800"
      onClick={() => onNavigate(lp.id)}
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
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search.trim(), 300);

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
    queryKey: ['lps', sort, debouncedSearch],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLps({
        order: sort,
        limit: 20,
        cursor: pageParam,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
    enabled: true,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  // 스크롤 이벤트 핸들러: 페이지 하단 300px 이내 진입 시 다음 페이지 요청
  const handleScroll = useThrottle(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, 1000);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const lps = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const handleCardClick = useCallback((id: number) => navigate(`/lp/${id}`), [navigate]);

  return (
    <div className="p-4">
      {/* 검색창 + 정렬 버튼 */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 검색 입력 */}
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="LP 검색..."
            className="w-full rounded-lg border border-white/20 bg-neutral-800 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-pink-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>

        {/* 정렬 버튼 */}
        <div className="flex shrink-0 gap-2">
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
      </div>

      {/* 초기 로딩 — 상단에 Skeleton */}
      {isLoading && <SkeletonGrid count={20} />}

      {isError && (
        <ErrorState message="LP 목록을 불러오는 데 실패했습니다." onRetry={() => refetch()} />
      )}

      {isSuccess && (
        <>
          {lps.length === 0 ? (
            <p className="mt-20 text-center text-sm text-slate-500">
              {debouncedSearch
                ? `"${debouncedSearch}"에 대한 검색 결과가 없습니다.`
                : 'LP가 없습니다.'}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5">
                {lps.map((lp) => (
                  <LpCard key={lp.id} lp={lp} onNavigate={handleCardClick} />
                ))}
              </div>

              {/* 추가 로딩 — 하단에 Skeleton */}
              {isFetchingNextPage && (
                <div className="mt-1">
                  <SkeletonGrid count={10} />
                </div>
              )}

              {!hasNextPage && (
                <p className="mt-6 text-center text-xs text-slate-600">모든 LP를 불러왔습니다.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default LpsPage;
