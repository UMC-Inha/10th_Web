// src/pages/LpDetailPage.tsx

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getLpDetail, postLike, deleteLike, deleteLp, updateLp } from '../apis/lp';
import { getComments, postComment, updateComment, deleteComment, type CommentOrder } from '../apis/comment';
import { useAuth } from '../context/AuthContext';
import { CommentSkeletonList, CommentSkeleton } from '../components/Skeleton';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { accessToken, name: currentUserName } = useAuth();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [commentOrder, setCommentOrder] = useState<CommentOrder>('desc');
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [openCommentMenuId, setOpenCommentMenuId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    tags: '' as string,
  });

  // LP 상세 조회
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(lpId!),
    enabled: !!lpId,
  });

  // 댓글 무한스크롤
  const {
    data: commentData,
    isLoading: commentLoading,
    isFetchingNextPage: commentFetchingNext,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, commentOrder],
    queryFn: ({ pageParam = 0 }) =>
      getComments(lpId!, commentOrder, pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext) return lastPage.data.nextCursor;
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!lpId,
  });

  // 댓글 무한스크롤 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextComments && !commentFetchingNext) {
          fetchNextComments();
        }
      },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextComments, commentFetchingNext, fetchNextComments]);

  const lp = data?.data;
  const comments = commentData?.pages.flatMap((p) => p.data.data) ?? [];
  const isAuthor = lp?.author.name === currentUserName;
  const isLiked = lp?.likes.some((like) => like.userId) ?? false;

  // 좋아요 토글
const likeMutation = useMutation({
    mutationFn: () => (isLiked ? deleteLike(Number(lpId)) : postLike(Number(lpId))),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: ['lp', lpId]});

      // 📌 1. getQueryKey 대신 getQueryData를 사용합니다!
      const previousLpData = queryClient.getQueryData(['lp', lpId]);

      // 📌 [2] 캐시 데이터를 낙관적으로 업데이트
      queryClient.setQueryData(['lp', lpId], (old: any) => {
        if (!old) return old;
        
        const newLikes = isLiked
          ? old.data.likes.filter((like: any) => like.userId !== 0)
          : [...old.data.likes, { userId: 0 }];

        return {
          ...old,
          data: {
            ...old.data,
            likes: newLikes,
          },
        };
      });

      return { previousLpData };
    },

    // 📌 [3] 안 쓰는 변수는 _를 붙여서 경고를 없앱니다!
    onError: (_err, _variables, context) => {
      if (context?.previousLpData) {
        queryClient.setQueryData(['lp', lpId], context.previousLpData);
      }
      alert('좋아요 처리에 실패했습니다.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });

  // LP 수정
  const updateMutation = useMutation({
    mutationFn: () => {
      const tags = editFormData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      return updateLp(Number(lpId), {
        title: editFormData.title,
        content: editFormData.content,
        tags,
        published: true,
      });
    },
    onSuccess: () => {
      setEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });

  // LP 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(Number(lpId)),
    onSuccess: () => navigate('/'),
  });

  // 댓글 작성
  const commentMutation = useMutation({
    mutationFn: () => postComment(lpId!, commentInput),
    onSuccess: () => {
      setCommentInput('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
    },
  });

  // 댓글 수정
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId!, commentId, content),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingCommentContent('');
      setOpenCommentMenuId(null);
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
    },
  });

  // 댓글 삭제
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId!, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
      setOpenCommentMenuId(null);
    },
  });

  const handleLikeToggle = () => {
    if (!accessToken) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      navigate('/login', { state: { from: `/lps/${lpId}` } });
      return;
    }
    likeMutation.mutate();
  };

  const handleEditOpen = () => {
    if (lp) {
      setEditFormData({
        title: lp.title,
        content: lp.content,
        tags: lp.tags.map((t) => t.name).join(', '),
      });
      setEditModalOpen(true);
    }
  };

  const handleEditSubmit = () => {
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  const handleCommentSubmit = () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (commentMutation.isPending || !commentInput.trim()) return;
    commentMutation.mutate();
  };

  const handleEditClick = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
    setOpenCommentMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editingCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    updateCommentMutation.mutate({ commentId, content: editingCommentContent });
  };

  const handleToggleCommentMenu = (commentId: number) => {
    setOpenCommentMenuId((prev) => (prev === commentId ? null : commentId));
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    return `${mins}분 전`;
  };

  if (isLoading) return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-8 bg-zinc-800 rounded mb-4 w-1/2" />
      <div className="aspect-square bg-zinc-800 rounded-xl mb-4 max-w-xs mx-auto" />
      <div className="h-4 bg-zinc-800 rounded mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-2/3 mx-auto" />
    </div>
  );

  if (isError || !lp) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-zinc-400">데이터를 불러오는 데 실패했습니다.</p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-500 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* 작성자 정보 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {lp.author.avatar ? (
            <img src={lp.author.avatar} alt={lp.author.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
              {lp.author.name[0]}
            </div>
          )}
          <span className="text-white font-semibold">{lp.author.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-sm">{timeAgo(lp.createdAt)}</span>
          {isAuthor && (
            <>
              <button
                onClick={handleEditOpen}
                className="text-zinc-400 hover:text-white transition-colors"
                title="수정"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="text-zinc-400 hover:text-red-400 transition-colors"
                title="삭제"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-white mb-6">{lp.title}</h1>

      {/* 썸네일 - LP 디스크 스타일 */}
      <div className="flex justify-center mb-6">
        <div className="relative w-72 h-72">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover rounded-full shadow-2xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#1a1a1a] rounded-full border-2 border-zinc-700" />
          </div>
        </div>
      </div>

      {/* 본문 */}
      <p className="text-zinc-300 text-sm leading-relaxed mb-6 text-center">{lp.content}</p>

      {/* 태그 */}
      {lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {lp.tags.map((tag) => (
            <span key={tag.id} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
              # {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 좋아요 버튼 */}
      <div className="flex justify-center mb-10">
        <button
          onClick={handleLikeToggle}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isLiked ? 'text-pink-500' : 'text-zinc-400 hover:text-pink-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isLiked ? 0 : 1.5}
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span className="text-white text-lg font-bold">{lp.likes.length}</span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t border-zinc-800 pt-8">
        {/* 댓글 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">댓글</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCommentOrder('asc')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                commentOrder === 'asc'
                  ? 'bg-white text-black border-white font-semibold'
                  : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentOrder('desc')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                commentOrder === 'desc'
                  ? 'bg-white text-black border-white font-semibold'
                  : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 댓글 입력 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            placeholder="댓글을 입력해주세요"
            maxLength={200}
            className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!commentInput.trim() || commentMutation.isPending}
            className="px-4 py-2.5 bg-pink-600 text-white rounded-lg text-sm font-semibold hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            작성
          </button>
        </div>
        {commentInput.length > 0 && commentInput.trim().length === 0 && (
          <p className="text-red-400 text-xs mb-3 -mt-4">공백만 입력할 수 없습니다.</p>
        )}

        {/* 댓글 목록 - 초기 로딩 시 상단 스켈레톤 */}
        {commentLoading ? (
          <CommentSkeletonList count={8} />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {comments.map((comment) => {
                const isAuthor = comment.author.name === currentUserName;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className="flex items-start gap-3">
                    {comment.author.avatar ? (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {comment.author.name[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-white text-sm font-semibold">{comment.author.name}</span>
                        {isAuthor && (
                          <div className="relative">
                            <button
                              onClick={() => handleToggleCommentMenu(comment.id)}
                              className="text-zinc-500 hover:text-white transition-colors"
                              aria-label="댓글 옵션"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                              </svg>
                            </button>
                            {openCommentMenuId === comment.id && (
                              <div className="absolute right-0 top-6 z-10 min-w-[110px] rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-lg shadow-black/50">
                                <button
                                  onClick={() => handleEditClick(comment.id, comment.content)}
                                  className="w-full px-3 py-2 text-left text-xs text-white hover:bg-zinc-800 rounded-lg"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                                  className="w-full px-3 py-2 text-left text-xs text-white hover:bg-zinc-800 rounded-lg"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editingCommentContent}
                            onChange={(e) => setEditingCommentContent(e.target.value)}
                            rows={3}
                            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={updateCommentMutation.isPending}
                              className="rounded-2xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded-2xl border border-zinc-700 px-4 py-2 text-xs text-white hover:border-pink-500 transition"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-zinc-400 text-sm mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 추가 로딩 - 하단 스켈레톤 */}
            {commentFetchingNext && (
              <div className="mt-4">
                <CommentSkeleton />
                <div className="mt-4">
                  <CommentSkeleton />
                </div>
              </div>
            )}

            {/* 무한스크롤 트리거 */}
            <div ref={bottomRef} className="h-4" />
          </>
        )}
      </div>

      {/* 수정 모달 */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">LP 수정</h2>

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">제목</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  maxLength={100}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  placeholder="LP 제목을 입력해주세요"
                />
                <p className="text-xs text-zinc-500 mt-1">{editFormData.title.length} / 100</p>
              </div>

              {/* 본문 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">본문</label>
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  maxLength={1000}
                  rows={6}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none"
                  placeholder="LP에 대한 설명을 입력해주세요"
                />
                <p className="text-xs text-zinc-500 mt-1">{editFormData.content.length} / 1000</p>
              </div>

              {/* 태그 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">태그</label>
                <input
                  type="text"
                  value={editFormData.tags}
                  onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  placeholder="태그를 쉼표로 구분해주세요 (예: 클래식, K팝, 발라드)"
                />
                <p className="text-xs text-zinc-500 mt-1">쉼표로 구분하여 여러 태그를 입력하세요</p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-zinc-600 hover:bg-zinc-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={updateMutation.isPending}
                className="flex-1 rounded-2xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LpDetailPage;