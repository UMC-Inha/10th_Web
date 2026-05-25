import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getLps } from '../../apis/lpsApi';
import LpCard from '../../components/lps/LpCard';
import ErrorState from '../../components/ui/ErrorState';
import SortToggle from '../../components/ui/SortToggle';
import { SkeletonGrid } from '../../components/ui/SkeletonCard';
import { LP_PAGE_SIZE, SCROLL_THRESHOLD_PX, SCROLL_THROTTLE_MS, SKELETON_LP_FETCH_MORE_COUNT, SKELETON_LP_GRID_COUNT } from '../../constants/pagination';
import { ROUTES } from '../../constants/paths';
import { DEBOUNCE_SEARCH_MS, GC_TIME_10_MIN, STALE_TIME_3_MIN } from '../../constants/queryConfig';
import { QUERY_KEYS } from '../../constants/queryKeys';
import useDebounce from '../../hooks/useDebounce';
import useThrottle from '../../hooks/useThrottle';
import { DEFAULT_LP_SORT_ORDER, type LpSortOrder } from '../../types/lp';

function LpsPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<LpSortOrder>(DEFAULT_LP_SORT_ORDER);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search.trim(), DEBOUNCE_SEARCH_MS);

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
    queryKey: QUERY_KEYS.lps(sort, debouncedSearch),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLps({
        order: sort,
        limit: LP_PAGE_SIZE,
        cursor: pageParam,
        search: debouncedSearch || undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
    staleTime: STALE_TIME_3_MIN,
    gcTime: GC_TIME_10_MIN,
  });

  const handleScroll = useThrottle(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - SCROLL_THRESHOLD_PX;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, SCROLL_THROTTLE_MS);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const lps = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const handleCardClick = useCallback((id: number) => navigate(ROUTES.lpDetail(id)), [navigate]);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <SortToggle value={sort} onChange={setSort} size="md" />
      </div>

      {isLoading && <SkeletonGrid count={SKELETON_LP_GRID_COUNT} />}

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

              {isFetchingNextPage && (
                <div className="mt-1">
                  <SkeletonGrid count={SKELETON_LP_FETCH_MORE_COUNT} />
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
