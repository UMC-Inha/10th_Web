import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps, searchLps } from '../api/lpApi';
import type { SortOrder } from '../types/lp';

export function useSearchLps(query: string | undefined, sort: SortOrder) {
  const isSearching = !!query?.trim();

  return useInfiniteQuery({
    queryKey: ['lps', query ?? '', sort],
    queryFn: ({ pageParam }) =>
      isSearching
        ? searchLps(query!, sort, pageParam as number, 20)
        : getLps(sort, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
}
