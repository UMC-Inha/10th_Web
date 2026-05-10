import { useInfiniteQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { CommentListResponse, SortOrder } from '../types/lp'

export function useComments(lpId: number, order: SortOrder = 'asc', hasToken: boolean = false) {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<CommentListResponse>(
        `/v1/lps/${lpId}/comments`,
        {
          params: {
            order,
            limit: 10,
            ...(pageParam !== undefined && { cursor: pageParam }),
          },
        },
      )
      return data.data
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    // 댓글 API는 인증 필요 — 토큰 없으면 요청하지 않음
    enabled: !!lpId && hasToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
