import { memo } from 'react';
import type { CommentDto } from '../../types/lp';
import { formatDate } from '../../utils/formatDate';

type CommentItemProps = {
  comment: CommentDto;
  isMyComment: boolean;
  isEditing: boolean;
  isMenuOpen: boolean;
  editingContent: string;
  isUpdatePending: boolean;
  onToggleMenu: () => void;
  onStartEdit: () => void;
  onRequestDelete: () => void;
  onEditingContentChange: (value: string) => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
  menuRef: React.RefObject<HTMLDivElement | null> | null;
};

const CommentItem = memo(function CommentItem({
  comment,
  isMyComment,
  isEditing,
  isMenuOpen,
  editingContent,
  isUpdatePending,
  onToggleMenu,
  onStartEdit,
  onRequestDelete,
  onEditingContentChange,
  onCancelEdit,
  onSubmitEdit,
  menuRef,
}: CommentItemProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-colors">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-xs font-semibold text-pink-400">
          {comment.authorId}
        </div>
        <span className="text-xs text-slate-400">사용자 #{comment.authorId}</span>
        <span className="ml-auto flex items-center gap-2 text-xs text-slate-600">
          {formatDate(comment.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}

          {isMyComment && !isEditing && (
            <div ref={isMenuOpen ? menuRef : null} className="relative">
              <button
                onClick={onToggleMenu}
                className="rounded p-0.5 text-slate-500 hover:text-white transition-colors"
                aria-label="댓글 메뉴"
              >
                •••
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-6 z-10 w-24 overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] shadow-xl">
                  <button
                    onClick={onStartEdit}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={onRequestDelete}
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

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editingContent}
            onChange={(e) => onEditingContentChange(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-pink-500/50 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancelEdit}
              className="rounded-md border border-white/20 px-3 py-1 text-xs text-slate-400 hover:bg-white/10 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSubmitEdit}
              disabled={isUpdatePending || !editingContent.trim()}
              className="rounded-md bg-pink-500 px-3 py-1 text-xs font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isUpdatePending ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
});

export default CommentItem;
