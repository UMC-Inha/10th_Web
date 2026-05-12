import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { createComment, deleteLp, getComments, getLpById, toggleLike } from '../../apis/lpsApi';
import { getMyInfo } from '../../apis/usersApi';
import ConfirmModal from '../../components/modals/ConfirmModal';
import LoginModal from '../../components/modals/LoginModal';
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

  const [commentOrder, setCommentOrder] = useState<LpSortOrder>('desc');
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState('');
  const commentTriggerRef = useRef<HTMLDivElement>(null);

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

  // ── 댓글 목록 (useInfiniteQuery) ────────────────────────
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
      getComments(numericLpId!, {
        order: commentOrder,
        limit: 10,
        cursor: pageParam,
      }),
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

  // ── 좋아요 ────────────────────────────────────────────
  const [likeError, setLikeError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(numericLpId!),
    onSuccess: () => {
      setLikeError('');
      queryClient.invalidateQueries({ queryKey: ['lp', numericLpId] });
    },
    onError: (err) => {
      setLikeError(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.');
    },
  });

  // ── 삭제 ─────────────────────────────────────────────
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

  const isOwner = !!myInfo && !!lp && myInfo.id === lp.authorId;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setCommentError('댓글 내용을 입력해주세요.');
      return;
    }
    createCommentMutation.mutate(commentInput.trim());
  };

  // ── 비로그인 모달 ────────────────────────────────────
  if (!loggedIn) {
    return <LoginModal from={location.pathname} />;
  }

  // ── 로딩 ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  // ── 에러 ────────────────────────────────────────────
  if (isError || !lp) {
    return <ErrorState message="LP 정보를 불러오는 데 실패했습니다." onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
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
      {likeError && (
        <p className="mb-2 text-xs text-red-400">{likeError}</p>
      )}
      <div className="mb-10 flex flex-wrap gap-3">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 rounded-lg border border-pink-500 px-4 py-2 text-sm font-medium text-pink-400 hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          좋아요 {lp.likes.length}
        </button>
        {deleteError && (
          <p className="w-full text-xs text-red-400">{deleteError}</p>
        )}
        {isOwner && (
          <>
            {/* TODO: LP 수정 기능 구현 */}
            <button
              disabled
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-500 cursor-not-allowed opacity-40"
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

      {/* ── 댓글 섹션 ─────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">댓글</h2>

          {/* 댓글 정렬 */}
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

        {/* 초기 로딩 — 상단 Skeleton */}
        {isCommentsLoading && <SkeletonCommentList count={5} />}

        {isCommentsError && (
          <ErrorState
            message="댓글을 불러오는 데 실패했습니다."
            onRetry={() => refetchComments()}
          />
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
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-colors"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-xs font-semibold text-pink-400">
                        {comment.authorId}
                      </div>
                      <span className="text-xs text-slate-400">
                        사용자 #{comment.authorId}
                      </span>
                      <span className="ml-auto text-xs text-slate-600">
                        {formatDate(comment.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 추가 로딩 — 하단 Skeleton */}
            {isCommentsFetchingNext && (
              <div className="mt-3">
                <SkeletonCommentList count={3} />
              </div>
            )}

            {/* 스크롤 트리거 */}
            <div ref={commentTriggerRef} className="h-4" />

            {!commentsHasNext && comments.length > 0 && (
              <p className="mt-4 text-center text-xs text-slate-600">
                모든 댓글을 불러왔습니다.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default LpDetailPage;
