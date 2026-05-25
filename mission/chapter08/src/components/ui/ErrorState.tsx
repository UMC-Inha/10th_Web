type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
};

function ErrorState({
  message = '데이터를 불러오는 데 실패했습니다.',
  onRetry,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-slate-400">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-pink-500 px-5 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
          >
            다시 시도
          </button>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="rounded-lg border border-white/20 px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
