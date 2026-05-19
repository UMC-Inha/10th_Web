import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useLpDetail from '../hooks/useLpDetail';
import useInfiniteComments from '../hooks/useInfiniteComments';
import { useAuth } from '../context/AuthContext';
import { likeLp, deleteLp, createComment, updateComment, deleteComment } from '../api/lp';
import CommentSkeleton from '../components/CommentSkeleton';
import type { Comment } from '../types/lp';

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('asc');
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useLpDetail(Number(lpId));

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteComments(Number(lpId), commentOrder);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lp = data?.data;

  // commentsData 타입을 any로 캐스팅해서 pages 접근
  const comments: Comment[] =
    (commentsData as any)?.pages?.flatMap((page: any) => page.data.data) ?? [];

  const { mutate: likeMutate } = useMutation({
    mutationFn: () => likeLp(Number(lpId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lp', Number(lpId)] }),
    onError: () => alert('좋아요 처리에 실패했습니다.'),
  });

  const { mutate: deleteLpMutate, isPending: isDeletingLp } = useMutation({
    mutationFn: () => deleteLp(Number(lpId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/');
    },
    onError: () => alert('LP 삭제에 실패했습니다.'),
  });

  const { mutate: createCommentMutate, isPending: isCreatingComment } = useMutation({
    mutationFn: (content: string) => createComment(Number(lpId), content),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', Number(lpId)] });
    },
    onError: () => alert('댓글 작성에 실패했습니다.'),
  });

  const { mutate: updateCommentMutate, isPending: isUpdatingComment } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(Number(lpId), commentId, content),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', Number(lpId)] });
    },
    onError: () => alert('댓글 수정에 실패했습니다.'),
  });

  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(lpId), commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lpComments', Number(lpId)] }),
    onError: () => alert('댓글 삭제에 실패했습니다.'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600">
          다시 시도
        </button>
      </div>
    );
  }

  // LP 작성자 비교 - authorId 또는 author.id 둘 다 대응
  const lpAuthorId = (lp as any).authorId ?? (lp as any).author?.id;
  const isLpOwner = user && lpAuthorId && Number(user.id) === Number(lpAuthorId);

  // 댓글 작성자 비교 함수
  const isCommentOwner = (comment: any) => {
    const commentAuthorId = comment.authorId ?? comment.author?.id;
    return user && commentAuthorId && Number(user.id) === Number(commentAuthorId);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate('/')} className="mb-6 text-gray-500 hover:text-gray-300 transition-colors">
        ← 목록으로
      </button>

      <img
        src={lp.thumbnail || 'https://via.placeholder.com/600'}
        alt={lp.title}
        className="w-full aspect-square object-cover rounded-lg mb-6"
      />

      <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>

      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
        <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
        <span>❤️ {lp.likes?.length ?? 0}</span>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {lp.tags?.map((tag) => (
          <span key={tag.id} className="text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
            #{tag.name}
          </span>
        ))}
      </div>

      <p className="text-gray-700 leading-relaxed mb-8">{lp.content}</p>

      {/* 좋아요 + LP 수정/삭제 버튼 */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => likeMutate()}
          className="px-6 py-2 text-white rounded-md hover:bg-red-900/30 transition-colors border border-gray-600"
        >
          ❤️ {lp.likes?.length ?? 0}
        </button>

        {/* LP 작성자만 수정/삭제 버튼 표시 */}
        {isLpOwner && (
          <>
            <button
              onClick={() => navigate(`/lps/${lp.id}/edit`)}
              className="px-6 py-2 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-800 transition-colors"
            >
              ✏️ 수정
            </button>
            <button
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) deleteLpMutate();
              }}
              disabled={isDeletingLp}
              className="px-6 py-2 border border-red-400 text-red-400 rounded-md hover:bg-red-900/30 transition-colors disabled:opacity-50"
            >
              🗑️ 삭제
            </button>
          </>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">댓글</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCommentOrder('asc')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                commentOrder === 'asc'
                  ? 'bg-white text-black'
                  : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentOrder('desc')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                commentOrder === 'desc'
                  ? 'bg-white text-black'
                  : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 댓글 작성란 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!commentText.trim()) return;
            createCommentMutate(commentText);
          }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded-md px-4 py-2 text-sm outline-none focus:border-pink-500 text-white"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isCreatingComment}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-800 text-sm"
          >
            작성
          </button>
        </form>

        {isCommentsLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)}
          </div>
        )}

        {!isCommentsLoading && (
          <div className="flex flex-col gap-4">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex flex-col gap-1 border-b border-gray-800 pb-4">
                <div className="flex items-center justify-between">
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-300">
                      {comment.author?.name?.[0] ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{comment.author?.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  {/* 본인 댓글만 ··· 메뉴 버튼 */}
                  {isCommentOwner(comment) && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === comment.id ? null : comment.id)
                        }
                        className="text-gray-400 hover:text-white px-2 py-1 rounded transition-colors text-lg leading-none"
                      >
                        ⋮
                      </button>

                      {openMenuId === comment.id && (
                        <div className="absolute right-0 top-8 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden min-w-[90px]">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingContent(comment.content);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            ✏️ 수정
                          </button>
                          <button
                            onClick={() => {
                              deleteCommentMutate(comment.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                          >
                            🗑️ 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 댓글 내용 or 수정 input */}
                {editingCommentId === comment.id ? (
                  <div className="flex gap-2 pl-10 mt-1">
                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="flex-1 bg-[#1e1e1e] border border-gray-600 rounded-md px-3 py-1 text-sm text-white outline-none focus:border-pink-500"
                    />
                    <button
                      onClick={() => {
                        if (!editingContent.trim()) return;
                        updateCommentMutate({ commentId: comment.id, content: editingContent });
                      }}
                      disabled={isUpdatingComment}
                      className="text-green-400 hover:text-green-300 transition-colors px-2"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 pl-10">{comment.content}</p>
                )}
              </div>
            ))}

            {isFetchingNextPage && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
              </div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LpDetailPage;