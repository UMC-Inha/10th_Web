import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../api/lp';

const useInfiniteLps = (order: 'asc' | 'desc') => {
  return useInfiniteQuery({
    queryKey: ['lps', order],
    queryFn: ({ pageParam = 0 }) => getLps(order, pageParam),

    // 다음 페이지 커서 계산
    // nextCursor가 있으면 다음 페이지 있음
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },

    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export default useInfiniteLps;