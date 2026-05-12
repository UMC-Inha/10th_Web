import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../api/lp';

type CommentPage = Awaited<ReturnType<typeof getComments>>;

const useInfiniteComments = (lpId: number, order: 'asc' | 'desc') => {
  return useInfiniteQuery<
    CommentPage,
    Error,
    CommentPage,
    ['lpComments', number, 'asc' | 'desc'],
    number
  >({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam }) => getComments(lpId, order, pageParam),

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },

    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useInfiniteComments;
