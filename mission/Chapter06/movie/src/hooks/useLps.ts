import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { LpListResponse, LpDetailResponse, SortOrder } from '../types/lp'

export function useLps(order: SortOrder = 'desc') {
  return useQuery({
    queryKey: ['lps', order],
    queryFn: async () => {
      const { data } = await api.get<LpListResponse>('/v1/lps', {
        params: { order, limit: 20 },
      })
      return data.data
    },
    staleTime: 1000 * 60 * 5,  // 5분: 캐시 데이터를 신선한 것으로 유지
    gcTime: 1000 * 60 * 10,    // 10분: 미사용 캐시 보존 시간
  })
}

export function useLp(lpId: number) {
  return useQuery({
    queryKey: ['lps', lpId],
    queryFn: async () => {
      const { data } = await api.get<LpDetailResponse>(`/v1/lps/${lpId}`)
      return data.data
    },
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
