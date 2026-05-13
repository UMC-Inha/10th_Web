import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { LpListResponse, LpDetailResponse, SortOrder } from '../types/lp'

const LIMIT = 20

export function useLps(order: SortOrder = 'desc') {
  return useInfiniteQuery({
    queryKey: ['lps', 'list', order],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<LpListResponse>('/v1/lps', {
        params: {
          order,
          limit: LIMIT,
          // pageParam이 undefined이면 커서 없이 첫 페이지 요청
          ...(pageParam !== undefined && { cursor: pageParam }),
        },
      })
      return data.data
    },
    // 첫 요청은 커서 없이 시작
    initialPageParam: undefined as number | undefined,
    // 다음 커서가 있으면 반환, 없으면 undefined → fetchNextPage 중단
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

export function useLp(lpId: number) {
  return useQuery({
    queryKey: ['lps', 'detail', lpId],
    queryFn: async () => {
      const { data } = await api.get<LpDetailResponse>(`/v1/lps/${lpId}`)
      return data.data
    },
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
