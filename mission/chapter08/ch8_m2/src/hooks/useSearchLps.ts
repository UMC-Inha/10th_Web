import { useInfiniteQuery } from '@tanstack/react-query';
import { searchLps } from '../api/lpApi';
import type { SortOrder } from '../types/lp';

export function useSearchLps(query: string, sort: SortOrder) {
  return useInfiniteQuery({
    queryKey: ['search', query, sort],
    queryFn: ({ pageParam }) => searchLps(query, sort, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
}
