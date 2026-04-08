type ErrorAlertProps = {
  message: string;
  onRetry?: () => void;
};

const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
  return (
    <div
      className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-5 text-center"
      role="alert"
    >
      <p className="text-sm font-medium text-red-900">문제가 발생했어요</p>
      <p className="mt-2 text-sm text-red-800/90 wrap-break-word">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={() => void onRetry()}
          className="mt-4 rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white"
        >
          다시 시도
        </button>
      ) : null}
    </div>
  );
};

export default ErrorAlert;
