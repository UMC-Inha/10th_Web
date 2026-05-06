import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../api/lp';

const useLpDetail = (lpId: number) => {
  return useQuery({
    queryKey: ['lp', lpId], // lpId 포함
    queryFn: () => getLpDetail(lpId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export default useLpDetail;