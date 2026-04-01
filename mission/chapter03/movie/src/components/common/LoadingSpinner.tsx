// 로딩 스피너 컴포넌트
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-6xl animate-bounce">🍿</span>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-gray-400 text-md">영화 불러오는 중 🎥</span>
    </div>
  );
};

export default LoadingSpinner;
