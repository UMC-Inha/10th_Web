import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../api/lp';
import type { CommentListResponse } from '../types/lp';

const useInfiniteComments = (lpId: number, order: 'asc' | 'desc') => {
  return useInfiniteQuery<CommentListResponse, Error>({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam }) => getComments(lpId, order, pageParam as number),
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useInfiniteComments;