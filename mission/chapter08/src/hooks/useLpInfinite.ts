import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { getLps } from '../apis/lpsApi';
import { APP_SCROLL_ROOT_ID } from '../constants/layout';
import { LP_PAGE_SIZE, SCROLL_THRESHOLD_PX, SCROLL_THROTTLE_MS } from '../constants/pagination';
import { DEBOUNCE_SEARCH_MS, GC_TIME_10_MIN, STALE_TIME_3_MIN } from '../constants/queryConfig';
import { QUERY_KEYS } from '../constants/queryKeys';
import { DEFAULT_LP_SORT_ORDER, type LpSortOrder } from '../types/lp';
import useDebounce from './useDebounce';
import useThrottle from './useThrottle';

function useLpInfinite() {
  const [sort, setSort] = useState<LpSortOrder>(DEFAULT_LP_SORT_ORDER);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), DEBOUNCE_SEARCH_MS);

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isSuccess,
    ...queryRest
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

  const lps = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const tryLoadMore = useCallback(() => {
    const scrollRoot = document.getElementById(APP_SCROLL_ROOT_ID);
    if (!scrollRoot) return;

    const nearBottom =
      scrollRoot.scrollTop + scrollRoot.clientHeight >=
      scrollRoot.scrollHeight - SCROLL_THRESHOLD_PX;

    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = useThrottle(tryLoadMore, SCROLL_THROTTLE_MS);

  useEffect(() => {
    const scrollRoot = document.getElementById(APP_SCROLL_ROOT_ID);
    if (!scrollRoot) return;

    scrollRoot.addEventListener('scroll', handleScroll);
    return () => scrollRoot.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 콘텐츠가 짧아 스크롤바가 없을 때도 연속 로드
  useEffect(() => {
    if (!isSuccess || isFetchingNextPage) return;
    tryLoadMore();
  }, [isSuccess, isFetchingNextPage, lps.length, hasNextPage, tryLoadMore]);

  return {
    sort,
    setSort,
    search,
    setSearch,
    debouncedSearch,
    lps,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isSuccess,
    ...queryRest,
  };
}

export default useLpInfinite;
