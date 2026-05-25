import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { deleteLp, getLpById, toggleLike } from '../apis/lpsApi';
import { getMyInfo } from '../apis/usersApi';
import { GC_TIME_10_MIN, STALE_TIME_3_MIN } from '../constants/queryConfig';
import { ROUTES } from '../constants/paths';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useAuth } from '../contexts/AuthContext';
import type { LpDetailDto } from '../types/lp';

function useLpDetail(lpId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const [likeError, setLikeError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const { data: myInfo } = useQuery({
    queryKey: QUERY_KEYS.myInfo,
    queryFn: getMyInfo,
    enabled: loggedIn,
  });

  const lpQuery = useQuery({
    queryKey: QUERY_KEYS.lp(lpId),
    queryFn: () => getLpById(lpId),
    staleTime: STALE_TIME_3_MIN,
    gcTime: GC_TIME_10_MIN,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(lpId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lp(lpId) });

      const previousLp = queryClient.getQueryData<LpDetailDto>(QUERY_KEYS.lp(lpId));

      if (previousLp && myInfo) {
        const alreadyLiked = previousLp.likes.some((like) => like.userId === myInfo.id);
        const optimisticLikes = alreadyLiked
          ? previousLp.likes.filter((like) => like.userId !== myInfo.id)
          : [...previousLp.likes, { id: Date.now(), userId: myInfo.id, lpId }];

        queryClient.setQueryData(QUERY_KEYS.lp(lpId), {
          ...previousLp,
          likes: optimisticLikes,
        });
      }

      setLikeError('');
      return { previousLp };
    },
    onError: (err, _, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(QUERY_KEYS.lp(lpId), context.previousLp);
      }
      setLikeError(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lp(lpId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpsAll });
      navigate(ROUTES.home, { replace: true });
    },
    onError: (err) => {
      setDeleteError(err instanceof Error ? err.message : 'LP 삭제에 실패했습니다.');
    },
  });

  const lp = lpQuery.data;
  const isOwner = !!myInfo && !!lp && myInfo.id === lp.authorId;
  const isLiked = !!myInfo && !!lp && lp.likes.some((like) => like.userId === myInfo.id);

  return {
    lp,
    myInfo,
    isLoading: lpQuery.isLoading,
    isError: lpQuery.isError,
    refetch: lpQuery.refetch,
    isOwner,
    isLiked,
    likeError,
    deleteError,
    likeMutation,
    deleteMutation,
  };
}

export default useLpDetail;
