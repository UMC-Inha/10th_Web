import { useEffect, useRef } from 'react';
import ConfirmModal from '../modals/ConfirmModal';
import ErrorState from '../ui/ErrorState';
import SortToggle from '../ui/SortToggle';
import { SkeletonCommentList } from '../ui/SkeletonCard';
import {
  SKELETON_COMMENT_FETCH_MORE_COUNT,
  SKELETON_COMMENT_INITIAL_COUNT,
} from '../../constants/pagination';
import useLpComments from '../../hooks/useLpComments';
import CommentItem from './CommentItem';
import type { UserInfo } from '../../types/user';

type CommentSectionProps = {
  lpId: number;
  myInfo: UserInfo | undefined;
};

function CommentSection({ lpId, myInfo }: CommentSectionProps) {
  const {
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
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    handleCommentSubmit,
    handleStartEditComment,
    handleCancelEditComment,
    handleSubmitEditComment,
    closeMenu,
  } = useLpComments({ lpId, myInfo, loggedIn: true });

  const commentMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openMenuCommentId === null) return;

    const handleOutside = (e: MouseEvent) => {
      if (commentMenuRef.current && !commentMenuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [openMenuCommentId, closeMenu]);

  return (
    <section>
      {deleteCommentId !== null && (
        <ConfirmModal
          message="댓글을 삭제하시겠습니까?"
          confirmLabel="삭제"
          onConfirm={() => deleteCommentMutation.mutate(deleteCommentId)}
          onCancel={() => setDeleteCommentId(null)}
        />
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">댓글</h2>
        <SortToggle value={commentOrder} onChange={setCommentOrder} />
      </div>

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

      {isCommentsLoading && <SkeletonCommentList count={SKELETON_COMMENT_INITIAL_COUNT} />}

      {isCommentsError && (
        <ErrorState message="댓글을 불러오는 데 실패했습니다." onRetry={() => refetchComments()} />
      )}

      {isCommentsSuccess && (
        <>
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-600">
              아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  isMyComment={!!myInfo && myInfo.id === comment.authorId}
                  isEditing={editingCommentId === comment.id}
                  isMenuOpen={openMenuCommentId === comment.id}
                  editingContent={editingContent}
                  isUpdatePending={updateCommentMutation.isPending}
                  onToggleMenu={() =>
                    setOpenMenuCommentId(openMenuCommentId === comment.id ? null : comment.id)
                  }
                  onStartEdit={() => handleStartEditComment(comment.id, comment.content)}
                  onRequestDelete={() => {
                    setOpenMenuCommentId(null);
                    setDeleteCommentId(comment.id);
                  }}
                  onEditingContentChange={setEditingContent}
                  onCancelEdit={handleCancelEditComment}
                  onSubmitEdit={() => handleSubmitEditComment(comment.id)}
                  menuRef={openMenuCommentId === comment.id ? commentMenuRef : null}
                />
              ))}
            </div>
          )}

          {isCommentsFetchingNext && (
            <div className="mt-3">
              <SkeletonCommentList count={SKELETON_COMMENT_FETCH_MORE_COUNT} />
            </div>
          )}

          <div ref={commentTriggerRef} className="h-4" />

          {!commentsHasNext && comments.length > 0 && (
            <p className="mt-4 text-center text-xs text-slate-600">모든 댓글을 불러왔습니다.</p>
          )}
        </>
      )}
    </section>
  );
}

export default CommentSection;
