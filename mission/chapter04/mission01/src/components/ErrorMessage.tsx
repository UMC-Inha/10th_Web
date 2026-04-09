interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 text-center px-4">
    <div className="text-5xl">⚠️</div>
    <h2 className="text-xl font-bold text-red-500">오류가 발생했습니다</h2>
    <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">{message}</p>
  </div>
);

export default ErrorMessage;