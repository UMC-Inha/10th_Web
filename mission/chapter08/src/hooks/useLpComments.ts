import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { createComment, deleteComment, getComments, updateComment } from '../apis/lpsApi';
import { COMMENT_PAGE_SIZE } from '../constants/pagination';
import { GC_TIME_10_MIN, STALE_TIME_2_MIN } from '../constants/queryConfig';
import { QUERY_KEYS } from '../constants/queryKeys';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import useIntersectionObserver from './useIntersectionObserver';
import { DEFAULT_LP_SORT_ORDER, type LpSortOrder } from '../types/lp';
import type { UserInfo } from '../types/user';

type UseLpCommentsOptions = {
  lpId: number;
  myInfo: UserInfo | undefined;
  loggedIn: boolean;
};

function useLpComments({ lpId, myInfo, loggedIn }: UseLpCommentsOptions) {
  const queryClient = useQueryClient();
  const [commentOrder, setCommentOrder] = useState<LpSortOrder>(DEFAULT_LP_SORT_ORDER);
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    isSuccess: isCommentsSuccess,
    isFetchingNextPage: isCommentsFetchingNext,
    hasNextPage: commentsHasNext,
    fetchNextPage: fetchNextComments,
    refetch: refetchComments,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.lpComments(lpId, commentOrder),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getComments(lpId, { order: commentOrder, limit: COMMENT_PAGE_SIZE, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
    enabled: loggedIn,
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_10_MIN,
  });

  const commentTriggerRef = useIntersectionObserver({
    enabled: !!commentsHasNext && !isCommentsFetchingNext,
    onIntersect: () => {
      if (commentsHasNext && !isCommentsFetchingNext) {
        fetchNextComments();
      }
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      setCommentInput('');
      setCommentError('');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpCommentsAll(lpId) });
    },
    onError: (err) => {
      setCommentError(getApiErrorMessage(err, '댓글 작성에 실패했습니다.'));
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, content),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent('');
      setCommentError('');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpCommentsAll(lpId) });
    },
    onError: (err) => {
      setCommentError(getApiErrorMessage(err, '댓글 수정에 실패했습니다.'));
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      setDeleteCommentId(null);
      setCommentError('');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpCommentsAll(lpId) });
    },
    onError: (err) => {
      setCommentError(getApiErrorMessage(err, '댓글 삭제에 실패했습니다.'));
    },
  });

  const comments = commentsData?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const handleCommentSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentInput.trim()) {
        setCommentError('댓글 내용을 입력해주세요.');
        return;
      }
      createCommentMutation.mutate(commentInput.trim());
    },
    [commentInput, createCommentMutation],
  );

  const handleStartEditComment = useCallback((commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
    setOpenMenuCommentId(null);
  }, []);

  const handleCancelEditComment = useCallback(() => {
    setEditingCommentId(null);
    setEditingContent('');
  }, []);

  const handleSubmitEditComment = useCallback(
    (commentId: number) => {
      if (!editingContent.trim()) return;
      updateCommentMutation.mutate({ commentId, content: editingContent.trim() });
    },
    [editingContent, updateCommentMutation],
  );

  const closeMenu = useCallback(() => setOpenMenuCommentId(null), []);

  return {
    comments,
    commentOrder,
    setCommentOrder,
    commentInput,
    setCommentInput,
    commentError,
    setCommentError,
    editingCommentId,
    editingContent,
    setEditingContent,
    openMenuCommentId,
    setOpenMenuCommentId,
    deleteCommentId,
    setDeleteCommentId,
    isCommentsLoading,
    isCommentsError,
    isCommentsSuccess,
    isCommentsFetchingNext,
    commentsHasNext,
    refetchComments,
    commentTriggerRef,
    myInfo,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    handleCommentSubmit,
    handleStartEditComment,
    handleCancelEditComment,
    handleSubmitEditComment,
    closeMenu,
  };
}

export default useLpComments;
