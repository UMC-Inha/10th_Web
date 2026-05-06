import { useQuery } from '@tanstack/react-query';
import { getLps } from '../api/lp';

const useLps = (order: 'asc' | 'desc') => {
  return useQuery({
    queryKey: ['lps', order], // order 바뀌면 자동으로 리패치
    queryFn: () => getLps(order),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 10,   // 10분 후 캐시 삭제
  });
};

export default useLps;