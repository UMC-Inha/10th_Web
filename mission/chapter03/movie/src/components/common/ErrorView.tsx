interface ErrorViewProps {
  message: string;
}

// 에러 화면 컴포넌트
const ErrorView = ({ message }: ErrorViewProps) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-6 py-10 bg-gray-800 rounded-2xl shadow-lg max-w-sm">
      <span className="text-6xl animate-bounce">⚠️</span>
      <div className="flex flex-col gap-1">
        <p className="text-white font-bold text-xl">어머 이게 왜 이러지 . .</p>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
      <div className="w-full h-px bg-gray-700" />
      <p className="text-gray-500 text-xs">잠시 후 다시 시도해보세용 . .</p>
    </div>
  );
};

export default ErrorView;
