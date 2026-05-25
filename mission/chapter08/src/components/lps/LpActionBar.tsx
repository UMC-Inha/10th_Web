type LpActionBarProps = {
  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  likeError: string;
  deleteError: string;
  isLikePending: boolean;
  isDeletePending: boolean;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function LpActionBar({
  likeCount,
  isLiked,
  isOwner,
  likeError,
  deleteError,
  isLikePending,
  isDeletePending,
  onLike,
  onEdit,
  onDelete,
}: LpActionBarProps) {
  return (
    <>
      {likeError && <p className="mb-2 text-xs text-red-400">{likeError}</p>}
      <div className="mb-10 flex flex-wrap gap-3">
        <button
          onClick={onLike}
          disabled={isLikePending}
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
          {isLiked ? '좋아요 취소' : '좋아요'} {likeCount}
        </button>

        {deleteError && <p className="w-full text-xs text-red-400">{deleteError}</p>}

        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              수정
            </button>
            <button
              onClick={onDelete}
              disabled={isDeletePending}
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default LpActionBar;
