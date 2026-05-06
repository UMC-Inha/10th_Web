import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLpDetail from '../hooks/useLpDetail';
import useInfiniteComments from '../hooks/useInfiniteComments';
import { useAuth } from '../context/AuthContext';
import { likeLp, deleteLp, createComment, deleteComment } from '../api/lp';
import { useQueryClient } from '@tanstack/react-query';
import CommentSkeleton from '../components/CommentSkeleton';

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('asc');
  const [commentText, setCommentText] = useState('');

  const { data, isLoading, isError, refetch } = useLpDetail(Number(lpId));

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteComments(Number(lpId), commentOrder);

  // 댓글 무한스크롤
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
  const comments = commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다!');
      navigate('/login');
      return;
    }
    try {
      await likeLp(lp.id);
      refetch();
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteLp(lp.id);
      navigate('/');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await createComment(lp.id, commentText);
      setCommentText('');
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['lpComments', lp.id] });
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteComment(lp.id, commentId);
      queryClient.invalidateQueries({ queryKey: ['lpComments', lp.id] });
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← 목록으로
      </button>

      {/* 썸네일 */}
      <img
        src={lp.thumbnail || 'https://via.placeholder.com/600'}
        alt={lp.title}
        className="w-full aspect-square object-cover rounded-lg mb-6"
      />

      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>

      {/* 업로드일 & 좋아요 */}
      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
        <span>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</span>
        <span>❤️ {lp.likes?.length ?? 0}</span>
      </div>

      {/* 태그 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {lp.tags?.map((tag) => (
          <span key={tag.id} className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            #{tag.name}
          </span>
        ))}
      </div>

      {/* 본문 */}
      <p className="text-gray-700 leading-relaxed mb-8">{lp.content}</p>

      {/* 버튼들 */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={handleLike}
          className="px-6 py-2 text-white rounded-md hover:bg-red-300 transition-colors cursor-pointer"
        >
          ❤️
        </button>
        {user && (
          <>
            <button
              onClick={() => navigate(`/lps/${lp.id}/edit`)}
              className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 border border-red-300 text-red-400 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
            >
              🗑️
            </button>
          </>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">댓글</h2>
          {/* 댓글 정렬 */}
          <div className="flex gap-2">
            <button
              onClick={() => setCommentOrder('asc')}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${commentOrder === 'asc' ? 'bg-blue-400 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentOrder('desc')}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${commentOrder === 'desc' ? 'bg-blue-400 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 댓글 작성란 */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력해주세요!"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-300 text-sm"
          >
            작성
          </button>
        </form>

        {/* 초기 댓글 로딩 스켈레톤 */}
        {isCommentsLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 댓글 목록 */}
        {!isCommentsLoading && (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-1 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                      {comment.author?.name?.[0] ?? '?'}
                    </div>
                    <span className="text-sm font-medium">{comment.author?.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {/* 본인 댓글만 삭제 버튼 표시 */}
                  {user && (
                    <button
                      onClick={() => handleCommentDelete(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 pl-10">{comment.content}</p>
              </div>
            ))}

            {/* 하단 추가 댓글 로딩 스켈레톤 */}
            {isFetchingNextPage && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CommentSkeleton key={i} />
                ))}
              </div>
            )}

            {/* 스크롤 감지 트리거 */}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LpDetailPage;