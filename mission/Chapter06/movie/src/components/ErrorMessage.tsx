interface Props {
  message?: string
  onRetry: () => void
}

const ErrorMessage = ({ message = '데이터를 불러오지 못했습니다.', onRetry }: Props) => (
  <div className="flex flex-col items-center gap-3 py-20">
    <p className="text-sm text-red-400">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded border border-neutral-600 px-4 py-2 text-sm text-neutral-300 hover:border-white hover:text-white"
    >
      재시도
    </button>
  </div>
)

export default ErrorMessage
