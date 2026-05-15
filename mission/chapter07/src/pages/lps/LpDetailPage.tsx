import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  createComment,
  deleteComment,
  deleteLp,
  getComments,
  getLpById,
  toggleLike,
  updateComment,
} from '../../apis/lpsApi';
import { getMyInfo } from '../../apis/usersApi';
import ConfirmModal from '../../components/modals/ConfirmModal';
import LoginModal from '../../components/modals/LoginModal';
import LpEditModal from '../../components/modals/LpEditModal';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCommentList } from '../../components/ui/SkeletonCard';
import type { LpSortOrder } from '../../types/lp';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/formatDate';

function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { loggedIn } = useAuth();
  const numericLpId = lpId && !isNaN(Number(lpId)) ? Number(lpId) : null;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [commentOrder, setCommentOrder] = useState<LpSortOrder>('desc');
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState('');
  const commentTriggerRef = useRef<HTMLDivElement>(null);

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  // ── 현재 로그인 유저 ────────────────────────────────────
  const { data: myInfo } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    enabled: loggedIn,
  });

  // ── LP 상세 ────────────────────────────────────────────
  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', numericLpId],
    queryFn: () => getLpById(numericLpId!),
    enabled: numericLpId !== null,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  // ── 댓글 목록 ───────────────────────────────────────────
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
    queryKey: ['lpComments', numericLpId, commentOrder],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getComments(numericLpId!, { order: commentOrder, limit: 10, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
    enabled: numericLpId !== null && loggedIn,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });

  // 댓글 스크롤 트리거
  useEffect(() => {
    const el = commentTriggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && commentsHasNext && !isCommentsFetchingNext) {
          fetchNextComments();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [commentsHasNext, isCommentsFetchingNext, fetchNextComments]);

  const comments = commentsData?.pages.flatMap((p) => p?.data ?? []) ?? [];

  // ── 좋아요 (낙관적 업데이트) ──────────────────────────
  const [likeError, setLikeError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(numericLpId!),

    // 1단계: 서버 요청 직전 — 캐시를 즉시 낙관적으로 변경
    onMutate: async () => {
      // 진행 중인 리페치가 캐시를 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({ queryKey: ['lp', numericLpId] });

      // 롤백을 위해 이전 LP 데이터 저장
      const previousLp = queryClient.getQueryData<typeof lp>(['lp', numericLpId]);

      if (previousLp && myInfo) {
        const alreadyLiked = previousLp.likes.some((like) => like.userId === myInfo.id);

        // 좋아요 상태를 즉시 토글
        const optimisticLikes = alreadyLiked
          ? previousLp.likes.filter((like) => like.userId !== myInfo.id)
          : [
              ...previousLp.likes,
              { id: Date.now(), userId: myInfo.id, lpId: numericLpId! },
            ];

        queryClient.setQueryData(['lp', numericLpId], {
          ...previousLp,
          likes: optimisticLikes,
        });
      }

      setLikeError('');
      return { previousLp };
    },

    // 2단계: 요청 실패 시 — 이전 데이터로 롤백
    onError: (err, _, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(['lp', numericLpId], context.previousLp);
      }
      setLikeError(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.');
    },

    // 3단계: 성공/실패 무관 — 서버 최종 상태와 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', numericLpId] });
    },
  });

  // ── LP 삭제 ─────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(numericLpId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/', { replace: true });
    },
    onError: (err) => {
      setDeleteError(err instanceof Error ? err.message : 'LP 삭제에 실패했습니다.');
    },
  });

  // ── 댓글 작성 ────────────────────────────────────────
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(numericLpId!, content),
    onSuccess: () => {
      setCommentInput('');
      setCommentError('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', numericLpId] });
    },
    onError: (err) => {
      setCommentError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.');
    },
  });

  // ── 댓글 수정 ────────────────────────────────────────
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(numericLpId!, commentId, content),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', numericLpId] });
    },
  });

  // ── 댓글 삭제 ────────────────────────────────────────
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(numericLpId!, commentId),
    onSuccess: () => {
      setDeleteCommentId(null);
      queryClient.invalidateQueries({ queryKey: ['lpComments', numericLpId] });
    },
  });

  const isOwner = !!myInfo && !!lp && myInfo.id === lp.authorId;
  const isLiked = !!myInfo && !!lp && lp.likes.some((like) => like.userId === myInfo.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setCommentError('댓글 내용을 입력해주세요.');
      return;
    }
    createCommentMutation.mutate(commentInput.trim());
  };

  const handleStartEditComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
    setOpenMenuCommentId(null);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleSubmitEditComment = (commentId: number) => {
    if (!editingContent.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editingContent.trim() });
  };

  // ── 비로그인 모달 ─────────────────────────────────────
  if (!loggedIn) {
    return <LoginModal from={location.pathname} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !lp) {
    return <ErrorState message="LP 정보를 불러오는 데 실패했습니다." onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* LP 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <ConfirmModal
          message="정말 삭제하시겠습니까?&#10;삭제된 LP는 복구할 수 없습니다."
          confirmLabel="삭제"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            deleteMutation.mutate();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* 댓글 삭제 확인 모달 */}
      {deleteCommentId !== null && (
        <ConfirmModal
          message="댓글을 삭제하시겠습니까?"
          confirmLabel="삭제"
          onConfirm={() => deleteCommentMutation.mutate(deleteCommentId)}
          onCancel={() => setDeleteCommentId(null)}
        />
      )}

      {/* LP 수정 모달 */}
      {showEditModal && (
        <LpEditModal lp={lp} onClose={() => setShowEditModal(false)} />
      )}

      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5m7-7-7 7 7 7" />
        </svg>
        뒤로가기
      </button>

      {/* 썸네일 */}
      {lp.thumbnail && (
        <div className="mb-6 overflow-hidden rounded-xl">
          <img src={lp.thumbnail} alt={lp.title} className="w-full object-cover max-h-80" />
        </div>
      )}

      {/* 제목 & 메타 */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">{lp.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>{formatDate(lp.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {lp.likes.length}
          </span>
          {lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lp.tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="mb-8 rounded-xl bg-white/5 p-5 text-slate-300 leading-relaxed whitespace-pre-wrap">
        {lp.content || '본문이 없습니다.'}
      </div>

      {/* 액션 버튼 */}
      {likeError && <p className="mb-2 text-xs text-red-400">{likeError}</p>}
      <div className="mb-10 flex flex-wrap gap-3">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className={[
            'flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
            isLiked
              ? 'border-pink-500 bg-pink-500 text-white hover:bg-pink-600'
              : 'border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white',
          ].join(' ')}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isLiked ? '0' : '2'}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {isLiked ? '좋아요 취소' : '좋아요'} {lp.likes.length}
        </button>

        {deleteError && <p className="w-full text-xs text-red-400">{deleteError}</p>}

        {isOwner && (
          <>
            <button
              onClick={() => setShowEditModal(true)}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
            >
              삭제
            </button>
          </>
        )}
      </div>

      {/* ── 댓글 섹션 ───────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">댓글</h2>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCommentOrder('asc')}
              className={[
                'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                commentOrder === 'asc'
                  ? 'border-pink-500 bg-pink-500 text-white'
                  : 'border-white/20 text-slate-400 hover:border-white/40',
              ].join(' ')}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentOrder('desc')}
              className={[
                'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                commentOrder === 'desc'
                  ? 'border-pink-500 bg-pink-500 text-white'
                  : 'border-white/20 text-slate-400 hover:border-white/40',
              ].join(' ')}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-3 border border-white/10 focus-within:border-pink-500/50 transition-colors">
            <textarea
              value={commentInput}
              onChange={(e) => {
                setCommentInput(e.target.value);
                if (commentError) setCommentError('');
              }}
              placeholder="댓글을 입력해주세요..."
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-white placeholder-slate-500 outline-none leading-relaxed"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              {commentError ? (
                <p className="text-xs text-red-400">{commentError}</p>
              ) : (
                <p className="text-xs text-slate-600">{commentInput.length}/500자</p>
              )}
              <button
                type="submit"
                disabled={createCommentMutation.isPending || !commentInput.trim()}
                className="rounded-lg bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createCommentMutation.isPending ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </div>
        </form>

        {/* 초기 로딩 */}
        {isCommentsLoading && <SkeletonCommentList count={5} />}

        {isCommentsError && (
          <ErrorState message="댓글을 불러오는 데 실패했습니다." onRetry={() => refetchComments()} />
        )}

        {/* 댓글 목록 */}
        {isCommentsSuccess && (
          <>
            {comments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-600">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((comment) => {
                  const isMyComment = !!myInfo && myInfo.id === comment.authorId;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div
                      key={comment.id}
                      className="rounded-xl bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-colors"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-xs font-semibold text-pink-400">
                          {comment.authorId}
                        </div>
                        <span className="text-xs text-slate-400">사용자 #{comment.authorId}</span>
                        <span className="ml-auto flex items-center gap-2 text-xs text-slate-600">
                          {formatDate(comment.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}

                          {/* 본인 댓글 메뉴 */}
                          {isMyComment && !isEditing && (
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenMenuCommentId(openMenuCommentId === comment.id ? null : comment.id)
                                }
                                className="rounded p-0.5 text-slate-500 hover:text-white transition-colors"
                                aria-label="댓글 메뉴"
                              >
                                •••
                              </button>

                              {openMenuCommentId === comment.id && (
                                <div className="absolute right-0 top-6 z-10 w-24 overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] shadow-xl">
                                  <button
                                    onClick={() => handleStartEditComment(comment.id, comment.content)}
                                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/10 transition-colors"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuCommentId(null);
                                      setDeleteCommentId(comment.id);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </span>
                      </div>

                      {/* 수정 중 인라인 편집기 */}
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-pink-500/50 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleCancelEditComment}
                              className="rounded-md border border-white/20 px-3 py-1 text-xs text-slate-400 hover:bg-white/10 transition-colors"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleSubmitEditComment(comment.id)}
                              disabled={updateCommentMutation.isPending || !editingContent.trim()}
                              className="rounded-md bg-pink-500 px-3 py-1 text-xs font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
                            >
                              {updateCommentMutation.isPending ? '저장 중...' : '저장'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {isCommentsFetchingNext && (
              <div className="mt-3">
                <SkeletonCommentList count={3} />
              </div>
            )}

            <div ref={commentTriggerRef} className="h-4" />

            {!commentsHasNext && comments.length > 0 && (
              <p className="mt-4 text-center text-xs text-slate-600">모든 댓글을 불러왔습니다.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default LpDetailPage;
