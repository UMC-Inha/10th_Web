import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../api/lp';

const useInfiniteComments = (lpId: number, order: 'asc' | 'desc') => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 0 }) => getComments(lpId, order, pageParam),

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },

    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export default useInfiniteComments;