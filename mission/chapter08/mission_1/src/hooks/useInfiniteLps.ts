import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../api/lp';

const useInfiniteLps = (order: 'asc' | 'desc', search: string = '') => {
  const trimmedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: ['search', order, trimmedSearch],

    queryFn: ({ pageParam = 0 }) => getLps(order, pageParam, trimmedSearch),

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },

    initialPageParam: 0,

    enabled: true,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useInfiniteLps;
