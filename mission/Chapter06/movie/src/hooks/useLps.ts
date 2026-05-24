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
          ...(pageParam !== undefined && { cursor: pageParam }),
        },
      })
      return data.data
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

export function useSearchLps(debouncedQuery: string, order: SortOrder = 'desc') {
  const trimmed = debouncedQuery.trim()
  return useInfiniteQuery({
    queryKey: ['lps', 'search', trimmed, order],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<LpListResponse>('/v1/lps', {
        params: {
          search: trimmed,
          order,
          limit: LIMIT,
          ...(pageParam !== undefined && { cursor: pageParam }),
        },
      })
      return data.data
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: trimmed.length > 0,
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
