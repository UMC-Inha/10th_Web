const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
      <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin" />
    </div>
    <p className="text-zinc-500 text-sm tracking-widest uppercase animate-pulse">불러오는 중...</p>
  </div>
);

export default LoadingSpinner;